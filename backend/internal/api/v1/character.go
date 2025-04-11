package v1

import (
	"beanboys-lastgame-backend/internal/db"
	story_db "beanboys-lastgame-backend/internal/db/story_db"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/go-chi/chi/v5"
	"github.com/openai/openai-go"
)

// Character defines the structure of a character object.
type Character struct {
	CharacterID   int    `json:"character_id"`
	UserID        int    `json:"user_id"`
	Name          string `json:"character_name"`
	Description   string `json:"description"`
	CurrentMana   int    `json:"current_mana"`
	MaxMana       int    `json:"max_mana"`
	CurrentHealth int    `json:"current_hp"` // updated tag
	MaxHealth     int    `json:"max_hp"`     // updated tag
	ImageURL      string `json:"image_url"`
}

// JSONCharacter is used when parsing the LLM response.
type JSONCharacter struct {
	Description string `json:"description"`
	MaxMana     int    `json:"max_mana"`
	MaxHealth   int    `json:"max_health"`
}

// generateCharacterImageAndUploadToS3 generates an image from a prompt and uploads it to S3.
func generateCharacterImageAndUploadToS3(characterName string, prompt string) (string, error) {
	client := openai.NewClient()
	response, err := client.Images.Generate(context.Background(), openai.ImageGenerateParams{
		Prompt:         openai.F(prompt),
		Model:          openai.F(openai.ImageModelDallE3),
		ResponseFormat: openai.F(openai.ImageGenerateParamsResponseFormatB64JSON),
		Size:           openai.F(openai.ImageGenerateParamsSize1024x1024),
	})
	if err != nil {
		return "", fmt.Errorf("Image generation error: %v", err)
	}

	imageBytes, err := base64.StdEncoding.DecodeString(response.Data[0].B64JSON)
	if err != nil {
		return "", fmt.Errorf("Error decoding base64 image: %v", err)
	}

	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(os.Getenv("AWS_REGION")),
	})
	if err != nil {
		return "", fmt.Errorf("AWS session error: %v", err)
	}

	uploader := s3manager.NewUploader(sess)
	fileName := fmt.Sprintf("%s.jpg", strings.ReplaceAll(characterName, " ", "_"))

	_, err = uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(os.Getenv("AWS_BUCKET")),
		Key:    aws.String("character_images/" + fileName),
		Body:   strings.NewReader(string(imageBytes)),
	})
	if err != nil {
		return "", fmt.Errorf("S3 upload error: %v", err)
	}

	imageURL := fmt.Sprintf("https://%s.s3.amazonaws.com/character_images/%s", os.Getenv("AWS_BUCKET"), fileName)
	return imageURL, nil
}

func generateCharacterLLM(userID int, name string) (Character, error) {
	fmt.Println("Generating character for user:", userID)
	client := openai.NewClient()
	messages := openai.F([]openai.ChatCompletionMessageParamUnion{
		openai.SystemMessage(character_system_prompt),
		openai.UserMessage(name),
	})

	req := openai.ChatCompletionNewParams{
		Model:    openai.F(openai.ChatModelGPT4oMini),
		Messages: messages,
	}

	response, err := client.Chat.Completions.New(context.Background(), req)
	if err != nil {
		log.Fatalf("ChatCompletion error: %v", err)
	}

	jsonCharacter := JSONCharacter{}
	err = json.Unmarshal([]byte(response.Choices[0].Message.Content), &jsonCharacter)
	if err != nil {
		fmt.Println("Error parsing JSON:", err)
	}

	// Ensure MaxMana is at least 80
	if jsonCharacter.MaxMana < 80 {
		jsonCharacter.MaxMana = 80
	}

	newCharacter := Character{
		UserID:        userID,
		Name:          name,
		Description:   jsonCharacter.Description,
		CurrentMana:   jsonCharacter.MaxMana, // Set to at least 80
		MaxMana:       jsonCharacter.MaxMana, // Set to at least 80
		CurrentHealth: jsonCharacter.MaxHealth,
		MaxHealth:     jsonCharacter.MaxHealth,
	}

	imagePrompt := fmt.Sprintf("Generate a character portrait for %s: %s", name, jsonCharacter.Description)
	imageURL, err := generateCharacterImageAndUploadToS3(name, imagePrompt)
	if err != nil {
		return Character{}, fmt.Errorf("Image generation error: %v", err)
	}

	characterID, err := db.InsertCharacter(db.Character{
		UserID:        newCharacter.UserID,
		Name:          newCharacter.Name,
		CurrentMana:   newCharacter.CurrentMana,
		MaxMana:       newCharacter.MaxMana,
		CurrentHealth: newCharacter.CurrentHealth,
		MaxHealth:     newCharacter.MaxHealth,
		ImageURL:      imageURL,
		Description:   newCharacter.Description,
	})
	if err != nil {
		fmt.Println("Error inserting character:", err)
		return Character{}, err
	}

	newCharacter.CharacterID = characterID
	fmt.Println("Character created successfully with ID:", characterID)

	return newCharacter, nil
}

