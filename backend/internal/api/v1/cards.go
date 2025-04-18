package v1

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	db "beanboys-lastgame-backend/internal/db/cardsdb"
	"encoding/base64"
	"os"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/go-chi/chi/v5"
	"github.com/openai/openai-go"
)

// Card defines the structure of our card object
type Card struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Type        string `json:"type"`
	Description string `json:"description"`
	ImageURL    string `json:"image_url"`
	Level       int    `json:"level"`
	Effect      string `json:"effect"`
	CharacterID int    `json:"character_id"`
}

type JSONCard struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Cost        int    `json:"cost"`
}

// Deck defines the structure of our deck object.
type Deck struct {
	ID       int `json:"id"`
	Quantity int `json:"quantity"`
}

// generateCard creates a card object with the given name and description.
func generateCard(prompt string, characterID int) (db.Card, error) {
	// Get the response from OpenAI API
	client := openai.NewClient()
	messages := openai.F([]openai.ChatCompletionMessageParamUnion{
		openai.SystemMessage(card_system_prompt),
		openai.UserMessage(prompt),
	})

	req := openai.ChatCompletionNewParams{
		Model:    openai.F(openai.ChatModelGPT4oMini),
		Messages: messages,
	}

	response, err := client.Chat.Completions.New(context.Background(), req)
	if err != nil {
		log.Fatalf("ChatCompletion error: %v", err)
	}

	jsonCard := JSONCard{}

	err = json.Unmarshal([]byte(response.Choices[0].Message.Content), &jsonCard)
	if err != nil {
		fmt.Println("Error parsing JSON:", err)
	}

	// Determine card type based on keywords in the response
	var cardType int
	if strings.Contains(jsonCard.Description, "Stunned") {
		cardType = 1
	} else if strings.Contains(jsonCard.Description, "Confused") {
		cardType = 2
	} else if strings.Contains(jsonCard.Description, "Exposed") {
		cardType = 3
	} else if strings.Contains(jsonCard.Description, "Weakened") {
		cardType = 4
	} else if strings.Contains(jsonCard.Description, "Slowed") {
		cardType = 5
	} else {
		cardType = 0 // Default ID for Normal or unknown types
	}

	// Create the db.Card using the parsed data
	card := db.Card{
		Title:           jsonCard.Name,
		CardDescription: jsonCard.Description,
		ImageURL:        "",       // Placeholder, will be set after image upload
		PowerLevel:      1,        // Default level
		TypeID:          cardType, // Set type based on cardType
		ManaCost:        jsonCard.Cost,
		CharacterID:     characterID, // Add character ID to the card
	}

	// Generate sound effect for the card
	soundEffect, err := generateSoundEffect(card.Title, card.CardDescription)
	if err != nil {
		return db.Card{}, fmt.Errorf("Sound effect generation error: %v", err)
	}
	card.SoundEffect = soundEffect

	fmt.Println("Card Generated")
	imageURL, err := generateImageAndUploadToS3(card, prompt)
	if err != nil {
		return db.Card{}, fmt.Errorf("Image upload error: %v", err)
	}

	fmt.Println("Image generated and stored")
	card.ImageURL = imageURL

	//card.ImageURL = "../../character_images/bean_boy.png"
	cardID, err := db.InsertCard(card)
	if err != nil {
		return db.Card{}, fmt.Errorf("Database insert error: %v", err)
	}

	insertedCard, err := db.GetCardByID(cardID)
	if err != nil {
		return db.Card{}, fmt.Errorf("Failed to retrieve inserted card: %v", err)
	}

	return insertedCard, nil
}

