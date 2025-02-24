package llm

import (
	"beanboys-lastgame-backend/internal/middleware"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func Routes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.KeyAuth)
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		const responseStr = `{"message": "hit llm endpoint"}`
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(responseStr))
	})

	return r
}
