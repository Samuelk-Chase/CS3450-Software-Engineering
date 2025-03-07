package main

import (
	"log"
	"net/http"
	"os"

	"beanboys-lastgame-backend/internal/db"
	"beanboys-lastgame-backend/internal/db/queries"
	"beanboys-lastgame-backend/internal/routes"

	"github.com/joho/godotenv"
)

func main() {
	log.Println("Starting server...")

	if os.Getenv("APP_ENV") != "production" {
		err := godotenv.Load("internal/config/.env")
		if err != nil {
			log.Fatalf("Error loading .env file: %v", err)
		}
		log.Println(".env file loaded")
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
		log.Println(".env file loaded from /etc/lastgame/.env")
	}

	port := "8080"
	if contains(os.Args, "--port") < len(os.Args) {
		port = os.Args[contains(os.Args, "--port")+1]
	}
	log.Printf("Server will start on port %s", port)

	// Connect to the database
	log.Println("Connecting to the database...")
	database := db.Connect()
	log.Println("Database connected")
	queries.Init(database)

	router := routes.NewRouter()
	log.Println("Router initialized")

	log.Println("Server started on :" + port)
	if err := http.ListenAndServe(":"+port, router); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func contains(slice []string, item string) int {
	for i, s := range slice {
		if s == item {
			return i
		}
	}
	return -1
}
