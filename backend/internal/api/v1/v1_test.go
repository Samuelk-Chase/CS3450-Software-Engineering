package v1

import (
	"bufio"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
	"time"
)

func loadEnv() error {
	file, err := os.Open("../../config/.env")
	if err != nil {
		return err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, "#") || line == "" {
			continue
		}
		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}
		key := strings.TrimSpace(parts[0])
		value := strings.TrimSpace(parts[1])
		os.Setenv(key, value)
	}
	return scanner.Err()
}

func TestRoutes(t *testing.T) {
	// Load environment variables
	if err := loadEnv(); err != nil {
		t.Fatalf("Failed to load environment variables: %v", err)
	}

	handler := Routes()
	timestamp := time.Now().UnixNano()

	tests := []struct {
		method         string
		url            string
		expectedStatus int
		body           string
	}{
		{"GET", "/character/1", http.StatusOK, `{"user_id": 1}`},
		{"GET", "/characters?user_id=1", http.StatusOK, `{"user_id": 1}`},
		{"GET", "/cards/1", http.StatusOK, ""},
		{"POST", "/card", http.StatusOK, `{"prompt":"Test card", "character_id":1, "user_id": 1}`},
		{"POST", "/getNewCharacter", http.StatusOK, `{"name":"Hero", "user_id": "1", "adventure_description": "A hero's journey"}`},
		{"POST", "/signup", http.StatusOK, fmt.Sprintf(`{"email":"test%d@example.com", "password":"password123"}`, timestamp)},
		{"POST", "/boss", http.StatusOK, `{"level":1, "user_id": 1, "prompt": "A fierce dragon"}`},
		{"GET", "/invalid", http.StatusNotFound, ""},
	}

	var passedTests []string
	var failedTests []string
	failedTestMap := make(map[string]bool) // Track failed tests to avoid duplicates

	for _, test := range tests {
		var req *http.Request
		var err error

		if test.body != "" {
			req, err = http.NewRequest(test.method, test.url, strings.NewReader(test.body))
			req.Header.Set("Content-Type", "application/json")
		} else {
			req, err = http.NewRequest(test.method, test.url, nil)
		}

		if err != nil {
			t.Fatalf("could not create request: %v", err)
		}
		token, err := GenerateJWT(1) // Use a test user ID (e.g., 1)
		if err != nil {
			t.Fatalf("could not generate test token: %v", err)
		}
		req.Header.Set("Authorization", "Bearer "+token)

		rr := httptest.NewRecorder()
		handler.ServeHTTP(rr, req)

		// Check HTTP status code
		if status := rr.Code; status != test.expectedStatus {
			t.Errorf("❌ Test failed for %s %s: got %v, want %v", test.method, test.url, status, test.expectedStatus)
			if !failedTestMap[test.url] {
				failedTests = append(failedTests, fmt.Sprintf("%s %s (HTTP Status)", test.method, test.url))
				failedTestMap[test.url] = true
			}
			continue
		}

		// Validate response body for specific endpoints
		if test.url == "/character/1" {
			var character Character
			if err := json.NewDecoder(rr.Body).Decode(&character); err != nil {
				t.Errorf("❌ Failed to decode response for %s: %v", test.url, err)
				if !failedTestMap[test.url] {
					failedTests = append(failedTests, fmt.Sprintf("%s %s (Decode Error)", test.method, test.url))
					failedTestMap[test.url] = true
				}
				continue
			}
			if character.CharacterID != 1 {
				t.Errorf("❌ Expected CharacterID 1, got %d", character.CharacterID)
				if !failedTestMap[test.url] {
					failedTests = append(failedTests, fmt.Sprintf("%s %s (Invalid CharacterID)", test.method, test.url))
					failedTestMap[test.url] = true
				}
			}
		}

		if strings.HasPrefix(test.url, "/characters") {
			var characters []Character
			if err := json.NewDecoder(rr.Body).Decode(&characters); err != nil {
				t.Errorf("❌ Failed to decode response for %s: %v", test.url, err)
				if !failedTestMap[test.url] {
					failedTests = append(failedTests, fmt.Sprintf("%s %s (Decode Error)", test.method, test.url))
					failedTestMap[test.url] = true
				}
				continue
			}
			if len(characters) == 0 {
				t.Errorf("❌ Expected at least one character, got none")
				if !failedTestMap[test.url] {
					failedTests = append(failedTests, fmt.Sprintf("%s %s (No Characters)", test.method, test.url))
					failedTestMap[test.url] = true
				}
			}
		}

		if test.url == "/getNewCharacter" {
			var response struct {
				Character Character `json:"character"`
				Intro     string    `json:"intro"`
			}
			if err := json.NewDecoder(rr.Body).Decode(&response); err != nil {
				t.Errorf("❌ Failed to decode response for %s: %v", test.url, err)
				if !failedTestMap[test.url] {
					failedTests = append(failedTests, fmt.Sprintf("%s %s (Decode Error)", test.method, test.url))
					failedTestMap[test.url] = true
				}
				continue
			}
			if response.Character.Name != "Hero" {
				t.Errorf("❌ Expected name 'Hero', got '%s'", response.Character.Name)
				if !failedTestMap[test.url] {
					failedTests = append(failedTests, fmt.Sprintf("%s %s (Invalid Name)", test.method, test.url))
					failedTestMap[test.url] = true
				}
			}
			if response.Character.UserID != 1 {
				t.Errorf("❌ Expected UserID 1, got %d", response.Character.UserID)
				if !failedTestMap[test.url] {
					failedTests = append(failedTests, fmt.Sprintf("%s %s (Invalid UserID)", test.method, test.url))
					failedTestMap[test.url] = true
				}
			}
			if response.Character.Description == "" || response.Character.MaxMana <= 0 || response.Character.MaxHealth <= 0 {
				t.Errorf("❌ Missing or invalid AI-generated fields in character")
				if !failedTestMap[test.url] {
					failedTests = append(failedTests, fmt.Sprintf("%s %s (Invalid AI Fields)", test.method, test.url))
					failedTestMap[test.url] = true
				}
			}
		}

		if test.url == "/boss" {
			var boss Boss
			if err := json.NewDecoder(rr.Body).Decode(&boss); err != nil {
				t.Errorf("❌ Failed to decode response for %s: %v", test.url, err)
				if !failedTestMap[test.url] {
					failedTests = append(failedTests, fmt.Sprintf("%s %s (Decode Error)", test.method, test.url))
					failedTestMap[test.url] = true
				}
				continue
			}
			if boss.Name == "" || boss.Health <= 0 || boss.Mana <= 0 || boss.BossLevel <= 0 {
				t.Errorf("❌ Missing or invalid fields in Boss object: %+v", boss)
				if !failedTestMap[test.url] {
					failedTests = append(failedTests, fmt.Sprintf("%s %s (Invalid Boss Fields)", test.method, test.url))
					failedTestMap[test.url] = true
				}
			}
		}

		if strings.HasPrefix(test.url, "/cards/") {
			var response struct {
				Cards []Card `json:"cards"`
			}
			if err := json.NewDecoder(rr.Body).Decode(&response); err != nil {
				t.Errorf("❌ Failed to decode response for %s: %v", test.url, err)
				if !failedTestMap[test.url] {
					failedTests = append(failedTests, fmt.Sprintf("%s %s (Decode Error)", test.method, test.url))
					failedTestMap[test.url] = true
				}
				continue
			}
			if len(response.Cards) == 0 {
				t.Errorf("❌ Expected at least one card, got none")
				if !failedTestMap[test.url] {
					failedTests = append(failedTests, fmt.Sprintf("%s %s (No Cards)", test.method, test.url))
					failedTestMap[test.url] = true
				}
			}
		}

		if test.url == "/card" {
			var card struct {
				CardID          int    `json:"card_id"`
				Title           string `json:"title"`
				TypeID          int    `json:"type_id"`
				PowerLevel      int    `json:"power_level"`
				ManaCost        int    `json:"mana_cost"`
				CardDescription string `json:"card_description"`
				ImageURL        string `json:"image_url"`
				SoundEffect     string `json:"sound_effect"`
			}
			if err := json.NewDecoder(rr.Body).Decode(&card); err != nil {
				t.Errorf("❌ Failed to decode response for %s: %v", test.url, err)
				if !failedTestMap[test.url] {
					failedTests = append(failedTests, fmt.Sprintf("%s %s (Decode Error)", test.method, test.url))
					failedTestMap[test.url] = true
				}
				continue
			}
		}

		t.Logf("✅ Test passed for %s %s: got %v", test.method, test.url, rr.Code)
		passedTests = append(passedTests, fmt.Sprintf("%s %s", test.method, test.url))
	}

	// Print summary
	t.Logf("\n--- Test Summary ---")
	t.Logf("✅ Passed: %d", len(passedTests))
	t.Logf("❌ Failed: %d", len(failedTests))

	if len(failedTests) > 0 {
		t.Logf("\n❌ Failed Tests:")
		for _, test := range failedTests {
			t.Logf("- %s", test)
		}
	}

	if len(passedTests) > 0 {
		t.Logf("\n✅ Passed Tests:")
		for _, test := range passedTests {
			t.Logf("- %s", test)
		}
	}

	t.Log("\n\n=== End of TestRoutes ===\n\n")
}

