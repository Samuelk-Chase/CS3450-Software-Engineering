package db

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
)

// Character struct for database operations
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

// InsertCharacter adds a new character to the database.
func InsertCharacter(character Character) (int, error) {
	supabaseURL := os.Getenv("SUPABASE_URL") + "/rest/v1/character"
	supabaseKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")

	// Remove `description` since it's not in the table
	body, err := json.Marshal(map[string]interface{}{
		"user_id":        character.UserID,
		"character_name": character.Name, // Matches `character_name`
		"current_hp":     character.CurrentHealth,
		"max_hp":         character.MaxHealth,
		"current_mana":   character.CurrentMana,
		"max_mana":       character.MaxMana,
	})
	if err != nil {
		return 0, err
	}

	req, err := http.NewRequest("POST", supabaseURL, bytes.NewBuffer(body))
	if err != nil {
		return 0, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", supabaseKey)
	req.Header.Set("Authorization", "Bearer "+supabaseKey)
	req.Header.Set("Prefer", "return=representation") // Return inserted data

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	// Debug print Supabase response
	respBody, _ := io.ReadAll(resp.Body)
	fmt.Println("Supabase Response:", string(respBody))

	if resp.StatusCode != http.StatusCreated {
		return 0, errors.New("failed to insert character")
	}

	var insertedCharacters []Character
	if err := json.Unmarshal(respBody, &insertedCharacters); err != nil {
		return 0, err
	}

	if len(insertedCharacters) == 0 {
		return 0, errors.New("character insertion failed")
	}

	return insertedCharacters[0].CharacterID, nil
}

// GetCharacterByID retrieves a character by its ID.
func GetCharacterByID(characterID int) (Character, error) {
	supabaseURL := fmt.Sprintf("%s/rest/v1/character?character_id=eq.%d", os.Getenv("SUPABASE_URL"), characterID)
	supabaseKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")

	req, err := http.NewRequest("GET", supabaseURL, nil)
	if err != nil {
		return Character{}, err
	}
	req.Header.Set("apikey", supabaseKey)
	req.Header.Set("Authorization", "Bearer "+supabaseKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return Character{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return Character{}, errors.New("character not found")
	}

	var characters []Character
	if err := json.NewDecoder(resp.Body).Decode(&characters); err != nil {
		return Character{}, err
	}

	if len(characters) == 0 {
		return Character{}, errors.New("character not found")
	}

	return characters[0], nil
}

func GetUserCharacters(userID int) ([]Character, error) {
	supabaseURL := fmt.Sprintf("%s/rest/v1/character?user_id=eq.%d", os.Getenv("SUPABASE_URL"), userID)
	supabaseKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")

	req, err := http.NewRequest("GET", supabaseURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("apikey", supabaseKey)
	req.Header.Set("Authorization", "Bearer "+supabaseKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Println("❌ Failed to fetch characters. Supabase response:", resp.StatusCode)
		return nil, errors.New("failed to fetch characters")
	}

	var characters []Character
	respBody, _ := io.ReadAll(resp.Body)
	fmt.Println("📜 Supabase API Response:", string(respBody)) // ✅ Log API response

	if err := json.Unmarshal(respBody, &characters); err != nil {
		return nil, err
	}

	fmt.Println("✅ Retrieved characters:", characters)
	return characters, nil
}

// Response struct for fetching user_id and password hash
type getPasswordResponse struct {
	UserID       int    `json:"user_id"`
	PasswordHash string `json:"password_hash"`
}

// GetUserPasswordHash retrieves the hashed password and user_id for a given email
func GetUserPasswordHash(email string) (int, string, error) {
	supabaseURL := fmt.Sprintf("%s/rest/v1/users?email=eq.%s&select=user_id,password_hash", os.Getenv("SUPABASE_URL"), email)
	supabaseKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")

	req, err := http.NewRequest("GET", supabaseURL, nil)
	if err != nil {
		return 0, "", err
	}
	req.Header.Set("apikey", supabaseKey)
	req.Header.Set("Authorization", "Bearer "+supabaseKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return 0, "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return 0, "", errors.New("user not found")
	}

	// Decode response
	var users []getPasswordResponse
	if err := json.NewDecoder(resp.Body).Decode(&users); err != nil {
		return 0, "", err
	}

	// Ensure we got a user
	if len(users) == 0 {
		return 0, "", errors.New("user not found")
	}

	return users[0].UserID, users[0].PasswordHash, nil // ✅ Now correctly returns user_id
}

// User struct for inserting and retrieving from Supabase
type User struct {
	UserID           int    `json:"user_id,omitempty"` // Use omitempty to omit when zero
	Email            string `json:"email"`
	PasswordHash     string `json:"password_hash"`
	PurchaseStatusID int    `json:"purchase_status_id"`
}

// InsertUser adds a new user to the Supabase database and returns user_id
func InsertUser(email, hashedPassword string) (int, error) {
	supabaseURL := os.Getenv("SUPABASE_URL") + "/rest/v1/users"
	supabaseKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")

	// Check if user already exists
	_, _, err := GetUserPasswordHash(email)
	if err == nil {
		fmt.Println("❌ User already exists with email:", email)
		return 0, errors.New("user already exists")
	}

	// Create request body matching the database schema
	user := struct {
		Email            string `json:"email"`
		PasswordHash     string `json:"password_hash"`
		PurchaseStatusID int    `json:"purchase_status_id"`
	}{
		Email:            email,
		PasswordHash:     hashedPassword,
		PurchaseStatusID: 1, // Default purchase status (modify if needed)
	}

	fmt.Println("📤 Inserting user:", user)
	body, err := json.Marshal(user)
	if err != nil {
		return 0, err
	}

	fmt.Println("📤 Request body:", string(body)) // Log the request body

	// Make request to Supabase
	req, err := http.NewRequest("POST", supabaseURL, bytes.NewBuffer(body))
	if err != nil {
		return 0, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", supabaseKey)
	req.Header.Set("Authorization", "Bearer "+supabaseKey)
	req.Header.Set("Prefer", "return=representation") // ✅ Ensure response contains `user_id`

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error:", err)
		return 0, err
	}
	defer resp.Body.Close()

	// Log the full response body
	respBody, _ := io.ReadAll(resp.Body)
	fmt.Println("Supabase Response:", string(respBody))

	if resp.StatusCode == http.StatusConflict {
		fmt.Println("❌ User already exists. Supabase response:", resp.StatusCode)
		return 0, errors.New("user already exists")
	} else if resp.StatusCode != http.StatusCreated {
		fmt.Println("❌ Failed to insert user. Supabase response:", resp.StatusCode)
		return 0, fmt.Errorf("failed to insert user, status: %d", resp.StatusCode)
	}

	// Parse response to get user_id
	var insertedUsers []User
	if err := json.NewDecoder(bytes.NewReader(respBody)).Decode(&insertedUsers); err != nil {
		return 0, err
	}

	if len(insertedUsers) == 0 {
		return 0, errors.New("user creation failed")
	}

	return insertedUsers[0].UserID, nil // ✅ Now correctly returns user_id
}
