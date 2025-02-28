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
