package middleware

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
)

func KeyAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			writeErrorResponse(w, "Missing or malformed token", http.StatusUnauthorized)
			return
		}

		keyString := strings.TrimPrefix(authHeader, "Bearer ")

		// TODO: implement auth logic

		log.Println("Received valid key", keyString, "proceeding to the next handler")
		next.ServeHTTP(w, r)
	})
}

// writeErrorResponse writes a custom JSON error response
func writeErrorResponse(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	log.Println("error: ", message)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}

// CORS middleware to allow all origins
func EnableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow requests from any origin (* means unrestricted access)
		w.Header().Set("Access-Control-Allow-Origin", "*")

		// Allow all standard HTTP methods
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		// Allow all headers
		w.Header().Set("Access-Control-Allow-Headers", "*")

		// Handle preflight (OPTIONS) requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
