package db

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
)

// User struct for inserting into Supabase
type User struct {
	Email            string `json:"email"`
	PasswordHash     string `json:"password_hash"`
	PurchaseStatusID int    `json:"purchase_status_id"`
}

// InsertUser adds a new user to the Supabase database
func InsertUser(email, hashedPassword string) error {
	supabaseURL := os.Getenv("SUPABASE_URL") + "/rest/v1/users"
	supabaseKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")

	// Create request body matching the database schema
	user := User{
		Email:            email,
		PasswordHash:     hashedPassword,
		PurchaseStatusID: 1, // Default purchase status (adjust if needed)
	}
	body, err := json.Marshal(user)
	if err != nil {
		return err
	}

	// Make request to Supabase
	req, err := http.NewRequest("POST", supabaseURL, bytes.NewBuffer(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", supabaseKey)
	req.Header.Set("Authorization", "Bearer "+supabaseKey)
	req.Header.Set("Prefer", "return=minimal") // Avoids unnecessary response data

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Check for errors in response
	if resp.StatusCode != http.StatusCreated {
		return errors.New(fmt.Sprintf("Failed to insert user, status: %d", resp.StatusCode))
	}

	return nil
}

// getPasswordResponse maps to Supabase response
type getPasswordResponse struct {
	PasswordHash string `json:"password_hash"`
}

// GetUserPasswordHash retrieves the hashed password for a given email
func GetUserPasswordHash(email string) (string, error) {
	supabaseURL := os.Getenv("SUPABASE_URL") + "/rest/v1/users?email=eq." + email + "&select=password_hash"
	supabaseKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")

	req, err := http.NewRequest("GET", supabaseURL, nil)
	if err != nil {
		return "", err
	}
	req.Header.Set("apikey", supabaseKey)
	req.Header.Set("Authorization", "Bearer "+supabaseKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	// Handle empty response
	if resp.StatusCode != http.StatusOK {
		return "", errors.New("user not found")
	}

	// Decode response
	var users []getPasswordResponse
	if err := json.NewDecoder(resp.Body).Decode(&users); err != nil {
		return "", err
	}

	// Ensure we got a user
	if len(users) == 0 {
		return "", errors.New("user not found")
	}

	return users[0].PasswordHash, nil
}
