package v1

import (
	charDb "beanboys-lastgame-backend/internal/db"
	db "beanboys-lastgame-backend/internal/db/story_db"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/openai/openai-go"
)

// Define API System Message text

// Story defines the structure of a story object.
type Story struct {
	Prompt      string `json:"prompt"`
	Response    string `json:"response"`
	CharacterID int    `json:"character_id"` // Link story to character
}

func generateStory(w http.ResponseWriter, r *http.Request) {
	var requestData struct {
		Prompt      string `json:"prompt"`
		CharacterID int    `json:"character_id"` // Ensure this is included to link story to character
	}

	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	fmt.Println("Generating story for prompt:", requestData.Prompt)

	// Get the 5 most recent stories for the character to use as context
	storyContext, err := db.GetStoriesByCharacterID(requestData.CharacterID)
	if err != nil {
		http.Error(w, "Failed to retrieve story context", http.StatusInternalServerError)
		return
	}

	// Get the response from the OpenAI API
	client := openai.NewClient()

	// Start with the system message
	messages := []openai.ChatCompletionMessageParamUnion{
		openai.SystemMessage(story_system_prompt),
	}

	// Add prior storyContext (prompt/response pairs) to the messages
	for _, story := range storyContext {
		messages = append(messages,
			openai.UserMessage(story.Prompt),
			openai.AssistantMessage(story.Response),
		)
	}

	// Add the current prompt from the user
	messages = append(messages, openai.UserMessage(requestData.Prompt))

	// Create request with updated message history
	req := openai.ChatCompletionNewParams{
		Model:    openai.F(openai.ChatModelGPT4oMini),
		Messages: openai.F(messages),
	}

	// Make the API request
	response, err := client.Chat.Completions.New(context.Background(), req)
	if err != nil {
		log.Fatalf("ChatCompletion error: %v", err)
	}

	// Create a new story object
	newStory := Story{
		Prompt:      requestData.Prompt,
		Response:    response.Choices[0].Message.Content,
		CharacterID: requestData.CharacterID,
	}

	// Insert into database
	db.InsertStory(db.Story{
		Prompt:      newStory.Prompt,
		Response:    newStory.Response,
		CharacterID: newStory.CharacterID,
	})
	if err != nil {
		fmt.Println("Error inserting character:", err)
		return
	}

	fmt.Println("Story created successfully with Prompt:", newStory.Prompt, "and Response:", newStory.Response)

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(newStory); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func generateIntro(w http.ResponseWriter, r *http.Request) {
	var requestData struct {
		CharacterID int `json:"character_id"` // Ensure this is included to link story to character
	}

	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	fmt.Println("Generating intro for character ID:", requestData.CharacterID)

	// Get the most recent story for the character to use as context
	currentCharacter, err := charDb.GetCharacterByID(requestData.CharacterID)
	if err != nil {
		http.Error(w, "Failed to retrieve character", http.StatusInternalServerError)
		return
	}

	// Get the response from the OpenAI API
	client := openai.NewClient()

	// Start with the system message
	messages := []openai.ChatCompletionMessageParamUnion{
		openai.SystemMessage(intro_system_prompt),
	}

	// If the character exists, add their description to the messages
	messageText := ""

	if (currentCharacter != charDb.Character{}) {
		messageText = "Name: " + currentCharacter.Name + "\n" + "Description: " + currentCharacter.Description
		messages = append(messages,
			openai.UserMessage(messageText),
		)
	}

	// Create request with updated message history
	req := openai.ChatCompletionNewParams{
		Model:    openai.F(openai.ChatModelGPT4oMini),
		Messages: openai.F(messages),
	}

	// Make the API request
	response, err := client.Chat.Completions.New(context.Background(), req)
	if err != nil {
		log.Fatalf("ChatCompletion error: %v", err)
	}

	introResponse := response.Choices[0].Message.Content

	// Insert into database
	if (messageText != "") && (introResponse != "") {
		db.InsertStory(db.Story{
			Prompt:      messageText,
			Response:    introResponse,
			CharacterID: requestData.CharacterID,
		})
	}

	fmt.Println("Intro generated successfully:", introResponse)

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(map[string]string{"intro": introResponse}); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
