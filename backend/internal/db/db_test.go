package db

import (
	"bufio"
	"database/sql"
	"fmt"
	"os"
	"strings"
	"testing"
	"time"

	"beanboys-lastgame-backend/internal/db/cardsdb"
	storydb "beanboys-lastgame-backend/internal/db/story_db"

	_ "github.com/lib/pq"
)

// Card represents a card in the game
type Card struct {
	CardID          int    `json:"card_id"`
	TypeID          int    `json:"type_id"`
	Title           string `json:"title"`
	ManaCost        int    `json:"mana_cost"`
	CardDescription string `json:"card_description"`
	ImageURL        string `json:"image_url"`
	PowerLevel      int    `json:"power_level"`
	CharacterID     int    `json:"character_id"`
	SoundEffect     string `json:"sound_effect"`
}

// getConnectionString returns the database connection string
func getConnectionString() string {
	return fmt.Sprintf("postgres://%s:%s@%s/postgres?sslmode=require",
		"postgres", // Default Supabase user
		os.Getenv("SUPABASE_SERVICE_ROLE_KEY"),
		strings.TrimPrefix(os.Getenv("SUPABASE_URL"), "https://"),
	)
}

// InsertCard inserts a new card into the database
func InsertCard(card Card) (int, error) {
	db, err := sql.Open("postgres", getConnectionString())
	if err != nil {
		return 0, fmt.Errorf("failed to connect to database: %v", err)
	}
	defer db.Close()

	var cardID int
	err = db.QueryRow(`
		INSERT INTO cards (type_id, title, mana_cost, card_description, image_url, power_level, character_id, sound_effect)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING card_id
	`, card.TypeID, card.Title, card.ManaCost, card.CardDescription, card.ImageURL, card.PowerLevel, card.CharacterID, card.SoundEffect).Scan(&cardID)

	if err != nil {
		return 0, fmt.Errorf("failed to insert card: %v", err)
	}

	return cardID, nil
}

// GetCardByID retrieves a card by its ID
func GetCardByID(cardID int) (*Card, error) {
	db, err := sql.Open("postgres", getConnectionString())
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %v", err)
	}
	defer db.Close()

	card := &Card{}
	err = db.QueryRow(`
		SELECT card_id, type_id, title, mana_cost, card_description, image_url, power_level, character_id, sound_effect
		FROM cards
		WHERE card_id = $1
	`, cardID).Scan(&card.CardID, &card.TypeID, &card.Title, &card.ManaCost, &card.CardDescription, &card.ImageURL, &card.PowerLevel, &card.CharacterID, &card.SoundEffect)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("card not found")
		}
		return nil, fmt.Errorf("failed to get card: %v", err)
	}

	return card, nil
}

// GetCardsByCharacterID retrieves all cards for a character
func GetCardsByCharacterID(characterID int) ([]Card, error) {
	db, err := sql.Open("postgres", getConnectionString())
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %v", err)
	}
	defer db.Close()

	rows, err := db.Query(`
		SELECT card_id, type_id, title, mana_cost, card_description, image_url, power_level, character_id, sound_effect
		FROM cards
		WHERE character_id = $1
	`, characterID)
	if err != nil {
		return nil, fmt.Errorf("failed to query cards: %v", err)
	}
	defer rows.Close()

	var cards []Card
	for rows.Next() {
		var card Card
		err := rows.Scan(&card.CardID, &card.TypeID, &card.Title, &card.ManaCost, &card.CardDescription, &card.ImageURL, &card.PowerLevel, &card.CharacterID, &card.SoundEffect)
		if err != nil {
			return nil, fmt.Errorf("failed to scan card: %v", err)
		}
		cards = append(cards, card)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating cards: %v", err)
	}

	return cards, nil
}

