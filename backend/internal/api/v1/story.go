package v1

import (
	charDb "beanboys-lastgame-backend/internal/db"
	db "beanboys-lastgame-backend/internal/db/story_db"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/openai/openai-go"
)

// Define API System Message text

// Story defines the structure of a story object.
type Story struct {
	Prompt      string `json:"prompt"`
	Response    string `json:"response"`
	CharacterID int    `json:"character_id"` // Link story to character
	CreatedAt   string `json:"created_at"`   // Timestamp of story creation
}

func convertToInt(value interface{}) (int, error) {
	switch v := value.(type) {
	case float64: // JSON numbers are decoded as float64
		return int(v), nil
	case string:
		return strconv.Atoi(v)
	default:
		return 0, fmt.Errorf("invalid type: %T", v)
	}
}

func generateStory(w http.ResponseWriter, r *http.Request) {
	fmt.Println("generateStory endpoint called")

	var requestData struct {
		Prompt      string      `json:"prompt"`
		CharacterID interface{} `json:"character_id"` // Accept `character_id` as any type
	}

	// Decode the request body
	fmt.Println("Decoding request body...")
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		fmt.Println("Error decoding request body:", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	fmt.Println("Request body decoded successfully:", requestData)

	// Convert `character_id` to an integer if it's a string
	characterID, err := convertToInt(requestData.CharacterID)
	if err != nil {
		fmt.Println("Error converting character_id to integer:", err)
		http.Error(w, "Invalid character_id", http.StatusBadRequest)
		return
	}

	// Validate input
	if requestData.Prompt == "" || characterID <= 0 {
		fmt.Println("Invalid input: missing prompt or invalid character ID")
		http.Error(w, "Invalid input: missing prompt or invalid character ID", http.StatusBadRequest)
		return
	}

	fmt.Println("Fetching story context for character ID:", characterID)

	// Get the 5 most recent stories for the character to use as context
	storyContext, err := db.GetStoriesByCharacterID(characterID)
	if err != nil {
		fmt.Println("Error retrieving story context:", err)
		http.Error(w, "Failed to retrieve story context", http.StatusInternalServerError)
		return
	}
	fmt.Println("Story context retrieved successfully:", storyContext)

	// Get the response from the OpenAI API
	client := openai.NewClient()

	// Start with the system message
	fmt.Println("Building message history for OpenAI API...")
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
	fmt.Println("Added story context to message history")

	// Add the current prompt from the user
	messages = append(messages, openai.UserMessage(requestData.Prompt))
	fmt.Println("Added user prompt to message history:", requestData.Prompt)

	// Create request with updated message history
	req := openai.ChatCompletionNewParams{
		Model:    openai.F(openai.ChatModelGPT4oMini),
		Messages: openai.F(messages),
	}

	// Make the API request
	fmt.Println("Sending request to OpenAI API...")
	response, err := client.Chat.Completions.New(context.Background(), req)
	if err != nil {
		fmt.Println("Error calling OpenAI API:", err)
		http.Error(w, "Failed to generate story", http.StatusInternalServerError)
		return
	}
	fmt.Println("OpenAI API response received successfully")

	// Create a new story object
	newStory := Story{
		Prompt:      requestData.Prompt,
		Response:    response.Choices[0].Message.Content,
		CharacterID: characterID,
	}
	fmt.Println("New story created:", newStory)

	// Insert into database and get the full story with `created_at`
	fmt.Println("Inserting story into database...")
	insertedStory, err := db.InsertStory(db.Story{
		Prompt:      newStory.Prompt,
		Response:    newStory.Response,
		CharacterID: newStory.CharacterID,
	})
	if err != nil {
		fmt.Println("Error inserting story into database:", err)
		http.Error(w, "Failed to save story", http.StatusInternalServerError)
		return
	}
	if insertedStory == nil {
		fmt.Println("Error inserting story into database")
		http.Error(w, "Failed to save story", http.StatusInternalServerError)
		return
	}
	fmt.Println("Story inserted into database successfully:", insertedStory)

	// Respond with the new story
	w.Header().Set("Content-Type", "application/json")
	fmt.Println("Sending response to client...")
	if err := json.NewEncoder(w).Encode(insertedStory); err != nil {
		fmt.Println("Error encoding response:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Println("Response sent successfully")
}

func generateIntro(w http.ResponseWriter, r *http.Request) {
	var requestData struct {
		CharacterID interface{} `json:"character_id"` // Accept `character_id` as any type
	}

	// Decode the request body
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Convert `character_id` to an integer if it's a string
	characterID, err := convertToInt(requestData.CharacterID)
	if err != nil {
		fmt.Println("Error converting character_id to integer:", err)
		http.Error(w, "Invalid character_id", http.StatusBadRequest)
		return
	}

	// Validate input
	if characterID <= 0 {
		fmt.Println("Invalid character_id:", characterID)
		http.Error(w, "Invalid character_id", http.StatusBadRequest)
		return
	}

	fmt.Println("Generating intro for character ID:", characterID)

	// Get the most recent story for the character to use as context
	currentCharacter, err := charDb.GetCharacterByID(characterID)
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
			CharacterID: characterID,
		})
	}

	fmt.Println("Intro generated successfully:", introResponse)

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(map[string]string{"intro": introResponse}); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func getStoriesByCharacterID(w http.ResponseWriter, r *http.Request) {
	// Parse character ID from query parameters
	characterIDStr := r.URL.Query().Get("character_id")
	if characterIDStr == "" {
		http.Error(w, "character_id is required", http.StatusBadRequest)
		return
	}

	// Convert character ID to an integer
	characterID, err := strconv.Atoi(characterIDStr)
	if err != nil || characterID <= 0 {
		http.Error(w, "Invalid character_id", http.StatusBadRequest)
		return
	}

	// Fetch stories from the database
	stories, err := db.GetStoriesByCharacterID(characterID)
	if err != nil {
		http.Error(w, "Failed to retrieve stories", http.StatusInternalServerError)
		return
	}

	// Set the response header to indicate JSON content
	w.Header().Set("Content-Type", "application/json")

	// Encode the stories to JSON and write them to the response
	if err := json.NewEncoder(w).Encode(stories); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
