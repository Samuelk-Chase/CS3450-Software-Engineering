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

	return r
}
