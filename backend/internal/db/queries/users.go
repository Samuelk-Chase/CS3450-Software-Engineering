package queries

import (
	"database/sql"
	"log"
	"time"
)

var db *sql.DB

func Init(database *sql.DB) {
	db = database
}

func CreateUser(username, email, passwordHash string, purchaseStatusID int) error {
	stmt, err := db.Prepare("INSERT INTO users (username, email, password_hash, created_at, purchase_status_id) VALUES ($1, $2, $3, $4, $5)")
	if err != nil {
		log.Printf("Error preparing statement: %v", err)
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(username, email, passwordHash, time.Now(), purchaseStatusID)
	if err != nil {
		log.Printf("Error executing statement: %v", err)
		return err
	}
	return nil
}

func GetUserByID(userID int) (*User, error) {
	stmt, err := db.Prepare("SELECT user_id, username, email, created_at, purchase_status_id, password_hash FROM users WHERE user_id = $1")
	if err != nil {
		log.Printf("Error preparing statement: %v", err)
		return nil, err
	}
	defer stmt.Close()

	var user User
	err = stmt.QueryRow(userID).Scan(&user.ID, &user.Username, &user.Email, &user.CreatedAt, &user.PurchaseStatusID, &user.PasswordHash)
	if err != nil {
		log.Printf("Error scanning row: %v", err)
		return nil, err
	}
	return &user, nil
}

func GetUserByUsername(username string) (*User, error) {
	stmt, err := db.Prepare("SELECT user_id, username, email, created_at, purchase_status_id, password_hash FROM users WHERE username = $1")
	if err != nil {
		log.Printf("Error preparing statement: %v", err)
		return nil, err
	}
	defer stmt.Close()

	var user User
	err = stmt.QueryRow(username).Scan(&user.ID, &user.Username, &user.Email, &user.CreatedAt, &user.PurchaseStatusID, &user.PasswordHash)
	if err != nil {
		log.Printf("Error scanning row: %v", err)
		return nil, err
	}
	return &user, nil
}

// Define the User struct
type User struct {
	ID               int
	Username         string
	Email            string
	CreatedAt        time.Time
	PurchaseStatusID int
	PasswordHash     string
}
