package v1

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

// uploadCharacterImage handles saving the uploaded character image using the character's name as the file name.
func uploadCharacterImage(w http.ResponseWriter, r *http.Request) {
	// Limit the upload size (example: 10MB)
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "Unable to parse form", http.StatusBadRequest)
		return
	}

	// Retrieve the character's name from the form data.
	characterName := r.FormValue("characterName")
	if characterName == "" {
		http.Error(w, "characterName field is required", http.StatusBadRequest)
		return
	}
	// Sanitize the character name for filename safety.
	safeCharacterName := strings.ReplaceAll(strings.ToLower(characterName), " ", "_")

	// Retrieve the file from form data.
	file, handler, err := r.FormFile("characterImage")
	if err != nil {
		http.Error(w, "Error retrieving the file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Use the original file extension from the uploaded file.
	ext := filepath.Ext(handler.Filename)
	// Build the file name using the sanitized character name.
	fileName := fmt.Sprintf("%s%s", safeCharacterName, ext)

	// Define the target directory for storing character images.
	targetDir := "./character_images"
	// Ensure the directory exists. If not, create it.
	if err := os.MkdirAll(targetDir, os.ModePerm); err != nil {
		http.Error(w, "Unable to create directory", http.StatusInternalServerError)
		return
	}

	// Construct the full target path.
	targetPath := filepath.Join(targetDir, fileName)

	// Create the target file.
	out, err := os.Create(targetPath)
	if err != nil {
		http.Error(w, "Unable to create file", http.StatusInternalServerError)
		return
	}
	defer out.Close()

	// Copy the uploaded file's data to the target file.
	if _, err = io.Copy(out, file); err != nil {
		http.Error(w, "Unable to save file", http.StatusInternalServerError)
		return
	}

	// Optionally, update the character record in your database with the fileName if needed.
	// For example:
	// characterID := r.FormValue("characterID")
	// err = updateCharacterImage(characterID, fileName)
	// if err != nil { ... }

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fileName))
}
