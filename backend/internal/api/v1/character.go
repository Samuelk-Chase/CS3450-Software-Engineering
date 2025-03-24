package v1

import (
	"beanboys-lastgame-backend/internal/db"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

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

}

type JSONCharacter struct {
	Description string `json:"description"`
	MaxMana     int    `json:"max_mana"`
	MaxHealth   int    `json:"max_hp"`
}

type JSONCharacter struct {
	Description string `json:"description"`
	MaxMana     int    `json:"max_mana"`
	MaxHealth   int    `json:"max_health"`
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
		Name:          name, // Now only includes `character_name`
		Description:   jsonCharacter.Description,
		CurrentMana:   jsonCharacter.MaxMana,
		MaxMana:       jsonCharacter.MaxMana,
		CurrentHealth: jsonCharacter.MaxHealth, // Uses `current_hp`
		MaxHealth:     jsonCharacter.MaxHealth, // Uses `max_hp`
	}

	// Insert into database
	characterID, err := db.InsertCharacter(db.Character{
		UserID:        newCharacter.UserID,
		Name:          newCharacter.Name, // Uses `character_name`
		CurrentMana:   newCharacter.CurrentMana,
		MaxMana:       newCharacter.MaxMana,
		CurrentHealth: newCharacter.CurrentHealth, // Uses `current_hp`
		MaxHealth:     newCharacter.MaxHealth,     // Uses `max_hp`
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
