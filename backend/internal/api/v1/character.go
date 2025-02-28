package v1

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

// Character defines the structure of our character object.
type Character struct {
	Name          string `json:"name"`
	ID            int    `json:"id"`
	Description   string `json:"description"`
	CurrentMana   int    `json:"currentMana"`
	MaxMana       int    `json:"maxMana"`
	CurrentHealth int    `json:"currentHealth"`
	MaxHealth     int    `json:"maxHealth"`
}

func generateCharacterLLM(name, description string) Character {

	// TODO: will create character using llm

	return Character{
		Name:          name,
		ID:            1, // Mock ID
		Description:   description,
		CurrentMana:   4,   // Mock current mana
		MaxMana:       10,  // Mock max mana
		CurrentHealth: 99,  // Mock current health
		MaxHealth:     100, // Mock max health
	}
}

// getNewCharacter is an HTTP handler that creates a character object based on the provided name and description.
func getNewCharacter(w http.ResponseWriter, r *http.Request) {
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

	// Generate the character.
	character := generateCharacterLLM(requestData.Name, requestData.Description)
	fmt.Println("generate character called!")

	// Set the response header to indicate JSON content.
	w.Header().Set("Content-Type", "application/json")

	// Encode the character object to JSON and write it to the response.
	if err := json.NewEncoder(w).Encode(character); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// GetCharacter is an HTTP handler that returns a character object as JSON.
func GetCharacter(w http.ResponseWriter, r *http.Request) {
	// Extract the character ID from the URL path.
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid character ID", http.StatusBadRequest)
		return
	}

	// TODO: Get the character by ID from the database or other storage.

	// Create a sample character.
	character := Character{
		Name:          "John Doe",
		ID:            id,
		Description:   "Once upon a time, in a land far away...",
		CurrentMana:   4,
		MaxMana:       10,
		MaxHealth:     100,
		CurrentHealth: 99,
	}
	fmt.Println("get character called!")

	// Set the response header to indicate JSON content.
	w.Header().Set("Content-Type", "application/json")

	// Encode the character object to JSON and write it to the response.
	if err := json.NewEncoder(w).Encode(character); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// GetCharacters is an HTTP handler that returns all characters belonging to a user as JSON.
func GetCharacters(w http.ResponseWriter, r *http.Request) {
	// Extract the user ID from the URL path.
	userIDStr := chi.URLParam(r, "userID")
	_, err := strconv.Atoi(userIDStr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	// TODO: Get all characters belonging to the user by userID from the database or other storage.

	// Create sample characters.
	characters := []Character{
		{
			Name:          "John Doe",
			ID:            1,
			Description:   "Once upon a time, in a land far away...",
			CurrentMana:   4,
			MaxMana:       10,
			MaxHealth:     100,
			CurrentHealth: 99,
		},
		{
			Name:          "Jane Doe",
			ID:            2,
			Description:   "A brave warrior from the north.",
			CurrentMana:   5,
			MaxMana:       12,
			MaxHealth:     120,
			CurrentHealth: 110,
		},
	}
	fmt.Println("get characters called!")

	// Set the response header to indicate JSON content.
	w.Header().Set("Content-Type", "application/json")

	// Encode the characters slice to JSON and write it to the response.
	if err := json.NewEncoder(w).Encode(characters); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
