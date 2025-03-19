package v1

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/openai/openai-go"
)

// Define API System Message text

// Character defines the structure of a character object.
type Image struct {
	Image string `json:"image"`
}

func generateImage(w http.ResponseWriter, r *http.Request) {
	var requestData struct {
		Prompt string `json:"prompt"`
	}

	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	fmt.Println("Generating story for prompt:", requestData.Prompt)

	// Get the response from the OpenAI API
	client := openai.NewClient()

	response, err := client.Images.Generate(context.Background(), openai.ImageGenerateParams{
		Prompt:         openai.F(requestData.Prompt),
		Model:          openai.F(openai.ImageModelDallE3),
		ResponseFormat: openai.F(openai.ImageGenerateParamsResponseFormatB64JSON),
		Size:           openai.F(openai.ImageGenerateParamsSize1024x1024),
	})
	if err != nil {
		log.Fatalf("Image Generation error: %v", err)
	}

	//saveBase64Image(response.Data[0].B64JSON, "image.jpg")

	fmt.Println("Image created successfully.")

	// Set the response header to indicate JSON content.
	w.Header().Set("Content-Type", "application/json")

	// Encode the card object to JSON and write it to the response.
	if err := json.NewEncoder(w).Encode(response.Data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func saveBase64Image(base64String, filename string) error {
	// Decode the Base64 string
	imageBytes, err := base64.StdEncoding.DecodeString(base64String)
	if err != nil {
		return err
	}

	// Write the decoded bytes to a file
	return os.WriteFile(filename, imageBytes, os.ModePerm)
}
