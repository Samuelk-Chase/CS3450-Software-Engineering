package middleware

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v4"
)

var jwtSecret = []byte("VmwI4ReJNJQNQoUwrv9yx5sgil1z4cfHl4U9u5DuRpc8R804kQjJoQNY+UuV6AaP7lbEi5VrmKePIkKFFR7ORw==") // Replace with a secure secret key

func KeyAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// next.ServeHTTP(w, r)
		// return

		fmt.Println("KeyAuth middleware called!")
		authHeader := r.Header.Get("Authorization")
		fmt.Println("Authorization header:", authHeader)
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			writeErrorResponse(w, "Missing or malformed token", http.StatusUnauthorized)
			return
		}

		keyString := strings.TrimPrefix(authHeader, "Bearer ")

		// Parse the token
		token, err := jwt.Parse(keyString, func(token *jwt.Token) (interface{}, error) {
			// Ensure the signing method is what you expect
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.NewValidationError("unexpected signing method", jwt.ValidationErrorSignatureInvalid)
			}
			return jwtSecret, nil
		})

		if err != nil {
			fmt.Printf("❌ Error parsing token: %v\n", err)
			writeErrorResponse(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		// Handle Supabase tokens
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			if sub, ok := claims["sub"].(string); ok {
				// Supabase token: Use "sub" as user_id
				fmt.Println("✅ Supabase token detected")
				ctx := context.WithValue(r.Context(), "user_id", sub)
				r = r.WithContext(ctx)
			} else if userID, ok := claims["user_id"].(float64); ok {
				// Backend-generated token: Use "user_id"
				fmt.Println("✅ Backend-generated token detected")
				ctx := context.WithValue(r.Context(), "user_id", int(userID))
				r = r.WithContext(ctx)
			} else {
				fmt.Println("❌ Invalid token claims")
				writeErrorResponse(w, "Invalid token claims", http.StatusUnauthorized)
				return
			}
		} else {
			writeErrorResponse(w, "Invalid or expired token", http.StatusUnauthorized)
			return
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
