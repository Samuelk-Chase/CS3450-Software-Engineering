package v1

import (
	db "beanboys-lastgame-backend/internal/db"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

// User defines the structure of our user object.
type User struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

var jwtSecret = []byte("VmwI4ReJNJQNQoUwrv9yx5sgil1z4cfHl4U9u5DuRpc8R804kQjJoQNY+UuV6AaP7lbEi5VrmKePIkKFFR7ORw==") // Replace with a secure key

// GenerateJWT generates a JWT token with user_id as a claim
func GenerateJWT(userID int) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24 * 30).Unix(), // Token expiration (30 days)
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// loginUser is an HTTP handler that verifies user credentials and returns a JWT token
func loginUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("loginUser called!")

	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Parse request body
	var requestData struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Retrieve user_id and hashed password from Supabase
	userID, storedHash, err := db.GetUserPasswordHash(requestData.Email)
	if err != nil {
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	// Compare the provided password with the stored hash
	err = bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(requestData.Password))
	if err != nil {
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	// Generate JWT token
	token, err := GenerateJWT(userID)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	// Prepare the response
	response := map[string]interface{}{
		"user_id": userID,
		"token":   token,
		"message": "Login successful!",
	}

	// Print the response to the console
	fmt.Printf("loginUser response: %+v\n", response)

	// Send success response with user_id and JWT token
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// hashAndSalt hashes and salts the given password.
func hashAndSalt(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

// createUser is an HTTP handler that creates a user in Supabase and returns a JWT token
func createUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("createUser called!")

	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Parse request body
	var requestData struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Hash the password
	hashedPassword, err := hashAndSalt(requestData.Password)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	// Store user in Supabase
	userID, err := db.InsertUser(requestData.Email, hashedPassword)
	if err != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	// Generate JWT token
	token, err := GenerateJWT(userID)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	// Respond with user_id and JWT token
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"user_id": userID,
		"token":   token,
		"message": "User created successfully!",
	})
}

// LoginHandler verifies user credentials and returns user_id on success
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var creds struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	userID, storedHash, err := db.GetUserPasswordHash(creds.Email)
	if err != nil {
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}

	if !CheckPasswordHash(creds.Password, storedHash) {
		http.Error(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	// Respond with user_id so the frontend can store it
	response := map[string]interface{}{
		"user_id": userID,
		"message": "Login successful",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// CheckPasswordHash compares a plaintext password with a hashed password
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