func loadEnv() error {
	file, err := os.Open("../config/.env")
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

func TestInsertUser(t *testing.T) {
	// Load environment variables
	if err := loadEnv(); err != nil {
		t.Fatalf("Failed to load environment variables: %v", err)
	}

	// Generate a unique email for testing
	timestamp := time.Now().UnixNano()
	uniqueEmail := fmt.Sprintf("test%d@example.com", timestamp)

	// Test cases
	tests := []struct {
		name          string
		email         string
		password      string
		wantErr       bool
		errorContains string
	}{
		{
			name:          "Valid user creation",
			email:         uniqueEmail,
			password:      "testpassword123",
			wantErr:       false,
			errorContains: "",
		},
		{
			name:          "Duplicate email",
			email:         uniqueEmail, // Use the same email to test duplicate detection
			password:      "testpassword123",
			wantErr:       true,
			errorContains: "user already exists",
		},
		{
			name:          "Invalid email format",
			email:         "notanemail",
			password:      "testpassword123",
			wantErr:       true,
			errorContains: "invalid email format",
		},
		{
			name:          "Password too short",
			email:         fmt.Sprintf("test%d@example.com", timestamp+1),
			password:      "short",
			wantErr:       true,
			errorContains: "password too short",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Hash the password
			hashedPassword, err := hashAndSalt(tt.password)
			if err != nil && !tt.wantErr {
				t.Errorf("hashAndSalt() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			// Try to insert the user
			userID, err := InsertUser(tt.email, hashedPassword)

			// Check if we got an error when we expected one
			if (err != nil) != tt.wantErr {
				t.Errorf("InsertUser() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			// If we didn't expect an error, check that we got a valid userID
			if !tt.wantErr {
				if userID <= 0 {
					t.Errorf("InsertUser() returned invalid userID = %v", userID)
				}
			}

			// If we expected an error, check that it contains the expected string
			if tt.wantErr && tt.errorContains != "" {
				if err == nil || !strings.Contains(err.Error(), tt.errorContains) {
					t.Errorf("InsertUser() error = %v, want error containing %v", err, tt.errorContains)
				}
			}
		})
	}
}

// Helper function to hash and salt passwords
func hashAndSalt(password string) (string, error) {
	// In a real test, you would use bcrypt or another secure hashing algorithm
	// For testing purposes, we'll just return a mock hash
	if len(password) < 6 {
		return "", fmt.Errorf("password too short")
	}
	return "hashed_" + password, nil
}

// TestInsertCharacter tests the character insertion functionality
func TestInsertCharacter(t *testing.T) {
	if err := loadEnv(); err != nil {
		t.Fatalf("Failed to load environment variables: %v", err)
	}

	// First create a test user
	timestamp := time.Now().UnixNano()
	email := fmt.Sprintf("test%d@example.com", timestamp)
	userID, err := InsertUser(email, "hashed_testpassword123")
	if err != nil {
		t.Fatalf("Failed to create test user: %v", err)
	}

	tests := []struct {
		name          string
		character     Character
		wantErr       bool
		errorContains string
	}{
		{
			name: "Valid character creation",
			character: Character{
				UserID:        userID,
				Name:          "Test Character",
				Description:   "A test character",
				CurrentMana:   100,
				MaxMana:       100,
				CurrentHealth: 100,
				MaxHealth:     100,
				ImageURL:      "http://example.com/image.jpg",
			},
			wantErr: false,
		},
		{
			name: "Invalid user ID",
			character: Character{
				UserID:        -1,
				Name:          "Invalid User Character",
				Description:   "Should fail",
				CurrentMana:   100,
				MaxMana:       100,
				CurrentHealth: 100,
				MaxHealth:     100,
			},
			wantErr:       true,
			errorContains: "failed to insert character",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			characterID, err := InsertCharacter(tt.character)

			if (err != nil) != tt.wantErr {
				t.Errorf("InsertCharacter() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if !tt.wantErr {
				if characterID <= 0 {
					t.Errorf("InsertCharacter() returned invalid characterID = %v", characterID)
				}

				// Verify the character was created correctly
				character, err := GetCharacterByID(characterID)
				if err != nil {
					t.Errorf("Failed to retrieve created character: %v", err)
					return
				}

				if character.Name != tt.character.Name {
					t.Errorf("Character name mismatch, got = %v, want %v", character.Name, tt.character.Name)
				}
			}
		})
	}
}

// TestGetCharacterByID tests retrieving a character by ID
func TestGetCharacterByID(t *testing.T) {
	if err := loadEnv(); err != nil {
		t.Fatalf("Failed to load environment variables: %v", err)
	}

	// Create a test user and character
	timestamp := time.Now().UnixNano()
	email := fmt.Sprintf("test%d@example.com", timestamp)
	userID, err := InsertUser(email, "hashed_testpassword123")
	if err != nil {
		t.Fatalf("Failed to create test user: %v", err)
	}

	character := Character{
		UserID:        userID,
		Name:          "Test Character for GetByID",
		Description:   "A test character",
		CurrentMana:   100,
		MaxMana:       100,
		CurrentHealth: 100,
		MaxHealth:     100,
		ImageURL:      "http://example.com/image.jpg",
	}

	characterID, err := InsertCharacter(character)
	if err != nil {
		t.Fatalf("Failed to create test character: %v", err)
	}

	tests := []struct {
		name          string
		characterID   int
		wantErr       bool
		errorContains string
	}{
		{
			name:        "Valid character ID",
			characterID: characterID,
			wantErr:     false,
		},
		{
			name:          "Invalid character ID",
			characterID:   -1,
			wantErr:       true,
			errorContains: "character not found",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			character, err := GetCharacterByID(tt.characterID)

			if (err != nil) != tt.wantErr {
				t.Errorf("GetCharacterByID() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if !tt.wantErr {
				if character.CharacterID != tt.characterID {
					t.Errorf("GetCharacterByID() returned wrong character, got ID = %v, want ID = %v", character.CharacterID, tt.characterID)
				}
			}
		})
	}
}

// TestGetUserCharacters tests retrieving all characters for a user
func TestGetUserCharacters(t *testing.T) {
	if err := loadEnv(); err != nil {
		t.Fatalf("Failed to load environment variables: %v", err)
	}

	// Create a test user
	timestamp := time.Now().UnixNano()
	email := fmt.Sprintf("test%d@example.com", timestamp)
	userID, err := InsertUser(email, "hashed_testpassword123")
	if err != nil {
		t.Fatalf("Failed to create test user: %v", err)
	}

	// Create two test characters for the user
	characters := []Character{
		{
			UserID:        userID,
			Name:          "Test Character 1",
			Description:   "First test character",
			CurrentMana:   100,
			MaxMana:       100,
			CurrentHealth: 100,
			MaxHealth:     100,
			ImageURL:      "http://example.com/image1.jpg",
		},
		{
			UserID:        userID,
			Name:          "Test Character 2",
			Description:   "Second test character",
			CurrentMana:   90,
			MaxMana:       90,
			CurrentHealth: 90,
			MaxHealth:     90,
			ImageURL:      "http://example.com/image2.jpg",
		},
	}

	for _, char := range characters {
		_, err := InsertCharacter(char)
		if err != nil {
			t.Fatalf("Failed to create test character: %v", err)
		}
	}

	tests := []struct {
		name          string
		userID        int
		wantCount     int
		wantErr       bool
		errorContains string
	}{
		{
			name:      "Valid user ID",
			userID:    userID,
			wantCount: 2,
			wantErr:   false,
		},
		{
			name:      "Invalid user ID",
			userID:    -1,
			wantCount: 0,
			wantErr:   false, // The function returns empty slice for non-existent user
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			characters, err := GetUserCharacters(tt.userID)

			if (err != nil) != tt.wantErr {
				t.Errorf("GetUserCharacters() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if !tt.wantErr && len(characters) != tt.wantCount {
				t.Errorf("GetUserCharacters() returned wrong number of characters, got = %v, want = %v", len(characters), tt.wantCount)
			}
		})
	}
}

// TestGetUserPasswordHash tests retrieving a user's password hash
func TestGetUserPasswordHash(t *testing.T) {
	if err := loadEnv(); err != nil {
		t.Fatalf("Failed to load environment variables: %v", err)
	}

	// Create a test user
	timestamp := time.Now().UnixNano()
	email := fmt.Sprintf("test%d@example.com", timestamp)
	password := "hashed_testpassword123"
	_, err := InsertUser(email, password)
	if err != nil {
		t.Fatalf("Failed to create test user: %v", err)
	}

	tests := []struct {
		name          string
		email         string
		wantErr       bool
		errorContains string
	}{
		{
			name:    "Valid email",
			email:   email,
			wantErr: false,
		},
		{
			name:          "Non-existent email",
			email:         "nonexistent@example.com",
			wantErr:       true,
			errorContains: "user not found",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			userID, hash, err := GetUserPasswordHash(tt.email)

			if (err != nil) != tt.wantErr {
				t.Errorf("GetUserPasswordHash() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if !tt.wantErr {
				if userID <= 0 {
					t.Errorf("GetUserPasswordHash() returned invalid userID = %v", userID)
				}
				if hash != password {
					t.Errorf("GetUserPasswordHash() returned wrong hash, got = %v, want = %v", hash, password)
				}
			}
		})
	}
}

// TestInsertCard tests the InsertCard function
func TestInsertCard(t *testing.T) {
	if err := loadEnv(); err != nil {
		t.Fatalf("Failed to load environment variables: %v", err)
	}

	// Create a test user and character
	timestamp := time.Now().UnixNano()
	email := fmt.Sprintf("test%d@example.com", timestamp)
	userID, err := InsertUser(email, "hashed_testpassword123")
	if err != nil {
		t.Fatalf("Failed to create test user: %v", err)
	}

	character := Character{
		UserID:        userID,
		Name:          "Test Character",
		Description:   "A test character",
		CurrentMana:   100,
		MaxMana:       100,
		CurrentHealth: 100,
		MaxHealth:     100,
		ImageURL:      "http://example.com/image.jpg",
	}

	characterID, err := InsertCharacter(character)
	if err != nil {
		t.Fatalf("Failed to create test character: %v", err)
	}

	tests := []struct {
		name          string
		card          cardsdb.Card
		wantErr       bool
		errorContains string
	}{
		{
			name: "Valid card creation",
			card: cardsdb.Card{
				TypeID:          1,
				Title:           "Test Card",
				ManaCost:        3,
				CardDescription: "A test card",
				ImageURL:        "http://example.com/card.jpg",
				PowerLevel:      1,
				CharacterID:     characterID,
				SoundEffect:     "test_sound",
			},
			wantErr: false,
		},
		{
			name: "Invalid character ID",
			card: cardsdb.Card{
				TypeID:          1,
				Title:           "Invalid Card",
				ManaCost:        3,
				CardDescription: "Should fail",
				ImageURL:        "http://example.com/card.jpg",
				PowerLevel:      1,
				CharacterID:     -1,
				SoundEffect:     "test_sound",
			},
			wantErr:       true,
			errorContains: "failed to insert card",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			cardID, err := cardsdb.InsertCard(tt.card)

			if (err != nil) != tt.wantErr {
				t.Errorf("InsertCard() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if !tt.wantErr {
				if cardID <= 0 {
					t.Errorf("InsertCard() returned invalid cardID = %v", cardID)
				}

				// Verify the card was created correctly
				card, err := cardsdb.GetCardByID(cardID)
				if err != nil {
					t.Errorf("Failed to retrieve created card: %v", err)
					return
				}

				if card.Title != tt.card.Title {
					t.Errorf("Card title mismatch, got = %v, want %v", card.Title, tt.card.Title)
				}
			}
		})
	}
}

// TestGetCardsByCharacterID tests retrieving all cards for a character
func TestGetCardsByCharacterID(t *testing.T) {
	if err := loadEnv(); err != nil {
		t.Fatalf("Failed to load environment variables: %v", err)
	}

	// Create a test user and character
	timestamp := time.Now().UnixNano()
	email := fmt.Sprintf("test%d@example.com", timestamp)
	userID, err := InsertUser(email, "hashed_testpassword123")
	if err != nil {
		t.Fatalf("Failed to create test user: %v", err)
	}

	character := Character{
		UserID:        userID,
		Name:          "Test Character",
		Description:   "A test character",
		CurrentMana:   100,
		MaxMana:       100,
		CurrentHealth: 100,
		MaxHealth:     100,
		ImageURL:      "http://example.com/image.jpg",
	}

	characterID, err := InsertCharacter(character)
	if err != nil {
		t.Fatalf("Failed to create test character: %v", err)
	}

	// Create two test cards for the character
	cards := []cardsdb.Card{
		{
			TypeID:          1,
			Title:           "Test Card 1",
			ManaCost:        3,
			CardDescription: "First test card",
			ImageURL:        "http://example.com/card1.jpg",
			PowerLevel:      1,
			CharacterID:     characterID,
			SoundEffect:     "test_sound1",
		},
		{
			TypeID:          1,
			Title:           "Test Card 2",
			ManaCost:        2,
			CardDescription: "Second test card",
			ImageURL:        "http://example.com/card2.jpg",
			PowerLevel:      1,
			CharacterID:     characterID,
			SoundEffect:     "test_sound2",
		},
	}

	for _, card := range cards {
		_, err := cardsdb.InsertCard(card)
		if err != nil {
			t.Fatalf("Failed to create test card: %v", err)
		}
	}

	tests := []struct {
		name          string
		characterID   int
		wantCount     int
		wantErr       bool
		errorContains string
	}{
		{
			name:        "Valid character ID",
			characterID: characterID,
			wantCount:   2,
			wantErr:     false,
		},
		{
			name:        "Invalid character ID",
			characterID: -1,
			wantCount:   0,
			wantErr:     false, // The function returns empty slice for non-existent character
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			cards, err := cardsdb.GetCardsByCharacterID(tt.characterID)

			if (err != nil) != tt.wantErr {
				t.Errorf("GetCardsByCharacterID() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if len(cards) != tt.wantCount {
				t.Errorf("GetCardsByCharacterID() returned %v cards, want %v", len(cards), tt.wantCount)
			}
		})
	}
}

// TestInsertStory tests the story insertion functionality
func TestInsertStory(t *testing.T) {
	if err := loadEnv(); err != nil {
		t.Fatalf("Failed to load environment variables: %v", err)
	}

	// Create a test user and character first
	timestamp := time.Now().UnixNano()
	email := fmt.Sprintf("test%d@example.com", timestamp)
	userID, err := InsertUser(email, "hashed_testpassword123")
	if err != nil {
		t.Fatalf("Failed to create test user: %v", err)
	}

	character := Character{
		UserID:        userID,
		Name:          "Test Character",
		Description:   "A test character",
		CurrentMana:   100,
		MaxMana:       100,
		CurrentHealth: 100,
		MaxHealth:     100,
		ImageURL:      "http://example.com/image.jpg",
	}

	characterID, err := InsertCharacter(character)
	if err != nil {
		t.Fatalf("Failed to create test character: %v", err)
	}

	tests := []struct {
		name          string
		story         storydb.Story
		wantErr       bool
		errorContains string
	}{
		{
			name: "Valid story creation",
			story: storydb.Story{
				CharacterID: characterID,
				Prompt:      "Test prompt",
				Response:    "Test response",
			},
			wantErr: false,
		},
		{
			name: "Invalid character ID",
			story: storydb.Story{
				CharacterID: -1,
				Prompt:      "Test prompt",
				Response:    "Test response",
			},
			wantErr:       true,
			errorContains: "failed to insert story",
		},
		{
			name: "Empty prompt",
			story: storydb.Story{
				CharacterID: characterID,
				Prompt:      "",
				Response:    "Test response",
			},
			wantErr:       true,
			errorContains: "failed to insert story",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := storydb.InsertStory(tt.story)

			if (err != nil) != tt.wantErr {
				t.Errorf("InsertStory() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if tt.wantErr && err != nil {
				if !strings.Contains(err.Error(), tt.errorContains) {
					t.Errorf("InsertStory() error = %v, want error containing %v", err, tt.errorContains)
				}
			}
		})
	}
}

// TestGetStoriesByCharacterID tests retrieving stories for a character
func TestGetStoriesByCharacterID(t *testing.T) {
	if err := loadEnv(); err != nil {
		t.Fatalf("Failed to load environment variables: %v", err)
	}

	// Create a test user and character
	timestamp := time.Now().UnixNano()
	email := fmt.Sprintf("test%d@example.com", timestamp)
	userID, err := InsertUser(email, "hashed_testpassword123")
	if err != nil {
		t.Fatalf("Failed to create test user: %v", err)
	}

	character := Character{
		UserID:        userID,
		Name:          "Test Character",
		Description:   "A test character",
		CurrentMana:   100,
		MaxMana:       100,
		CurrentHealth: 100,
		MaxHealth:     100,
		ImageURL:      "http://example.com/image.jpg",
	}

	characterID, err := InsertCharacter(character)
	if err != nil {
		t.Fatalf("Failed to create test character: %v", err)
	}

	// Create 6 test stories for the character
	stories := []storydb.Story{
		{
			CharacterID: characterID,
			Prompt:      "Test prompt 1",
			Response:    "Test response 1",
		},
		{
			CharacterID: characterID,
			Prompt:      "Test prompt 2",
			Response:    "Test response 2",
		},
		{
			CharacterID: characterID,
			Prompt:      "Test prompt 3",
			Response:    "Test response 3",
		},
		{
			CharacterID: characterID,
			Prompt:      "Test prompt 4",
			Response:    "Test response 4",
		},
		{
			CharacterID: characterID,
			Prompt:      "Test prompt 5",
			Response:    "Test response 5",
		},
		{
			CharacterID: characterID,
			Prompt:      "Test prompt 6",
			Response:    "Test response 6",
		},
	}

	for _, story := range stories {
		err := storydb.InsertStory(story)
		if err != nil {
			t.Fatalf("Failed to create test story: %v", err)
		}
	}

	tests := []struct {
		name          string
		characterID   int
		wantCount     int
		wantErr       bool
		errorContains string
	}{
		{
			name:        "Valid character ID",
			characterID: characterID,
			wantCount:   5, // Should only return 5 most recent stories
			wantErr:     false,
		},
		{
			name:        "Invalid character ID",
			characterID: -1,
			wantCount:   0,
			wantErr:     false, // Returns empty slice for non-existent character
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			stories, err := storydb.GetStoriesByCharacterID(tt.characterID)

			if (err != nil) != tt.wantErr {
				t.Errorf("GetStoriesByCharacterID() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if len(stories) != tt.wantCount {
				t.Errorf("GetStoriesByCharacterID() returned %v stories, want %v", len(stories), tt.wantCount)
			}

			// For valid character, verify stories are ordered by most recent first
			if tt.characterID == characterID && len(stories) > 1 {
				for i := 0; i < len(stories)-1; i++ {
					if stories[i].StoryID < stories[i+1].StoryID {
						t.Errorf("Stories not ordered by most recent first at index %d", i)
					}
				}
			}
		})
	}
}
