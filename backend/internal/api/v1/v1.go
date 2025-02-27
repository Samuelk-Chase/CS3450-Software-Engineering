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
	r.Get("/character/{id}", GetCharacter) // returns a character object as JSON
	r.Get("/characters/{id}", GetCharacters)
	r.Get("/deck/{id}", getCards) // returns a deck object as JSON
	r.Get("/card/{id}", getCard)  // returns a card object as JSON

	return r
}
