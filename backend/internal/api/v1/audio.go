package v1

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
)

// ServeWAV serves a WAV audio file to the frontend
func ServeWAV(w http.ResponseWriter, r *http.Request) {
	// Log when the ServeWAV function is called
	log.Println("ServeWAV endpoint called")

	// Path to the WAV file within the project
	wavFilePath := filepath.Join("assets", "audio", "examplebackground.wav") // Update this path to your actual file location

	// Open the WAV file
	file, err := os.Open(wavFilePath)
	if err != nil {
		log.Printf("Error opening file: %v", err)
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}
	defer file.Close()

	// Get file information to retrieve modification time
	fileInfo, err := file.Stat()
	if err != nil {
		log.Printf("Error retrieving file info: %v", err)
		http.Error(w, "Unable to retrieve file info", http.StatusInternalServerError)
		return
	}

	// Set the appropriate headers
	w.Header().Set("Content-Type", "audio/wav")
	w.Header().Set("Content-Disposition", "inline; filename=\"example.wav\"")

	// Serve the file
	http.ServeContent(w, r, "example.wav", fileInfo.ModTime(), file)
}

// ServeSoundEffect serves an MP3 sound effect file to the frontend
func ServeSoundEffect(w http.ResponseWriter, r *http.Request) {
	// Log when the ServeSoundEffect function is called
	log.Println("ServeSoundEffect endpoint called")

	// Get the sound effect name from the query parameters
	soundEffectName := r.URL.Query().Get("name")
	if soundEffectName == "" {
		http.Error(w, "Sound effect name is required", http.StatusBadRequest)
		return
	}

	// Path to the sound effect file
	soundEffectPath := filepath.Join("assets", "audio", "cardSoundEffects", soundEffectName+".mp3")

	// Open the sound effect file
	file, err := os.Open(soundEffectPath)
	if err != nil {
		// Log the error and apply the default sound effect
		log.Printf("Sound effect '%s' not found, applying default: %v", soundEffectName, err)
		soundEffectPath = filepath.Join("assets", "audio", "cardSoundEffects", "default_sound.mp3")
		file, err = os.Open(soundEffectPath)
		if err != nil {
			log.Printf("Error opening default sound effect: %v", err)
			http.Error(w, "File not found", http.StatusNotFound)
			return
		}
	}
	defer file.Close()

	// Get file information to retrieve modification time
	fileInfo, err := file.Stat()
	if err != nil {
		log.Printf("Error retrieving file info: %v", err)
		http.Error(w, "Unable to retrieve file info", http.StatusInternalServerError)
		return
	}

	// Set the appropriate headers
	w.Header().Set("Content-Type", "audio/mpeg")
	w.Header().Set("Content-Disposition", "inline; filename=\""+fileInfo.Name()+"\"")

	// Serve the file
	http.ServeContent(w, r, fileInfo.Name(), fileInfo.ModTime(), file)
}
