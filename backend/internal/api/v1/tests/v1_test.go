package v1

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

// TestGetCardsEndpoint verifies that a GET request to "/cards/{id}" returns a 200 OK
// and a valid JSON response. Adjust the expected response structure as needed.
func TestGetCardsEndpoint(t *testing.T) {
	// Create a request to pass to our handler.
	req, err := http.NewRequest("GET", "v1/cards/157", nil)
	if err != nil {
		t.Fatalf("could not create GET request: %v", err)
	}

	// Record the response.
	rr := httptest.NewRecorder()

	// Get the router with all the v1 routes.
	handler := http.NewServeMux() // Replace with your actual router initialization
	// Example: handler := InitializeRoutes() if you have a function to set up routes

	// Serve the HTTP request.
	handler.ServeHTTP(rr, req)

	// Print the response body for debugging.
	t.Logf("Response Body: %s", rr.Body.String())

	// Check the status code.
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("GET /cards/{id} returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	// Optionally, parse and check the JSON response.
	var response map[string]interface{}
	if err := json.Unmarshal(rr.Body.Bytes(), &response); err != nil {
		t.Errorf("GET /cards/{id} returned invalid JSON: %v", err)
	}

	// Example check: if you expect a "cards" key in the response.
	if _, ok := response["cards"]; !ok {
		t.Errorf("expected key 'cards' in JSON response")
	}
}

// TestCreateCardEndpoint verifies that a POST request to "/card" returns a 200 OK,
// and the returned JSON contains the expected fields.
// This test assumes that the endpoint echoes back the card data.
func TestCreateCardEndpoint(t *testing.T) {
	// Create a sample card payload.
	cardRequest := map[string]interface{}{
		"name":        "Test Card",
		"description": "This is a test card",
	}

	// Marshal the request body to JSON.
	body, err := json.Marshal(cardRequest)
	if err != nil {
		t.Fatalf("could not marshal JSON: %v", err)
	}

	// Create a POST request with the JSON body.
	req, err := http.NewRequest("POST", "/card", bytes.NewBuffer(body))
	if err != nil {
		t.Fatalf("could not create POST request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Record the response.
	rr := httptest.NewRecorder()

	// Get the router with the v1 routes.
	handler := http.NewServeMux() // Replace with your actual router initialization
	// Example: handler := InitializeRoutes() if you have a function to set up routes

	// Serve the HTTP request.
	handler.ServeHTTP(rr, req)

	// Print the response body for debugging.
	t.Logf("Response Body: %s", rr.Body.String())

	// Check the status code.
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("POST /card returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	// Parse the JSON response.
	var response map[string]interface{}
	if err := json.Unmarshal(rr.Body.Bytes(), &response); err != nil {
		t.Errorf("POST /card returned invalid JSON: %v", err)
	}

	// Example check: verify that the response contains the expected card name.
	if response["name"] != "Test Card" {
		t.Errorf("expected card name 'Test Card', got %v", response["name"])
	}
}
