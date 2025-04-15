package routes

import (
	v1 "beanboys-lastgame-backend/internal/api/v1"
	"beanboys-lastgame-backend/internal/middleware" // Import middleware
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/go-chi/chi/v5"
)

func NewRouter() http.Handler {
	r := chi.NewRouter()

	log.Println("Router initialized")

	// Apply CORS middleware
	r.Use(middleware.EnableCORS)

	// Mount API routes
	r.Mount("/api/v1", v1.Routes())

	var frontendDir string  
	if os.Getenv("PRODUCTION") == "TRUE" {
		frontendDir = "./dist/" 
	} else {
		frontendDir = "../last-game-frontend/dist/"
	}

	// Static file server (serves files from ./frontend/dist)
    fs := http.FileServer(http.Dir(frontendDir))

    // Serve static assets normally
    r.Handle("/static/*", fs)
    r.Handle("/assets/*", fs) // if you have an assets dir too

    // Catch-all for React Router (serve index.html for all unmatched routes)
    r.NotFound(func(w http.ResponseWriter, r *http.Request) {
		log.Println("NotFound handler hit for", r.URL.Path)
        path := filepath.Join(frontendDir, r.URL.Path)
        if _, err := os.Stat(path); err == nil {
            fs.ServeHTTP(w, r)
            return
        }

        // Otherwise serve index.html for React Router
        http.ServeFile(w, r, frontendDir + "index.html")
    })

	return r
}
