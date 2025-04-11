package v1

import (
	"bufio"
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
		{"GET", "/characters", http.StatusOK, `{"user_id": 1}`},
		{"GET", "/cards/1", http.StatusOK, ""},
		{"POST", "/card", http.StatusOK, `{"prompt":"Test card", "character_id":1, "user_id": 1}`},
		{"POST", "/getNewCharacter", http.StatusOK, `{"name":"Hero", "user_id": 1, "adventure_description": "A hero's journey"}`},
		{"POST", "/signup", http.StatusOK, fmt.Sprintf(`{"email":"test%d@example.com", "password":"password123"}`, timestamp)},
		{"POST", "/boss", http.StatusOK, `{"level":1, "user_id": 1}`},
		{"GET", "/invalid", http.StatusNotFound, ""},
	}

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

		rr := httptest.NewRecorder()
		handler.ServeHTTP(rr, req)

		if status := rr.Code; status != test.expectedStatus {
			t.Errorf("handler returned wrong status code: got %v want %v",
				status, test.expectedStatus)
		}
	}
}
