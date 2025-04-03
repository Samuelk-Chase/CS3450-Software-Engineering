package v1

// import (
// 	"net/http"
// 	"net/http/httptest"
// 	"strings"
// 	"testing"
// )

// func TestRoutes(t *testing.T) {
// 	handler := Routes()

// 	tests := []struct {
// 		method         string
// 		url            string
// 		expectedStatus int
// 		body           string
// 	}{
// 		{"GET", "/character/1", http.StatusOK, ""},
// 		{"GET", "/characters/1", http.StatusOK, ""},
// 		{"GET", "/deck/1", http.StatusOK, ""},
// 		{"POST", "/card", http.StatusOK, `{"cardName":"Ace"}`},
// 		{"POST", "/getNewCharacter", http.StatusOK, `{"characterName":"Hero"}`},
// 		{"POST", "/createUser", http.StatusOK, `{"username":"testuser", "email":"test@example.com", "password":"password"}`},
// 		{"GET", "/boss", http.StatusOK, ""},
// 		{"GET", "/invalid", http.StatusNotFound, ""},
// 		{"POST", "/character/1", http.StatusMethodNotAllowed, ""},
// 	}

// 	for _, test := range tests {
// 		var req *http.Request
// 		var err error

// 		if test.body != "" {
// 			req, err = http.NewRequest(test.method, test.url, strings.NewReader(test.body))
// 			req.Header.Set("Content-Type", "application/json")
// 		} else {
// 			req, err = http.NewRequest(test.method, test.url, nil)
// 		}

// 		if err != nil {
// 			t.Fatalf("could not create request: %v", err)
// 		}

// 		rr := httptest.NewRecorder()
// 		handler.ServeHTTP(rr, req)

// 		if status := rr.Code; status != test.expectedStatus {
// 			t.Errorf("handler returned wrong status code: got %v want %v",
// 				status, test.expectedStatus)
// 		}
// 	}
// }
