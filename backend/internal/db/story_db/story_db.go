package storydb

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
	CreatedAt   string `json:"created_at"` // Timestamp of story creation
}

func InsertStory(story Story) (*Story, error) {
	// Input validation
	if story.Prompt == "" {
		return nil, fmt.Errorf("failed to insert story: prompt cannot be empty")
	}
	if story.CharacterID <= 0 {
		return nil, fmt.Errorf("failed to insert story: invalid character ID")
	}

	supabaseURL := os.Getenv("SUPABASE_URL") + "/rest/v1/storyEntry"
	supabaseKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")

	// Create request body excluding `created_at`
	body, err := json.Marshal(map[string]interface{}{
		"prompt_text":   story.Prompt,
		"response_text": story.Response,
		"character_id":  story.CharacterID,
	})
	if err != nil {
		return nil, err
	}

	fmt.Println("📤 Inserting story:", story)
	fmt.Println("📤 Request body:", string(body)) // Log the request body

	// Make request to Supabase
	req, err := http.NewRequest("POST", supabaseURL, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", supabaseKey)
	req.Header.Set("Authorization", "Bearer "+supabaseKey)
	req.Header.Set("Prefer", "return=representation") // Ensure response contains the inserted story

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error:", err)
		return nil, err
	}
	defer resp.Body.Close()

	// Log the full response body
	respBody, _ := io.ReadAll(resp.Body)
	fmt.Println("Supabase Response:", string(respBody))

	if resp.StatusCode != http.StatusCreated {
		return nil, fmt.Errorf("failed to insert story, status: %d", resp.StatusCode)
	}

	// Parse response to get the inserted story
	var insertedStories []Story
	if err := json.NewDecoder(bytes.NewReader(respBody)).Decode(&insertedStories); err != nil {
		return nil, err
	}

	if len(insertedStories) == 0 {
		return nil, errors.New("story insertion failed")
	}

	// Log the inserted story
	fmt.Println("Inserted story:", insertedStories[0])
	return &insertedStories[0], nil // Return the inserted story
}

func GetStoriesByCharacterID(characterID int) ([]Story, error) {
	supabaseURL := fmt.Sprintf(
		"%s/rest/v1/storyEntry?character_id=eq.%d&order=created_at.desc&limit=5", // Limited to 5 most recent stories, ordered by created_at
		os.Getenv("SUPABASE_URL"), characterID,
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
