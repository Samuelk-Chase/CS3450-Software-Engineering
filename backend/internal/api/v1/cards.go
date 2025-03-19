package v1

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	db "beanboys-lastgame-backend/internal/db/cards_db"

	"github.com/go-chi/chi/v5"
	"github.com/openai/openai-go"
)

// Deck defines the structure of our deck object.
type Deck struct {
	ID       int `json:"id"`
	Quantity int `json:"quantity"`
}

// Card defines the structure of our card object.
type Card struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Type        string `json:"type"`
	Description string `json:"description"`
	ImageURL    string `json:"image_url"`
	Level       int    `json:"level"`
	Effect      string `json:"effect"`
}

type JSONCard struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Cost        int    `json:"cost"`
}

// generateCard creates a card object with the given name and description.
func generateCard(prompt string) db.Card {

	// Get the response from the OpenAI API
	client := openai.NewClient()
	// Define the messages for the chat completion
	messages := openai.F([]openai.ChatCompletionMessageParamUnion{
		openai.SystemMessage(card_system_prompt),
		openai.UserMessage(prompt),
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

	jsonCard := JSONCard{}

	err = json.Unmarshal([]byte(response.Choices[0].Message.Content), &jsonCard)
	if err != nil {
		fmt.Println("Error parsing JSON:", err)
	}

	return db.Card{
		TypeID:          1, // Default type ID
		Title:           jsonCard.Name,
		ManaCost:        jsonCard.Cost, // Default mana cost
		CardDescription: jsonCard.Description,
		ImageURL:        "http://example.com/sample-card.jpg", // Default image URL
		PowerLevel:      10,                                   // Default power level
	}
}

// getCards is an HTTP handler that returns a deck object as JSON.
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
		Prompt string `json:"prompt"`
	}
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Generate the card using the provided name and description.
	card := generateCard(requestData.Prompt)

	// Insert the card into the database.
	cardID, err := db.InsertCard(card)
	if err != nil {
		http.Error(w, "Failed to insert card", http.StatusInternalServerError)
		return
	}

	// Retrieve the inserted card to return as a response.
	insertedCard, err := db.GetCardByID(cardID)
	if err != nil {
		http.Error(w, "Failed to retrieve inserted card", http.StatusInternalServerError)
		return
	}

	// Set the response header to indicate JSON content.
	w.Header().Set("Content-Type", "application/json")

	// Encode the card object to JSON and write it to the response.
	if err := json.NewEncoder(w).Encode(insertedCard); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
