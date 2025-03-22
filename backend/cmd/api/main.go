package main

import (
	"beanboys-lastgame-backend/internal/routes"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables based on APP_ENV.
	if os.Getenv("APP_ENV") != "production" {
		err := godotenv.Load("internal/config/.env")
		if err != nil {
			log.Fatalf("Error loading .env file: %v", err)
		}
	} else {
		logFile, err := os.OpenFile("/var/log/lastgame.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
		if err != nil {
			log.Fatal(err)
		}
		defer logFile.Close()

		log.SetOutput(logFile)
		err = godotenv.Load("/etc/lastgame/.env")
		if err != nil {
			log.Fatalf("Error loading .env file: %v", err)
		}
	}

	// Set default port or override if provided as an argument.
	port := "8080"
	if contains(os.Args, "--port") < len(os.Args) {
		port = os.Args[contains(os.Args, "--port")+1]
	}

	// Get your existing router from internal/routes.
	existingRouter := routes.NewRouter()

	// Create a new Chi router so we can add our static file handler.
	r := chi.NewRouter()

	// Mount a static file server for character_images.
	// Using an absolute path to ensure it finds your files.
	imagesPath := filepath.Join("/Users/samuel/CS3450/beanboysproject/backend/character_images")
	log.Printf("Serving character images from: %s", imagesPath)
	r.Handle("/character_images/*", http.StripPrefix("/character_images/", http.FileServer(http.Dir(imagesPath))))

	// Mount your API routes.
	r.Mount("/", existingRouter)

	log.Println("Server started on :" + port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

// contains returns the index of item in slice, or -1 if not found.
func contains(slice []string, item string) int {
	for i, s := range slice {
		if s == item {
			return i
		}
	}
	return -1
}
