package v1

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"beanboys-lastgame-backend/internal/api/v1/llm"

	"github.com/go-chi/chi/v5"
)

// NOTE: The following handler functions (createUser, loginUser, GetCharacter, etc.)
// are assumed to be defined elsewhere in this package.

func Routes() http.Handler {
	r := chi.NewRouter()

	log.Println("v1 Routes initialized")

	// Mount LLM routes
	r.Mount("/llm", llm.Routes())

	// Authentication and user routes
	r.Post("/signup", createUser)
	r.Post("/login", loginUser)

	// Character-related routes
	r.Get("/character/{id}", GetCharacter)      // Returns a character object as JSON
	r.Get("/characters", GetCharacters)         // Returns all characters as JSON
	r.Get("/cards/{id}", getCards)              // Returns cards for a character as JSON
	r.Post("/card", getCard)                    // Returns a newly created card object as JSON
	r.Post("/getNewCharacter", getNewCharacter) // Returns a newly created character as JSON
	r.Post("/boss", getBoss)                    // Returns a boss object as JSON
	r.Post("/story", generateStory)             // Returns a story object as JSON
	r.Post("/image", generateImage)             // Returns a generated image as JSON
	r.Post("/uploadCharacterImage", uploadCharacterImage)
	r.Get("/backgroundaudio", ServeWAV)

	r.Get("/character_image/{name}", func(w http.ResponseWriter, r *http.Request) {
		// Log the working directory.
		wd, err := os.Getwd()
		if err != nil {
			log.Printf("Error getting working directory: %v", err)
		} else {
			log.Printf("Working directory: %s", wd)
		}

		// Get the image name from the URL.
		name := chi.URLParam(r, "name")

		// Compute the file path relative to the working directory.
		filePath := filepath.Join("..", "..", "character_images", name+".png")
		log.Printf("Computed file path: %s", filePath)

		// Check if the file exists.
		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			log.Printf("File not found: %s", filePath)
			// Optionally, set a default image path.
			defaultPath := filepath.Join("..", "..", "character_images", "default.png")
			log.Printf("Serving default image: %s", defaultPath)
			http.ServeFile(w, r, defaultPath)
			return
		}

		// Serve the image.
		http.ServeFile(w, r, filePath)
	})

	return r
}
