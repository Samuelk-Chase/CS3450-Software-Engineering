package main

import (
	"beanboys-lastgame-backend/internal/routes"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
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

	port := "8080"
	if contains(os.Args, "--port") < len(os.Args) {
		port = os.Args[contains(os.Args, "--port")+1]
	}

	router := routes.NewRouter()
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
