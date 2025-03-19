package v1

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/openai/openai-go"
)

// Define API System Message text

// Character defines the structure of a character object.
type Story struct {
	Prompt   string `json:"prompt"`
	Response string `json:"response"`
}

func generateStory(w http.ResponseWriter, r *http.Request) {
	var requestData struct {
		Response string `json:"response"`
		Prompt   string `json:"prompt"`
	}

	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	fmt.Println("Generating story for prompt:", requestData.Prompt)

	// Get the response from the OpenAI API
	client := openai.NewClient()

	// Define the messages for the chat completion
	messages := openai.F([]openai.ChatCompletionMessageParamUnion{
		openai.SystemMessage(story_system_prompt),
		openai.AssistantMessage(requestData.Response),
		openai.UserMessage(requestData.Prompt),
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

	// Create a new story object
	newStory := Story{
		Prompt:   requestData.Prompt,
		Response: response.Choices[0].Message.Content,
	}

	// // Insert into database (replace with story data once database is set up)
	// characterID, err := db.InsertCharacter(db.Character{
	// 	UserID:        newCharacter.UserID,
	// 	Name:          newCharacter.Name, // Uses `character_name`
	// 	CurrentMana:   newCharacter.CurrentMana,
	// 	MaxMana:       newCharacter.MaxMana,
	// 	CurrentHealth: newCharacter.CurrentHealth, // Uses `current_hp`
	// 	MaxHealth:     newCharacter.MaxHealth,     // Uses `max_hp`
	// })
	// if err != nil {
	// 	fmt.Println("Error inserting character:", err)
	// 	return Character{}, err
	// }

	fmt.Println("Story created successfully with Prompt:", newStory.Prompt, "and Response:", newStory.Response)

	// Set the response header to indicate JSON content.
	w.Header().Set("Content-Type", "application/json")

	// Encode the card object to JSON and write it to the response.
	if err := json.NewEncoder(w).Encode(newStory); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

}
