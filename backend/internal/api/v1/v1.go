package v1

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"beanboys-lastgame-backend/internal/api/v1/llm"
	"beanboys-lastgame-backend/internal/middleware" // Import your custom middleware package

	"github.com/go-chi/chi/v5"
)

func Routes() http.Handler {
	r := chi.NewRouter()

	log.Println("v1 Routes initialized")

	// Mount LLM routes
	r.Mount("/llm", llm.Routes())

	// Public routes (no authentication required)
	r.Post("/signup", createUser)
	r.Post("/login", loginUser)
	r.Get("/backgroundaudio", ServeWAV)
	r.Get("/soundeffect", ServeSoundEffect)

	// Protected routes (require authentication)
	r.Group(func(r chi.Router) {
		r.Use(middleware.KeyAuth) // Apply authentication middleware

		// Character-related routes
		r.Get("/character/{id}", GetCharacter)
		r.Get("/characters", GetCharacters)
		r.Get("/cards/{id}", getCards)
		r.Post("/card", getCard)
		r.Post("/getNewCharacter", getNewCharacter)
		r.Post("/boss", getBoss)
		r.Post("/story", generateStory)
		r.Post("/image", generateImage)
		r.Post("/uploadCharacterImage", uploadCharacterImage)

		// Serve character images
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
	})

	return r
}
