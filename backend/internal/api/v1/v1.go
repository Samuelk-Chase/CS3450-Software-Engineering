package v1

import (
	"beanboys-lastgame-backend/internal/api/v1/llm"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func Routes() http.Handler {
	r := chi.NewRouter()

	log.Println("v1 Routes initialized")

	// Mount LLM routes
	r.Mount("/llm", llm.Routes())

	// Correct signup route (use function reference, not function call)
	r.Post("/signup", createUser)
	r.Post("/login", loginUser)
	// Character-related routes
	r.Get("/character/{id}", GetCharacter)      // Returns a character object as JSON
	r.Get("/characters/{id}", GetCharacters)    // Returns multiple character objects as JSON
	r.Get("/deck/{id}", getCards)               // Returns a deck object as JSON
	r.Post("/card", getCard)                    // Returns a card object as JSON
	r.Post("/getNewCharacter", getNewCharacter) // Returns a newly created character as JSON object
	r.Get("/boss", getBoss)                     // Returns a boss object as JSON

	return r
}
