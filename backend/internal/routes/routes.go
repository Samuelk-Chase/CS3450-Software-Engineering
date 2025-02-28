package routes

import (
	v1 "beanboys-lastgame-backend/internal/api/v1"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func NewRouter() http.Handler {
	r := chi.NewRouter()

	log.Println("Router initialized")
	r.Mount("/v1", v1.Routes())

	return r
}
