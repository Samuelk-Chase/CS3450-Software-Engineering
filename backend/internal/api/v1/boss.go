package v1

import (
	"encoding/json"
	"net/http"
)

// Boss defines the structure of our boss object.
type Boss struct {
	Name      string `json:"name"`
	Health    int    `json:"health"`
	BossLevel int    `json:"bossLevel"`
	Mana      int    `json:"mana"`
	ImageURL  string `json:"image_url"`
}

// getBoss is an HTTP handler that returns a boss object as JSON.
func getBoss(w http.ResponseWriter, r *http.Request) {
	// Create a sample boss.
	boss := Boss{
		Name:      "Sample Boss",
		Health:    1000,
		BossLevel: 10,
		Mana:      500,
		ImageURL:  "http://example.com/sample-boss.jpg",
	}

	// Set the response header to indicate JSON content.
	w.Header().Set("Content-Type", "application/json")

	// Encode the boss object to JSON and write it to the response.
	if err := json.NewEncoder(w).Encode(boss); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
