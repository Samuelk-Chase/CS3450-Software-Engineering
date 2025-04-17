# High Level Design Document

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Backend Design](#backend-design)
3. [Frontend Design](#frontend-design)
4. [Database Design](#database-design)
5. [Security Design](#security-design)

## Architecture Overview

**System Overview:** The system follows a client-server architecture where the client is a web application that communicates with a backend server to handle game state, user accounts, card collections, payments, and story generation. The server-side logic will be responsible for processing game logic, generating dynamic stories using AI language models, and managing data persistence.

**Key Components:**

- **Client (Web Interface):**
   - **Frontend (UI):** Provides users with an interface for interacting with the game, such as creating accounts, initiating game sessions, viewing storylines, and interacting with the game world (e.g., collecting cards, battling bosses).
   - **Game State Management:** The client stores temporary game states and interactions while interacting with the server to update game progress.

- **Backend (Server):**
   - **API Layer:** The server exposes RESTful APIs to facilitate communication with the client. It will be responsible for handling requests like card collection updates, story generation, and game state management.
   - **Internal Backend interfaces:** The core of the backend, which handles the AI-generated story, card interactions and generation, and game logic (including user progress and boss battles).
   - **Database:** A relational database to persist game data, user accounts, card collections, game progress, and transaction history.

- **External Services:**
  - **Stripe:** For handling payments and purchasing the game.
  - **AI Language Model:** An AI-based model that generates stories for the game. This can be an API for a pre-trained model like GPT-4 or a custom language model.
  - **AI Image Generation:** An external service to generate card images based on AI models, providing users with unique visual content for the game.
  - **OAuth**: For handling authentication and to provide extra security for the user.

## Backend Design

### Internal Interfaces

#### 1. User Authentication & Authorization Interface
- **Purpose:** Validates if the client has authorization using Supabase and OAuth.
- **Actions:**
   - **Authorization:** After successful authentication, retrieves an access token and refresh token to grant access to game data.
   - **Session Management:** Manages user sessions, ensuring valid tokens are used and renews them when necessary.
- **Communication with Other Interfaces:**
   - **Internal:**
      - **Database**: Interacts with the user table for storing user credentials
      - **Game State Engine:** Grants permission to the game engine to retrieve the user's game state
      - **Payment Interface:** Confirms if the user has made a payment for the game
   - **External:**
      - **OAuth Providers (Google/Facebook):** Handles the initial authentication
      - **Supabase:** Verifies the access token and retrieves user data

#### 2. Game Engine (Story Generation & Game Logic) Interface
- **Purpose:** Powers the dynamic AI-driven story generation, manages the game flow, handles player choices, and generates appropriate responses.
- **Actions:**
   - **Story Generation:** Requests internal AI Language model interface generate text-based story content
   - **Handle Player Actions:** Processes actions taken by the user
   - **Card and Buff Management:** Manages the card collection and ensures buffs and abilities apply correctly
   - **Boss Battle Simulation:** Executes the logic for combat between players and bosses

#### 3. Card Management Interface
- **Purpose:** Handles the collection, use, and upgrades of cards within the game.
- **Actions:**
   - **Card Generation:** Creates cards when they are acquired by the player
   - **Card Usage:** Allows players to use cards during combat
   - **Card Collection:** Tracks which cards the user has
   - **Card Upgrades:** Facilitates upgrading or enhancing cards

#### 4. Database Interface
- **Purpose:** Manages all persistent data within the system.
- **Actions:**
   - **Store User Data:** Store user details such as usernames, passwords, email, etc.
   - **Store Game State:** Keeps track of player progress, inventory, story state
   - **Transaction Logs:** Logs payment transactions
   - **Game History:** Maintains historical data for user games

#### 5. Payment Interface (Stripe Integration)
- **Purpose:** Facilitates in-game purchases and the initial purchase of the game via Stripe.
- **Actions:**
   - **Purchase Game:** Handles the one-time purchase of the game
   - **Transaction History:** Logs successful transactions

#### 6. AI Image Generation Interface
- **Purpose:** Generates custom images for cards and game elements.
- **Actions:**
   - **Card Image Generation:** Receives requests for card images
   - **Image Storage:** Saves generated images to the Database
   - **Boss image Generation:** Generates images of bosses/enemies
   - **Validation:** Ensures data sent back is valid format

#### 7. AI-Language Model Interface
- **Purpose:** Generates the dynamic storylines based on user input.
- **Actions:**
   - **Story Generation:** Generates narrative elements in real-time
   - **Boss Battle Descriptions:** Provides descriptive content for boss battles
   - **Quality Control/validation:** Ensures AI output is correct format
   - **Story Summary:** Summarizes important story beats

### External Interfaces

1. **Stripe Integration**
   - Handles all financial transactions
   - Processes payments and maintains transaction records

2. **AI Language Model (LLM)**
   - Powers dynamic, AI-generated storytelling
   - Generates narrative content and game responses

3. **AI Image Generation Service**
   - Provides unique images for cards and game elements
   - Generates visual content based on game context

4. **OAuth Authentication Service**
   - Handles user authentication via OAuth providers
   - Manages secure user sessions

5. **Supabase**
   - Provides backend services including authentication
   - Manages database operations and real-time updates

## Frontend Design

### Hardware Platform
- **Primary Platform:** Web Application
- **Target Devices:** Desktop and Tablet browsers
- **Technology Stack:** React 18+, TypeScript, SASS
- **Supported Browsers:** Chrome 90+, Firefox 90+, Safari 14+, Edge 90+

### User Interface Design

#### Branding & Theme
- **Color Scheme:**
  - Primary: `#2D3748` (Dark Blue-Gray)
  - Secondary: `#805AD5` (Purple)
  - Accent: `#F6E05E` (Yellow)
  - Background: `#1A202C` (Dark)
  - Text: `#F7FAFC` (Light)

#### Typography
- **Headings:** Inter
- **Body:** Roboto Mono

### Component Architecture

#### Core Components
- **Game State Management**
  - ThemeContext
  - DeckContext
  - PlayerContext

#### Internal Interfaces
- **GameProvider:** Manages overall game state
- **Card:** Handles card functionality
- **BattleManager:** Manages combat mechanics

### Implementation Strategy
1. **Phase 1: Core Game Loop**
   - Basic UI components
   - Card management system
   - Battle mechanics
   - Theme switching

2. **Phase 2: AI Integration**
   - Text command processing
   - Dynamic content generation
   - Adaptive difficulty

3. **Phase 3: Polish & Optimization**
   - Animation system
   - Performance optimization
   - Responsive design
   - Accessibility features

## Database Design

### Purpose
Manages all persistent game data, integrating with Supabase for user authentication and storage.

### Tables & Entities

1. **Users Table**
   - user_id (PK)
   - email/username
   - created_at, updated_at
   - purchase_status

2. **Runs (Playthroughs)**
   - run_id (PK)
   - user_id (FK)
   - current_hp, max_hp
   - mana_capacity
   - is_active
   - started_at, ended_at
   - status_effects

3. **Cards**
   - card_id (PK)
   - title, type
   - mana_cost
   - description
   - keywords
   - image_url

4. **Player_Cards (Decks)**
   - deck_entry_id (PK)
   - run_id (FK)
   - card_id (FK)
   - user_id (FK)
   - quantity

5. **Combat/Encounters**
   - combat_id (PK)
   - run_id (FK)
   - is_active
   - combat_participants
   - combat_actions
   - enemies
   - enemy_attacks

6. **Payments/Transactions**
   - transaction_id (PK)
   - user_id (FK)
   - stripe_payment_id
   - amount
   - status
   - created_at

## Security Design

### Authentication and Authorization
- **OAuth Implementation:** Third-party authentication providers
- **Token-Based Authentication:** Short-lived access tokens with refresh tokens
- **Two-Factor Authentication (2FA):** Optional security feature

### Data Protection & Privacy
- **Encryption of Sensitive Data:** PII and game data encryption
- **Anonymized Analytics:** GDPR and CCPA compliance
- **Secure Communication:** TLS 1.3 encryption

### Payment Security
- **Stripe Integration:** Secure payment processing
- **Tokenization:** No direct handling of credit card details
- **Fraud Detection:** Real-time monitoring

### Attack Prevention
1. **DDoS Protection**
   - Rate Limiting & Throttling
   - Traffic Monitoring & IP Filtering
   - CDN & Load Balancing

2. **SQL Injection & Input Validation**
   - Parameterized Queries & ORM
   - Strict Input Validation

3. **XSS and CSRF Protection**
   - Content Security Policy (CSP)
   - CSRF Tokens

4. **Account Security**
   - Account Lockouts & CAPTCHA
   - IP Monitoring

5. **Prompt Injection Protection**
   - Input Sanitization
   - Context Isolation
   - Output Validation

### Multiplayer Security
- **Server-Side Game Logic Validation**
- **Cheat Detection Algorithms**
- **Secure WebSocket Connections**

### Disaster Recovery
- **Automated Backups**
- **Incident Detection & Alerts**
- **Post-Incident Audits**

## Implementation Status Update


### Completed Tasks

- **Account Creation & Authentication**  
  - Email/password sign‑up and login via JWT (backend Go + React frontend)  
  - OAuth login
- **Character Selection & Creation**  
  - Character listing, expansion, and “Play” flow implemented in React (Character Selection screen)  
  - Character Creation form with mode, name, description, and world choices functional  
- **Deck Generation & Management**  
  - “Generate Deck” and “View Deck” buttons in Main Game View generating cards via `/card` endpoint  
  - CardComponent, DeckOverlayPage, and InventoryPage fully implemented  
- **Story & Battle Integration**  
  - RESTful `/story` AI story generation endpoint hooked to StoryDisplay and text‑entry UI  
  - `/boss` endpoint and BossBattlePage turn‑based combat working, including generated boss images  
- **Core API Endpoints**  
  - Go backend endpoints: `/story`, `/boss`, `/card`, `/character`, progress–save endpoint  
- **Basic Security & Data Protection**  
  - JWT issuance and middleware validation in place  
  - Input validation, parameterized queries, XSS mitigation implemented  
- **Persistent Storage**  
  - Supabase tables for users, runs, cards, deck entries, and combat logs  

### Implementation Changed
- **Player Context**
  - The way we handle player and theme context is primarly stored in the backend and accessed through API calls, instead of context interfaces on the frontend
- **Difficulty**
  - We have 2 modes in our game, hard beans and soft beans. Users select one and the battle mechanics change based on user selection.
    
### Not Yet Implemented

- **Card Upgrades**
  - No card upgrade functionality exists curretnly 
- **Payment & Monetization**  
  - Stripe integration for one‑time purchase and in‑game transactions deferred, and database transaction logs have not been implemented
- **Advanced Security**  
  - Full OAuth support (refresh/rotation), 2FA (TOTP), secure vault (KMS) integration  
  - Comprehensive DDoS protection, CSRF tokens, advanced rate‑limiting, prompt‑injection guards  
- **Multiplayer & Anti‑Cheat**  
  - Websockets have not been implemented, and no anti-cheat measures have been written
- **Disaster Recovery**  
  - Automated backups, incident‑alerting pipelines need to be implemented
- **Theme Switching**
  - Our game has one universal theme, with no color scheme/image selection implemented
- **Adaptive Difficulty**
  - We only have 2 modes, hard and soft.
