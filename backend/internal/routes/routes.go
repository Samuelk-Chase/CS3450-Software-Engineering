package routes

import (
	v1 "beanboys-lastgame-backend/internal/api/v1"
	"beanboys-lastgame-backend/internal/middleware" // Import middleware
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func NewRouter() http.Handler {
	r := chi.NewRouter()

	log.Println("Router initialized")

	// Apply CORS middleware
	r.Use(middleware.EnableCORS)

	// Mount API routes
	r.Mount("/v1", v1.Routes())

	return r
}
