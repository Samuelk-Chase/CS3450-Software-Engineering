package v1

import (
	"encoding/json"
	"fmt"
	"net/http"

	"beanboys-lastgame-backend/internal/db/queries"

	"golang.org/x/crypto/bcrypt"
)

// User defines the structure of our user object.
type User struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// hashAndSalt hashes and salts the given password.
func hashAndSalt(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

// createUser is an HTTP handler that creates a user object based on the provided username, email, and password.
func createUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("create user called!")

	// Ensure the request method is POST.
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Parse the request body.
	var requestData struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Hash and salt the password.
	hashedPassword, err := hashAndSalt(requestData.Password)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	// Store the user in the database.
	if err := queries.CreateUser(requestData.Username, requestData.Email, hashedPassword, 0); err != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	// Create the user object.
	user := User{
		Username: requestData.Username,
		Email:    requestData.Email,
		Password: hashedPassword,
	}

	// Set the response header to indicate JSON content.
	w.Header().Set("Content-Type", "application/json")

	// Encode the user object to JSON and write it to the response.
	if err := json.NewEncoder(w).Encode(user); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// getUser is an HTTP handler that retrieves a user object based on the provided username and password.
func getUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("get user called!")

	// Ensure the request method is POST.
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Parse the request body.
	var requestData struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Retrieve the user from the database.
	user, err := queries.GetUserByUsername(requestData.Username)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Compare the provided password with the stored password hash.
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(requestData.Password))
	if err != nil {
		http.Error(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	// Set the response header to indicate JSON content.
	w.Header().Set("Content-Type", "application/json")

	// Encode the user object to JSON and write it to the response.
	if err := json.NewEncoder(w).Encode(user); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
