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

// getCard is an HTTP handler that returns a card object as JSON.
func getCard(w http.ResponseWriter, r *http.Request) {
	// Extract the card ID from the URL path.
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid card ID", http.StatusBadRequest)
		return
	}

	//TODO: Get the card by ID from the database or other storage.

	// Create a sample card.
	card := Card{
		ID:          id,
		Name:        "Sample Card",
		Type:        "Magic",
		Description: "This is a sample card.",
		ImageURL:    "http://example.com/sample-card.jpg",
		Level:       1,
		Effect:      "Sample effect",
	}
	fmt.Println("get card called!")

	// Set the response header to indicate JSON content.
	w.Header().Set("Content-Type", "application/json")

	// Encode the card object to JSON and write it to the response.
	if err := json.NewEncoder(w).Encode(card); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
