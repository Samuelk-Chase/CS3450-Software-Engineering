package v1

// import (
// 	"bytes"
// 	"encoding/json"
// 	"net/http"
// 	"net/http/httptest"
// 	"testing"
// )

// // TestGetCards_ValidRequest tests the /cards/{id} endpoint with a valid request.
// func TestGetCards_ValidRequest(t *testing.T) {
// 	req, err := http.NewRequest("GET", "/cards/1", nil)
// 	if err != nil {
// 		t.Fatalf("could not create request: %v", err)
// 	}

// 	rr := httptest.NewRecorder()
// 	handler := Routes() // Initialize the router with routes
// 	handler.ServeHTTP(rr, req)

// 	if rr.Code != http.StatusOK {
// 		t.Errorf("expected status 200, got %d", rr.Code)
// 	}

// 	var response struct {
// 		Cards []Card `json:"cards"`
// 	}
// 	if err := json.Unmarshal(rr.Body.Bytes(), &response); err != nil {
// 		t.Fatalf("could not parse response: %v", err)
// 	}

// 	if len(response.Cards) == 0 {
// 		t.Errorf("expected non-empty cards array, got empty")
// 	}
// }

// // TestGetCards_InvalidID tests the /cards/{id} endpoint with an invalid ID.
// func TestGetCards_InvalidID(t *testing.T) {
// 	req, err := http.NewRequest("GET", "/cards/invalid", nil)
// 	if err != nil {
// 		t.Fatalf("could not create request: %v", err)
// 	}

// 	rr := httptest.NewRecorder()
// 	handler := Routes()
// 	handler.ServeHTTP(rr, req)

// 	if rr.Code != http.StatusBadRequest {
// 		t.Errorf("expected status 400, got %d", rr.Code)
// 	}
// }

// // TestGetCard_ValidRequest tests the /card endpoint with a valid request.
// func TestGetCard_ValidRequest(t *testing.T) {
// 	cardRequest := map[string]interface{}{
// 		"prompt":       "Create a powerful fire card",
// 		"character_id": 1,
// 	}
// 	body, err := json.Marshal(cardRequest)
// 	if err != nil {
// 		t.Fatalf("could not marshal request body: %v", err)
// 	}

// 	req, err := http.NewRequest("POST", "/card", bytes.NewBuffer(body))
// 	if err != nil {
// 		t.Fatalf("could not create request: %v", err)
// 	}
// 	req.Header.Set("Content-Type", "application/json")

// 	rr := httptest.NewRecorder()
// 	handler := Routes()
// 	handler.ServeHTTP(rr, req)

// 	if rr.Code != http.StatusOK {
// 		t.Errorf("expected status 200, got %d", rr.Code)
// 	}

// 	var response Card
// 	if err := json.Unmarshal(rr.Body.Bytes(), &response); err != nil {
// 		t.Fatalf("could not parse response: %v", err)
// 	}

// 	if response.Name != "Create a powerful fire card" {
// 		t.Errorf("expected card name 'Create a powerful fire card', got '%s'", response.Name)
// 	}
// }

// // TestGetCard_InvalidRequest tests the /card endpoint with an invalid request body.
// func TestGetCard_InvalidRequest(t *testing.T) {
// 	req, err := http.NewRequest("POST", "/card", bytes.NewBuffer([]byte("invalid json")))
// 	if err != nil {
// 		t.Fatalf("could not create request: %v", err)
// 	}
// 	req.Header.Set("Content-Type", "application/json")

// 	rr := httptest.NewRecorder()
// 	handler := Routes()
// 	handler.ServeHTTP(rr, req)

// 	if rr.Code != http.StatusBadRequest {
// 		t.Errorf("expected status 400, got %d", rr.Code)
// 	}
// }

// // TestGetCard_MissingFields tests the /card endpoint with missing fields in the request body.
// func TestGetCard_MissingFields(t *testing.T) {
// 	cardRequest := map[string]interface{}{
// 		"prompt": "Create a powerful fire card",
// 	}
// 	body, err := json.Marshal(cardRequest)
// 	if err != nil {
// 		t.Fatalf("could not marshal request body: %v", err)
// 	}

// 	req, err := http.NewRequest("POST", "/card", bytes.NewBuffer(body))
// 	if err != nil {
// 		t.Fatalf("could not create request: %v", err)
// 	}
// 	req.Header.Set("Content-Type", "application/json")

// 	rr := httptest.NewRecorder()
// 	handler := Routes()
// 	handler.ServeHTTP(rr, req)

// 	if rr.Code != http.StatusBadRequest {
// 		t.Errorf("expected status 400, got %d", rr.Code)
// 	}
// }