func TestMiddlewareWithoutValidToken(t *testing.T) {
	// Load environment variables
	if err := loadEnv(); err != nil {
		t.Fatalf("Failed to load environment variables: %v", err)
	}

	handler := Routes()

	// Create a test request without the Authorization header
	req, err := http.NewRequest("GET", "/character/1", nil)
	if err != nil {
		t.Fatalf("could not create request: %v", err)
	}

	req.Header.Set("Authorization", "Bearer invalid_token")

	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)

	// Check that the middleware rejects the request with a 401 Unauthorized status
	if status := rr.Code; status != http.StatusUnauthorized {
		t.Errorf("❌ Middleware failed: got %v, want %v", status, http.StatusUnauthorized)
	} else {
		t.Logf("✅ Middleware correctly rejected request without Authorization header: got %v", status)
	}

	// Optionally, check the response body for the error message
	expectedError := `{"error":"Invalid or expired token"}`
	actualBody := strings.TrimSpace(rr.Body.String()) // Trim whitespace and newlines
	if actualBody != expectedError {
		t.Errorf("❌ Middleware response body mismatch: got %v, want %v", actualBody, expectedError)
	} else {
		t.Logf("✅ Middleware response body is correct: %v", actualBody)
	}

	t.Log("\n\n=== End of TestMiddlewareWithoutValidToken ===\n\n")
}

