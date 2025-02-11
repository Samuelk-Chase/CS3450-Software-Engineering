## Input/Output Processing for Backend

### Overview

The backend of "The Last Game" follows a structured Input/Output (I/O) model to facilitate communication between the client, database, external services, and internal game logic components. This section outlines the I/O processing in terms of API endpoints, data flows, and interactions between different backend components.

1. Input Processing

Input processing consists of handling requests from the frontend, validating data, and ensuring smooth interactions with external and internal interfaces.

i. API Requests from Client

The backend receives requests primarily via RESTful API endpoints, including:

*   Authentication Requests (OAuth, Supabase Token Verification)
*   Game State Updates (User actions, card plays, boss fights)
*   AI Story Requests (Dynamic narrative updates based on user input)
*   Payment Handling (Stripe integration for purchases)
*   Card Collection Management (Adding/upgrading cards)
*   Image Requests (AI-generated assets for cards and game entities)

Example request: Card usage
```json
{
  "user_id": "abc123",
  "session_id": "session_xyz",
  "card_id": "fire_spell_01",
  "action": "play",
  "target": "enemy_001"
}
```

*   The Game Engine Interface validates the request and applies the effects.
*   The Card Management Interface updates the card’s status.
*   The Database Interface records changes in the player's inventory and logs the action.

ii. Data Validation & Security Checks

Every request undergoes:

*   User Authentication & Authorization via Supabase.
*   Input Sanitization to prevent SQL injections and XSS.
*   Rate Limiting to avoid abuse of endpoints.
*   Game Logic Validation to ensure requests align with defined rules.

Example: Unauthorized Access Rejection

If a user attempts to access a restricted endpoint without a valid session token:
```json
{
  "error": "Unauthorized Access",
  "status_code": 401
}
```

2. Output Processing

Once input is validated and processed, the backend responds with structured data.

i. API Responses to Client

Each API request results in:

*   Game State Updates (current progress, active cards, battle state)
*   Narrative Responses (LLM-generated story events)
*   Payment Confirmations (Stripe verification)
*   Card & Inventory Changes (new items, upgraded abilities)
*   Image URLs (Generated assets for gameplay)

Example Response: Game State Update
```json
{
  "user_input": "Explore the dark cave",
  "current_context": "The player is at the cave entrance with a torch.",
  "game_state": {
    "hp": 78,
    "inventory": ["torch", "dagger"]
  }
}
```

Response from AI Language Model:
```json
{
  "story_update": "You step into the damp cave, the torch flickering against the cavern walls. The sound of dripping water echoes in the darkness."
}
```

3. Error Handling & Logging

All backend interactions include error handling to maintain system stability.

i. Error Categories

*   Client Errors (4xx): Invalid requests, unauthorized access, missing parameters.
*   Server Errors (5xx): Database failures, AI service timeouts, API rate limits.
*   Game Logic Errors: Invalid card plays, rule-breaking actions.

Example: Invalid Card Play Response
```json
{
  "error": "Invalid Move",
  "details": "Card 'fire_spell_01' requires 2 mana, but only 1 mana is available.",
  "status_code": 400
}
```

ii. Logging & Monitoring

*   API Request Logs: Tracks all interactions for debugging.
*   Error Logs: Catches and stores failures for analysis.
*   Performance Metrics: Monitors API response times and external service latency.
