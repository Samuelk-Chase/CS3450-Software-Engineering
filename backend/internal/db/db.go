package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq" // Import the PostgreSQL driver
)

func Connect() *sql.DB {
	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_KEY")

	// Ensure the URL and key are not empty
	if supabaseURL == "" || supabaseKey == "" {
		log.Fatal("Supabase URL or key is not set in environment variables")
	}

	// Construct the connection string
	connStr := fmt.Sprintf("postgres://postgres:%s@%s:5432/postgres?sslmode=require", supabaseKey, supabaseURL)
	log.Printf("Connecting to database with connection string: %s", connStr)

	db, err := sql.Open("postgres", connStr)

	log.Println("Database connection opened")
	if err != nil {
		log.Fatalf("Error opening database connection: %v", err)

	}
	log.Println("check nil")

	// Verify the connection
	err = db.Ping()
	log.Println("Database connection pinged")

	if err != nil {
		log.Fatalf("Error verifying database connection: %v", err)
	}

	log.Println("Database connection verified")
	return db
}
