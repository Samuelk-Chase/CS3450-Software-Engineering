# Last Game Backend

Project structure:
```
.
├── README.md
├── cmd
│   └── api
│       └── main.go
├── go.mod
├── go.sum
└── internal
    ├── api
    │   └── v1
    │       ├── llm
    │       │   └── llm.go
    │       ├── MORE ROUTES GO HERE
    │       ├── ...
    │       └── v1.go
    ├── config
    │   ├── .env
    │   └── example.env
    ├── db
    │   └── db.go
    ├── middleware
    │   └── middleware.go
    └── routes
        └── routes.go
```

New REST endpoints go in `internal/api/v1`

Put environment variables in `internal/config/.env`. Make sure to copy the key into `internal/config/example.env` (NOT the value)

Database access operations go in `internal/db`

## How to run

To run for testing, 
```bash
# inside this directory
go run cmd/api/main.go --port 8080
```

To build, run
```bash
# inside this directory
go build cmd/api/main.go
```
