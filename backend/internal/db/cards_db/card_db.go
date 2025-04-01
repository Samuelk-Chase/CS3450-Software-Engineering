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

type Card struct {
	CardID          int    `json:"card_id,omitempty"` // Use omitempty to omit when zero
	TypeID          int    `json:"type_id"`
	Title           string `json:"title"`
	ManaCost        int    `json:"mana_cost"`
	CardDescription string `json:"card_description"`
	ImageURL        string `json:"image_url"`
	PowerLevel      int    `json:"power_level"`
	CharacterID     int    `json:"character_id"` // Add character ID field
}

func InsertCard(card Card) (int, error) {
	supabaseURL := os.Getenv("SUPABASE_URL") + "/rest/v1/card"
	supabaseKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")

	// Create request body matching the database schema
	body, err := json.Marshal(card)
	if err != nil {
		return 0, err
	}

	fmt.Println("📤 Inserting card:", card)
	fmt.Println("📤 Request body:", string(body)) // Log the request body

	// Make request to Supabase
	req, err := http.NewRequest("POST", supabaseURL, bytes.NewBuffer(body))
	if err != nil {
		return 0, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", supabaseKey)
	req.Header.Set("Authorization", "Bearer "+supabaseKey)
	req.Header.Set("Prefer", "return=representation") // Ensure response contains `card_id`

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

	if resp.StatusCode != http.StatusCreated {
		return 0, fmt.Errorf("failed to insert card, status: %d", resp.StatusCode)
	}

	// Parse response to get card_id
	var insertedCards []Card
	if err := json.NewDecoder(bytes.NewReader(respBody)).Decode(&insertedCards); err != nil {
		return 0, err
	}

	if len(insertedCards) == 0 {
		return 0, errors.New("card insertion failed")
	}

	return insertedCards[0].CardID, nil // Now correctly returns card_id
}

func GetCardByID(cardID int) (Card, error) {
	supabaseURL := fmt.Sprintf("%s/rest/v1/card?card_id=eq.%d", os.Getenv("SUPABASE_URL"), cardID)
	supabaseKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")

	req, err := http.NewRequest("GET", supabaseURL, nil)
	if err != nil {
		return Card{}, err
	}
	req.Header.Set("apikey", supabaseKey)
	req.Header.Set("Authorization", "Bearer "+supabaseKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return Card{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return Card{}, errors.New("card not found")
	}

	var cards []Card
	if err := json.NewDecoder(resp.Body).Decode(&cards); err != nil {
		return Card{}, err
	}

	if len(cards) == 0 {
		return Card{}, errors.New("card not found")
	}

	return cards[0], nil
}

func GetCardsByCharacterID(characterID int) ([]Card, error) {
	supabaseURL := fmt.Sprintf("%s/rest/v1/card?character_id=eq.%d", os.Getenv("SUPABASE_URL"), characterID)
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
		return nil, fmt.Errorf("failed to fetch cards, status: %d", resp.StatusCode)
	}

	var cards []Card
	if err := json.NewDecoder(resp.Body).Decode(&cards); err != nil {
		return nil, err
	}

	return cards, nil
}