// generateImageAndUploadToS3 generates an image from prompt and uploads it to S3
func generateImageAndUploadToS3(card db.Card, prompt string) (string, error) {
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
	fileName := fmt.Sprintf("%s.jpg", strings.ReplaceAll(card.Title, " ", "_"))

	_, err = uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(os.Getenv("AWS_BUCKET")),
		Key:    aws.String("card_images/" + fileName),
		Body:   strings.NewReader(string(imageBytes)),
	})
	if err != nil {
		return "", fmt.Errorf("S3 upload error: %v", err)
	}

	imageURL := fmt.Sprintf("https://%s.s3.amazonaws.com/card_images/%s", os.Getenv("AWS_BUCKET"), fileName)
	return imageURL, nil
}

// generateSoundEffect generates a sound effect for the card using OpenAI
func generateSoundEffect(name, description string) (string, error) {
	client := openai.NewClient()
	prompt := fmt.Sprintf(`{
		"name": "%s",
		"description": "%s"
	}`, name, description)

	response, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model: openai.F(openai.ChatModelGPT4oMini),
		Messages: openai.F([]openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage(sound_effect_card_prompt),
			openai.UserMessage(prompt),
		}),
	})
	if err != nil {
		return "", fmt.Errorf("OpenAI sound effect generation error: %v", err)
	}

	var soundEffectResponse struct {
		SoundEffect string `json:"sound_effect"`
	}
	err = json.Unmarshal([]byte(response.Choices[0].Message.Content), &soundEffectResponse)
	if err != nil {
		return "", fmt.Errorf("Error parsing sound effect JSON: %v", err)
	}

	return soundEffectResponse.SoundEffect, nil
}

func getCards(w http.ResponseWriter, r *http.Request) {
	fmt.Println("get cards called!")

	// Extract the character ID from the URL path
	characterIDStr := chi.URLParam(r, "id")
	characterID, err := strconv.Atoi(characterIDStr)
	if err != nil {
		http.Error(w, "Invalid character ID", http.StatusBadRequest)
		return
	}

	// Get cards from the database
	cards, err := db.GetCardsByCharacterID(characterID)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error fetching cards: %v", err), http.StatusInternalServerError)
		return
	}

	// Set the response header to indicate JSON content
	w.Header().Set("Content-Type", "application/json")

	// Create a response object with the cards array
	response := struct {
		Cards []db.Card `json:"cards"`
	}{
		Cards: cards,
	}

	// Encode the response object to JSON and write to response
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func getCard(w http.ResponseWriter, r *http.Request) {
	fmt.Println("getCard endpoint called!")

	// Ensure the request method is POST.
	if r.Method != http.MethodPost {
		fmt.Println("❌ Invalid request method. Expected POST.")
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Parse the request body.
	var requestData struct {
		Prompt      string `json:"prompt"`
		CharacterID int    `json:"character_id"`
	}
	fmt.Println("ℹ️ Decoding request body...")
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		fmt.Printf("❌ Error decoding request body: %v\n", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	fmt.Printf("✅ Request body decoded successfully: %+v\n", requestData)

	// Generate the card using the provided prompt
	fmt.Printf("ℹ️ Generating card for CharacterID: %d with Prompt: %s\n", requestData.CharacterID, requestData.Prompt)
	card, err := generateCard(requestData.Prompt, requestData.CharacterID)
	if err != nil {
		fmt.Printf("❌ Card generation error: %v\n", err)
		http.Error(w, fmt.Sprintf("Card generation error: %v", err), http.StatusInternalServerError)
		return
	}
	fmt.Printf("✅ Card generated successfully: %+v\n", card)

	// Set the response header to indicate JSON content
	w.Header().Set("Content-Type", "application/json")

	// Encode the db.Card object to JSON and write it to the response
	fmt.Println("ℹ️ Encoding card to JSON...")
	if err := json.NewEncoder(w).Encode(card); err != nil {
		fmt.Printf("❌ JSON encoding error: %v\n", err)
		http.Error(w, fmt.Sprintf("JSON encoding error: %v", err), http.StatusInternalServerError)
		return
	}
	fmt.Println("✅ Card response sent successfully!")
}