func getIntroForCharacter(characterID int, adventureDescription string) (string, error) {
	character, err := db.GetCharacterByID(characterID)
	if err != nil {
		return "", fmt.Errorf("failed to retrieve character: %w", err)
	}

	messageText := "Name: " + character.Name + "\n"
	if adventureDescription != "" {
		messageText += "Adventure: " + adventureDescription
	} else {
		messageText += "Description: " + character.Description
	}

	messages := []openai.ChatCompletionMessageParamUnion{
		openai.SystemMessage(intro_system_prompt),
		openai.UserMessage(messageText),
	}
	req := openai.ChatCompletionNewParams{
		Model:    openai.F(openai.ChatModelGPT4oMini),
		Messages: openai.F(messages),
	}

	client := openai.NewClient()
	response, err := client.Chat.Completions.New(context.Background(), req)
	if err != nil {
		return "", fmt.Errorf("ChatCompletion error: %w", err)
	}
	introResponse := response.Choices[0].Message.Content

	story := story_db.Story{
		Prompt:      messageText,
		Response:    introResponse,
		CharacterID: characterID,
	}
	story_db.InsertStory(story)

	return introResponse, nil
}

// getNewCharacter handles character creation and story intro generation.
func getNewCharacter(w http.ResponseWriter, r *http.Request) {
	fmt.Println("getNewCharacter called!")

	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var requestData struct {
		UserID               string `json:"user_id"` // Change to string to handle incoming JSON
		Name                 string `json:"name"`
		Description          string `json:"description"`
		AdventureDescription string `json:"adventure_description"`
	}

	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		fmt.Printf("❌ Error decoding request body: %v\n", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Convert user_id to an integer
	userID, err := strconv.Atoi(requestData.UserID)
	if err != nil {
		fmt.Printf("❌ Error converting user_id to int: %v\n", err)
		http.Error(w, "Invalid user_id format", http.StatusBadRequest)
		return
	}

	// Use userID as an integer in the rest of the function
	fmt.Printf("ℹ️ Generating character for user ID: %d, Name: %s\n", userID, requestData.Name)
	character, err := generateCharacterLLM(userID, requestData.Name)
	if err != nil {
		fmt.Printf("❌ Error generating character: %v\n", err)
		http.Error(w, "Failed to create character", http.StatusInternalServerError)
		return
	}
	fmt.Printf("✅ Character generated successfully: %+v\n", character)

	// Generate the story introduction using the adventure description.
	fmt.Printf("ℹ️ Generating intro for character ID: %d, Adventure Description: %s\n", character.CharacterID, requestData.AdventureDescription)
	intro, err := getIntroForCharacter(character.CharacterID, requestData.AdventureDescription)
	if err != nil {
		fmt.Printf("❌ Error generating intro: %v\n", err)
		intro = "Welcome to your adventure!"
	} else {
		fmt.Printf("✅ Intro generated successfully: %s\n", intro)
	}

	responseData := struct {
		Character Character `json:"character"`
		Intro     string    `json:"intro"`
	}{
		Character: character,
		Intro:     intro,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(responseData); err != nil {
		fmt.Printf("❌ Error encoding response: %v\n", err)
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
	fmt.Printf("✅ Response sent successfully for character ID: %d\n", character.CharacterID)
}

func GetCharacter(w http.ResponseWriter, r *http.Request) {
	characterIDStr := chi.URLParam(r, "id")
	characterID, err := strconv.Atoi(characterIDStr)
	if err != nil {
		http.Error(w, "Invalid character ID", http.StatusBadRequest)
		return
	}

	fmt.Println("Fetching character with ID:", characterID)

	character, err := db.GetCharacterByID(characterID)
	if err != nil {
		fmt.Println("Error fetching character:", err)
		http.Error(w, "Character not found", http.StatusNotFound)
		return
	}

	fmt.Println("Fetched character:", character)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(character)
}

// GetCharacters retrieves all characters belonging to a user.
func GetCharacters(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.URL.Query().Get("user_id")
	if userIDStr == "" {
		fmt.Println("❌ Missing user_id in request!")
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		fmt.Println("❌ Invalid user_id:", userIDStr)
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	fmt.Println("✅ Fetching characters for user ID:", userID)

	characters, err := db.GetUserCharacters(userID)
	if err != nil {
		fmt.Println("❌ Error fetching characters from DB:", err)
		http.Error(w, "Failed to fetch characters", http.StatusInternalServerError)
		return
	}

	if len(characters) == 0 {
		fmt.Println("⚠ No characters found for user ID:", userID)
		http.Error(w, "No characters found", http.StatusNotFound)
		return
	}

	fmt.Println("✅ Characters found:", characters)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(characters)
}
