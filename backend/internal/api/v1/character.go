package v1

import (
	"beanboys-lastgame-backend/internal/db"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"encoding/base64"
	"os"
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

// type JSONCharacter struct {
// 	Description string `json:"description"`
// 	MaxMana     int    `json:"max_mana"`
// 	MaxHealth   int    `json:"max_hp"`
// }

type JSONCharacter struct {
	Description string `json:"description"`
	MaxMana     int    `json:"max_mana"`
	MaxHealth   int    `json:"max_health"`
}

// generateCharacterImageAndUploadToS3 generates an image from prompt and uploads it to S3
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

	// Get the response from the OpenAI API
	client := openai.NewClient()
	// Define the messages for the chat completion
	messages := openai.F([]openai.ChatCompletionMessageParamUnion{
		openai.SystemMessage(character_system_prompt),
		openai.UserMessage(name),
	})

	req := openai.ChatCompletionNewParams{
		Model:    openai.F(openai.ChatModelGPT4oMini),
		Messages: messages,
	}

	// Make the API request
	response, err := client.Chat.Completions.New(context.Background(), req)
	if err != nil {
		log.Fatalf("ChatCompletion error: %v", err)
	}

	jsonCharacter := JSONCharacter{}

	err = json.Unmarshal([]byte(response.Choices[0].Message.Content), &jsonCharacter)
	if err != nil {
		fmt.Println("Error parsing JSON:", err)
	}

	newCharacter := Character{
		UserID:        userID,
		Name:          name,
		Description:   jsonCharacter.Description,
		CurrentMana:   jsonCharacter.MaxMana,
		MaxMana:       jsonCharacter.MaxMana,
		CurrentHealth: jsonCharacter.MaxHealth,
		MaxHealth:     jsonCharacter.MaxHealth,
	}

	// Generate and upload character image
	imagePrompt := fmt.Sprintf("Generate a character portrait for %s: %s", name, jsonCharacter.Description)
	imageURL, err := generateCharacterImageAndUploadToS3(name, imagePrompt)
	if err != nil {
		return Character{}, fmt.Errorf("Image generation error: %v", err)
	}

	// Insert into database with image URL
	characterID, err := db.InsertCharacter(db.Character{
		UserID:        newCharacter.UserID,
		Name:          newCharacter.Name,
		CurrentMana:   newCharacter.CurrentMana,
		MaxMana:       newCharacter.MaxMana,
		CurrentHealth: newCharacter.CurrentHealth,
		MaxHealth:     newCharacter.MaxHealth,
		ImageURL:      imageURL,
	})
	if err != nil {
		fmt.Println("Error inserting character:", err)
		return Character{}, err
	}

	newCharacter.CharacterID = characterID
	fmt.Println("Character created successfully with ID:", characterID)

	return newCharacter, nil
}

// getNewCharacter is an HTTP handler that creates a character based on user input.
func getNewCharacter(w http.ResponseWriter, r *http.Request) {
	fmt.Println("getNewCharacter called!")

	// Ensure the request method is POST.
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Parse request body.
	var requestData struct {
		UserID      int    `json:"user_id"`
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Generate character and store in DB.
	character, err := generateCharacterLLM(requestData.UserID, requestData.Name)
	if err != nil {
		http.Error(w, "Failed to create character", http.StatusInternalServerError)
		return
	}

	// Return created character as response.
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(character)
}

// GetCharacter retrieves a character by ID and ensures it belongs to the logged-in user.
func GetCharacter(w http.ResponseWriter, r *http.Request) {
	characterIDStr := chi.URLParam(r, "id")
	characterID, err := strconv.Atoi(characterIDStr)
	if err != nil {
		http.Error(w, "Invalid character ID", http.StatusBadRequest)
		return
	}

	fmt.Println("Fetching character with ID:", characterID)

	character, err := db.GetCharacterByID(characterID) // ✅ Fetch from DB
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
	userIDStr := r.URL.Query().Get("user_id") // ✅ Read user_id from query params
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

	characters, err := db.GetUserCharacters(userID) // ✅ Fetch characters from DB
	if err != nil {
		fmt.Println("❌ Error fetching characters from DB:", err)
		http.Error(w, "Failed to fetch characters", http.StatusInternalServerError)
		return
	}

	if len(characters) == 0 {
		fmt.Println("⚠ No characters found for user ID:", userID)
		http.Error(w, "No characters found", http.StatusNotFound) // ✅ Return explicit 404
		return
	}

	fmt.Println("✅ Characters found:", characters)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(characters)
}
