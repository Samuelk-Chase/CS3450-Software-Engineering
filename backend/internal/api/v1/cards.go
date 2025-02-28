package v1

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
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

// generateCard creates a card object with the given name and description.
func generateCard(name, description string) Card {
	return Card{
		ID:          1, // Mock ID
		Name:        name,
		Type:        "Magic", // Mock type
		Description: description,
		ImageURL:    "http://example.com/sample-card.jpg", // Mock image URL
		Level:       1,                                    // Mock level
		Effect:      "Sample effect",                      // Mock effect
	}
}

// getCards is an HTTP handler that returns a deck object as JSON.
func getCards(w http.ResponseWriter, r *http.Request) {
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

// Post: takes item name and description and returns a card object as JSON
func getCard(w http.ResponseWriter, r *http.Request) {
	// Ensure the request method is POST.
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Parse the request body.
	var requestData struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Generate the card.
	card := generateCard(requestData.Name, requestData.Description)
	fmt.Println("generate card called!")

	// Set the response header to indicate JSON content.
	w.Header().Set("Content-Type", "application/json")

	// Encode the card object to JSON and write it to the response.
	if err := json.NewEncoder(w).Encode(card); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
