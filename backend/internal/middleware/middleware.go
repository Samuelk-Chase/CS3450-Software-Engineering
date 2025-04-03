package middleware

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v4"
)

var jwtSecret = []byte("d31421253bac3d2dd8e589a3d3951437bb4c59e4f081c5fc066125bedc30c6e5") // Replace with a secure secret key

func KeyAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			writeErrorResponse(w, "Missing or malformed token", http.StatusUnauthorized)
			return
		}

		keyString := strings.TrimPrefix(authHeader, "Bearer ")

		// Parse and validate the JWT token
		token, err := jwt.Parse(keyString, func(token *jwt.Token) (interface{}, error) {
			// Ensure the signing method is what you expect
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.NewValidationError("unexpected signing method", jwt.ValidationErrorSignatureInvalid)
			}
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			writeErrorResponse(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		// Extract user_id from claims and add it to the request context
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			if userID, ok := claims["user_id"].(float64); ok { // JWT claims are float64
				ctx := context.WithValue(r.Context(), "user_id", int(userID))
				r = r.WithContext(ctx)
			} else {
				writeErrorResponse(w, "Invalid token claims", http.StatusUnauthorized)
				return
			}
		}

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
