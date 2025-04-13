package v1

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/openai/openai-go"
)

// Boss defines the structure of our boss object.
type Boss struct {
	Name      string `json:"name"`
	Health    int    `json:"health"`
	BossLevel int    `json:"bossLevel"`
	Mana      int    `json:"mana"`
	ImageURL  string `json:"image_url"`
}

type JSONBoss struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Health      int    `json:"health"`
	Mana        int    `json:"mana"`
}

type JSONBossAtk struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Mana        int    `json:"mana"`
}

// getBoss is an HTTP handler that returns a boss object as JSON.
func getBoss(w http.ResponseWriter, r *http.Request) {
	fmt.Println("get boss called!")

	var requestData struct {
		Prompt string `json:"prompt"`
	}

	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Get the response from the OpenAI API
	client := openai.NewClient()
	// Define the messages for the chat completion
	messages := openai.F([]openai.ChatCompletionMessageParamUnion{
		openai.SystemMessage(enemy_system_prompt),
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

	jsonParts := strings.Split(response.Choices[0].Message.Content, "|")

	jsonBoss := JSONBoss{}
	jsonBossAtk := JSONBossAtk{}

	err = json.Unmarshal([]byte(jsonParts[0]), &jsonBoss)
	if err != nil {
		fmt.Println("Error parsing JSON Boss:", err)
	}
	err = json.Unmarshal([]byte(jsonParts[1]), &jsonBossAtk)
	if err != nil {
		fmt.Println("Error parsing JSON Boss Atk:", err)
	}

	// Create a the boss object to pass back.
	boss := Boss{
		Name:      jsonBoss.Name,
		Health:    jsonBoss.Health,
		BossLevel: 10,
		Mana:      jsonBoss.Mana,
		ImageURL:  "http://example.com/sample-boss.jpg",
	}

	// Set the response header to indicate JSON content.
	w.Header().Set("Content-Type", "application/json")

	// Encode the boss object to JSON and write it to the response.
	if err := json.NewEncoder(w).Encode(boss); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
