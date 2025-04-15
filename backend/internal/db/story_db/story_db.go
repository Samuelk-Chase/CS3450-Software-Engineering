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

type Story struct {
	StoryID     int    `json:"story_id,omitempty"` // Use omitempty to omit when zero
	CharacterID int    `json:"character_id"`       // Add character ID field
	Prompt      string `json:"prompt_text"`
	Response    string `json:"response_text"`
}

func InsertStory(story Story) error {
	supabaseURL := os.Getenv("SUPABASE_URL") + "/rest/v1/storyEntry"
	supabaseKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")

	// Create request body matching the database schema
	body, err := json.Marshal(story)
	if err != nil {
		return err
	}

	fmt.Println("📤 Inserting story:", story)
	fmt.Println("📤 Request body:", string(body)) // Log the request body

	// Make request to Supabase
	req, err := http.NewRequest("POST", supabaseURL, bytes.NewBuffer(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", supabaseKey)
	req.Header.Set("Authorization", "Bearer "+supabaseKey)
	req.Header.Set("Prefer", "return=representation") // Ensure response contains `card_id`

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error:", err)
		return err
	}
	defer resp.Body.Close()

	// Log the full response body
	respBody, _ := io.ReadAll(resp.Body)
	fmt.Println("Supabase Response:", string(respBody))

	if resp.StatusCode != http.StatusCreated {
		return fmt.Errorf("failed to insert story, status: %d", resp.StatusCode)
	}

	// Parse response to get card_id
	var insertedStories []Story
	if err := json.NewDecoder(bytes.NewReader(respBody)).Decode(&insertedStories); err != nil {
		return err
	}

	if len(insertedStories) == 0 {
		return errors.New("story insertion failed")
	}
	return nil // Successfully inserted story, no need to return the ID
}

func GetStoriesByCharacterID(characterID int, numEntries int) ([]Story, error) {
	supabaseURL := fmt.Sprintf(
		"%s/rest/v1/storyEntry?character_id=eq.%d&order=created_at.desc&limit=%d", // Limited to 5 most recent stories, ordered by created_at
		os.Getenv("SUPABASE_URL"), characterID, numEntries,
	)
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
		return nil, fmt.Errorf("failed to fetch stories, status: %d", resp.StatusCode)
	}

	var stories []Story
	if err := json.NewDecoder(resp.Body).Decode(&stories); err != nil {
		return nil, err
	}

	return stories, nil
}
