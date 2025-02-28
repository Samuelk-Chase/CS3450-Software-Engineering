package v1

import (
	"beanboys-lastgame-backend/internal/api/v1/llm"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func Routes() http.Handler {
	r := chi.NewRouter()

	log.Println("Router initialized")
	r.Mount("/llm", llm.Routes())
	r.Get("/character/{id}", GetCharacter)      // returns a character object as JSON
	r.Get("/characters/{id}", GetCharacters)    // returns a multiple character objecs as JSON
	r.Get("/deck/{id}", getCards)               // returns a deck object as JSON
	r.Post("/card", getCard)                    // returns a card object as JSON
	r.Post("/getNewCharacter", getNewCharacter) // returns a newly created character as json object
	r.Post("/createUser", createUser)           // creates a user object based on the provided username, email, and password
	r.Get("/boss", getBoss)                     // returns a boss object as JSON

	return r
}