func TestBadRequests(t *testing.T) {
	// Load environment variables
	if err := loadEnv(); err != nil {
		t.Fatalf("Failed to load environment variables: %v", err)
	}

	handler := Routes()

	tests := []struct {
		method         string
		url            string
		expectedStatus int
		body           string
		description    string
	}{
		{"POST", "/signup", http.StatusBadRequest, `{"email":""}`, "Missing password in signup request"},
		{"POST", "/signup", http.StatusBadRequest, `{"password":"password123"}`, "Missing email in signup request"},
		{"GET", "/characters?user_id=invalid", http.StatusBadRequest, "", "Invalid user_id in query parameter"},
		{"POST", "/card", http.StatusBadRequest, `{"prompt":"Test card", "character_id":"invalid", "user_id":1}`, "Invalid character_id in card creation request"},
		{"POST", "/getNewCharacter", http.StatusBadRequest, `{"name":""}`, "Missing user_id and adventure_description in new character request"},
		{"POST", "/boss", http.StatusBadRequest, `{"level":"invalid", "user_id":1}`, "Invalid level in boss creation request"},
		{"GET", "/nonexistent", http.StatusNotFound, "", "Nonexistent endpoint"},
	}

	var passedTests []string
	var failedTests []string

	for _, test := range tests {
		var req *http.Request
		var err error

		if test.body != "" {
			req, err = http.NewRequest(test.method, test.url, strings.NewReader(test.body))
			req.Header.Set("Content-Type", "application/json")
		} else {
			req, err = http.NewRequest(test.method, test.url, nil)
		}

		if err != nil {
			t.Fatalf("could not create request: %v", err)
		}

		// Add a valid token for protected routes
		token, err := GenerateJWT(1) // Use a test user ID (e.g., 1)
		if err != nil {
			t.Fatalf("could not generate test token: %v", err)
		}
		req.Header.Set("Authorization", "Bearer "+token)

		rr := httptest.NewRecorder()
		handler.ServeHTTP(rr, req)

		// Check HTTP status code
		if status := rr.Code; status != test.expectedStatus {
			t.Errorf("❌ Test failed for %s %s (%s): got %v, want %v", test.method, test.url, test.description, status, test.expectedStatus)
			failedTests = append(failedTests, fmt.Sprintf("%s %s (%s)", test.method, test.url, test.description))
		} else {
			t.Logf("✅ Test passed for %s %s (%s): got %v", test.method, test.url, test.description, status)
			passedTests = append(passedTests, fmt.Sprintf("%s %s (%s)", test.method, test.url, test.description))
		}
	}

	// Print summary
	t.Logf("\n--- Test Summary ---")
	t.Logf("✅ Passed: %d", len(passedTests))
	t.Logf("❌ Failed: %d", len(failedTests))

	if len(failedTests) > 0 {
		t.Logf("\n❌ Failed Tests:")
		for _, test := range failedTests {
			t.Logf("- %s", test)
		}
	}

	if len(passedTests) > 0 {
		t.Logf("\n✅ Passed Tests:")
		for _, test := range passedTests {
			t.Logf("- %s", test)
		}
	}

	t.Log("\n\n=== End of TestBadRequests ===\n\n")
}
