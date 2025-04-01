package v1

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	db "beanboys-lastgame-backend/internal/db/cards_db"
	"encoding/base64"
	"os"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/go-chi/chi/v5"
	"github.com/openai/openai-go"
)

// Card defines the structure of our card object.
type Card struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Type        string `json:"type"`
	Description string `json:"description"`
	ImageURL    string `json:"image_url"`
	Level       int    `json:"level"`
	Effect      string `json:"effect"`
	SoundEffect string `json:"sound_effect"` // New field for sound effect
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
func generateCard(prompt string) (db.Card, error) {
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

	// Create the db.Card using the parsed data
	card := db.Card{
		Title:           jsonCard.Name,
		CardDescription: jsonCard.Description,
		ImageURL:        "", // Placeholder, will be set after image upload
		PowerLevel:      1,  // Default level
		TypeID:          1,  // Default type
		ManaCost:        jsonCard.Cost,
		SoundEffect:     "", // Placeholder, will be set after sound effect generation
		CharacterID:     0,  // Default character ID
	}

	// Generate the sound effect for the card
	soundEffect, err := generateSoundEffect(card.CardDescription)
	if err != nil {
		return db.Card{}, fmt.Errorf("Sound effect generation error: %v", err)
	}
	card.SoundEffect = soundEffect // Assign the sound effect to the card

	fmt.Println("Card Generated")
	imageURL, err := generateImageAndUploadToS3(card, prompt)
	if err != nil {
		return db.Card{}, fmt.Errorf("Image upload error: %v", err)
	}
	fmt.Println("Image generated and stored")
	card.ImageURL = imageURL

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

// generateSoundEffect uses the sound_effect_card_prompt to determine the sound effect for a card
func generateSoundEffect(description string) (string, error) {
	client := openai.NewClient()
	messages := openai.F([]openai.ChatCompletionMessageParamUnion{
		openai.SystemMessage(sound_effect_card_prompt),
		openai.UserMessage(description),
	})

	req := openai.ChatCompletionNewParams{
		Model:    openai.F(openai.ChatModelGPT4oMini),
		Messages: messages,
	}

	response, err := client.Chat.Completions.New(context.Background(), req)
	if err != nil {
		return "", fmt.Errorf("ChatCompletion error: %v", err)
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
		Region: aws.String("us-east-2"),
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
func getCards(w http.ResponseWriter, r *http.Request) {
	fmt.Println("get cards called!")

	// Extract the deck ID from the URL path.
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid deck ID", http.StatusBadRequest)
		return
	}

	//TODO: Get the deck by ID from the database or other storage.

	// Create a sample deck.
	deck := Deck{
		ID:       id,
		Quantity: 3,
	}
	fmt.Println("get cards called!")

	// Set the response header to indicate JSON content.
	w.Header().Set("Content-Type", "application/json")

	// Encode the deck object to JSON and write it to the response.
	if err := json.NewEncoder(w).Encode(deck); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func getCard(w http.ResponseWriter, r *http.Request) {
	fmt.Println("get card called!")

	// Ensure the request method is POST.
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Parse the request body.
	var requestData struct {
		Prompt      string `json:"prompt"`
		CharacterID int    `json:"character_id"` // Add character_id to the request body
	}
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Generate the card using the provided prompt
	card, err := generateCard(requestData.Prompt)
	if err != nil {
		http.Error(w, fmt.Sprintf("Card generation error: %v", err), http.StatusInternalServerError)
		return
	}

	// Associate the card with the character ID
	card.CharacterID = requestData.CharacterID // Assuming the Card struct in the database has a CharacterID field

	// Save the card to the database
	cardID, err := db.InsertCard(card)
	if err != nil {
		http.Error(w, fmt.Sprintf("Database insert error: %v", err), http.StatusInternalServerError)
		return
	}

	// Retrieve the inserted card to include in the response
	insertedCard, err := db.GetCardByID(cardID)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to retrieve inserted card: %v", err), http.StatusInternalServerError)
		return
	}

	// Set the response header to indicate JSON content
	w.Header().Set("Content-Type", "application/json")

	// Encode the db.Card object to JSON and write it to the response
	if err := json.NewEncoder(w).Encode(insertedCard); err != nil {
		http.Error(w, fmt.Sprintf("JSON encoding error: %v", err), http.StatusInternalServerError)
	}
}
