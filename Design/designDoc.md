# System Overview

The system follows a client-server architecture where the client is a web application that communicates with a backend server to handle game state, user accounts, card collections, payments, and story generation. The server-side logic will be responsible for processing game logic, generating dynamic stories using AI language models, and managing data persistence.

---

## Key Components

### **Client (Web Interface)**

- **Frontend (UI)**: Provides users with an interface for interacting with the game, such as creating accounts, initiating game sessions, viewing storylines, and interacting with the game world (e.g., collecting cards, battling bosses).
  
- **Game State Management**: The client stores temporary game states and interactions while interacting with the server to update game progress.

---

### **Backend (Server)**

- **API Layer**: The server exposes RESTful APIs to facilitate communication with the client. It will be responsible for handling requests like card collection updates, story generation, and game state management. Handled with Game Engine Interface.
  
- **Internal Backend Interfaces**: The core of the backend, which handles the AI-generated story, card interactions and generation, and game logic (including user progress and boss battles).

- **Database**: A relational database to persist game data, user accounts, card collections, game progress, and transaction history.

---

### **External Services**

- **Stripe**: For handling payments and purchasing the game.

- **AI Language Model**: An AI-based model that generates stories for the game. This can be an API for a pre-trained model like GPT-4 or a custom language model.

- **AI Image Generation**: An external service to generate card images based on AI models, providing users with unique visual content for the game.

- **OAuth**: For handling authentication and providing extra security for the user. Supabase will be integrated to handle OAuth and authentication.(Handled by Supabase.
  
- **Supabase**: Database used for authentication, storing game state, images, and card data.


---

## Design Rationale

Client-Server separation ensures a clear division of responsibilities, allowing the backend to manage game logic and storage, while the frontend focuses on delivering an interactive experience. REST APIs provide a standard interface for communication, ensuring scalability and ease of integration with external services (like Stripe and the AI models). AI-driven story generation and card image generation provide a unique and dynamic user experience.

---

## Backend Design

---

### Internal Interfaces

#### 1. **User Authentication & Authorization Interface**

- **Purpose**: Validates user authorization using Supabase and OAuth for secure access.
  
- **Actions**:
  - Uses Supabase to validate user has permission to access game data, allowing the Game Engine to retrieve user information.
  
- **Communication with Other Interfaces**:
  - **Internal**:
    - **Database**: Interacts with the user table to store credentials and securely hash passwords (via Supabase).
    - **Game Engine**: Grants access to the user's game state data after successful validation.
    - **Payment**: Confirms user’s purchase status via the Payment Interface.
  - **External**:
    - **OAuth**: Supabase will uses OAuth to exchange the authorization code for an access token. Which will be used for validating whether user has access.
    - **Supabase**: Checks access tokens and allows the backend to retrieve user data.
  
- **Rationale**: The User Authentication & Authorization Interface ensures secure user access and handles user login via OAuth or email/password, depending on user choice. With Supabase managing both OAuth and database storage, there is no need for a separate internal user authentication system, simplifying both the user login and data retrieval process. This interface will be fairly simple and just check that supabase has authenticated a user before granting access to user data.

---

#### 2. **Game Engine (Story Generation & Game Logic) Interface**

- **Purpose**: Powers dynamic story generation, manages game flow, player choices, and game logic.
  
- **Actions**:
  - **Story Generation**: Requests internal AI Language Model to generate story content.
  - **Handle Player Actions**: Processes player choices (e.g., collecting items, battling bosses).
  - **Card & Buff Management**: Manages cards and buffs during in-game interactions.(card Management interface is responsible for updating,creating, and returning card actions. Game engine interface is responsible for applying the effects in game and to the client)
  - **Boss Battle Simulation**: Executes logic for combat and progression.
  
- **Communication with Other Interfaces**:
  - **Internal**:
    - **Card Management**: Gives card details to card management for creating new cards based on player actions. Card managment will send back card details and actions.
    - **Database**: Saves player’s progress and updates inventory during interactions.
    - **AI Image Interface**: Requests images for game content like boss fights.
    - **AI-Language Model Interface**: Generates story updates based on player input.
  
- **Rationale**: This interface serves as the central hub for game progression. It coordinates between multiple systems (card management, database, story generation) to deliver a consistent experience, keeping the flow of the game intact.

---

#### 3. **Card Management Interface**

- **Purpose**: Handles the collection, use, and upgrades of cards within the game.
  
- **Actions**:
  - **Card Generation**: Creates new cards based on in-game events and item descriptions.
  - **Card Usage**: Allows players to use cards for battles or buffs.
  - **Card Collection**: Tracks and updates the player's card inventory.
  - **Card Upgrades**: Manages potential future upgrades of cards.
  
- **Communication with Other Interfaces**:
  - **Internal**:
    - **Game Engine**: Updates card collection and usage during events.
    - **Database**: Stores card inventory and updates each card's use or collection.
    - **AI Image Generation**: Requests images for newly generated cards.
  
- **Rationale**: By separating card management, the game engine remains focused on game flow, while the Card Management Interface takes care of card creation and updates independently. This allows for easy future expansion of card-related features.

---

#### 4. **Database Interface (with Supabase Integration)**

- **Purpose**: Manages all persistent data, such as user accounts, game progress, cards, and transaction records using Supabase.

- **Actions**:
  - **Store User Data**: Saves user credentials (hashed passwords) and other relevant information.
  - **Store Game State**: Tracks player’s game progress, inventory, decisions, and stats.
  - **Transaction Logs**: stores all payment transactions and tracks in-game purchases(if implemented in the future).
  - **Game History**: Saves past game sessions to allow users to resume their gameplay.
  - **Card Collection Management**: Stores and updates the player’s card collection.

- **Communication with Other Interfaces**:
  - **Internal**:
    - **User Authentication Interface**: Stores and retrieves user credentials via Supabase authentication.
    - **Game Engine**: Retrieves and updates user game state and progress.
    - **Card Management**: Stores and updates player’s card inventory.
    - **Payment Interface**: Stores transactions for purchases and in-game items.
  - **External**:
    - **Supabase**: Handles authentication, queries, and storage of user and game-related data.

- **Rationale**: Supabase provides a powerful backend-as-a-service solution with built-in database management, authentication, and real-time capabilities. By using Supabase for data storage, we can focus on building out the game mechanics and user experience. The **Database Interface** will abstract the complexity of interacting with Supabase, allowing for seamless data management.

---

#### 5. **Payment Interface (Stripe Integration)**

- **Purpose**: Facilitates in-game purchases and the initial purchase of the game using Stripe.
  
- **Actions**:
  - **Purchase Game**: Handles payment processing through Stripe API.
  - **Transaction History**: Logs purchases to verify user’s game access.
  
- **Communication with Other Interfaces**:
  - **Internal**:
    - **Database**: Stores transaction records and verifies user access.
    - **User Authentication**: Updates user access after a successful payment.
  
- **External**:
  - **Stripe API**: Processes payments and returns transaction statuses.
  
- **Rationale**: A separate Payment Interface allows for clean management of financial transactions. It ensures the game can be easily updated in the future if more payment options are required. This is more of a could have for us, so it will not be highly prioritized during our implementation. 

---

#### 6. **AI Image Generation Interface**

- **Purpose**: Generates custom images for cards and other in-game visuals.
  
- **Actions**:
  - **Card Image Generation**: Requests images based on card attributes.
  - **Image Storage**: Stores generated images to the database.
  - **Boss Image Generation**: Generates visuals for bosses or enemies.
  - **Validation**: Ensures generated images are valid and usable.
  
- **Communication with Other Interfaces**:
  - **Internal**:
    - **Card Management**: Card managment requests images for newly generated cards and is sent back image or error.
    - **Game Engine**: Game engine requests images for boss encounters.
  - **External**:
    - **Image Generation API**: Generates images based on given descriptions.
  
- **Rationale**: This interface isolates image generation to a single component, allowing easy changes and enhancements in the future. It simplifies image management and keeps the logic for visual elements modular. Having logic for image generation seperate allows other components to use the interface without needing to know how it works.

---

#### 7. **AI-Language Model Interface**

- **Purpose**: Powers the AI-driven storylines for the game.
  
- **Actions**:
  - **Story Generation**: Generates narrative elements based on game state and user input.
  - **Boss Battle Descriptions**: Provides descriptions for bosses and encounters.
  - **Quality Control/Validation**: Ensures generated stories are in the correct format.
  - **Story Summary**: Provides summaries of major story beats.
  
- **Communication with Other Interfaces**:
  - **Internal**:
    - **Game Engine**: Requests story updates based on user choices.
    - **Database**: Stores story progress and player decisions.
  - **External**:
    - **AI-Language Model API**: Communicates with the LLM to generate dynamic narratives.
  
- **Rationale**: The AI-Language Model is key to the game’s dynamic narrative. Separating this functionality allows easy scalability and flexibility, ensuring stories are generated seamlessly.

---

### External Interfaces

---

#### 1. **Stripe Integration**

- **Purpose**: Handles all financial transactions for the game, from initial purchase to in-game purchases.
  
- **Communication**:
  - **Backend → Stripe**: Sends transaction details to Stripe.
  - **Stripe → Backend**: Returns transaction status (success/failure).

- **Rationale**: Payment is handled externally to reduce security concerns within the game’s backend. Stripe allows secure, easy payment processing.

---

#### 2. **AI Language Model (LLM)**

- **Purpose**: Generates dynamic, AI-powered storylines.

- **Communication**:
  - **Internal AI-Language Model Interface → LLM API**: Sends user input to LLM to generate stories.
  - **LLM → Internal AI-Language Model Interface**: Returns generated story content.

- **Rationale**: By using an external LLM, we can scale and improve the narrative quality without maintaining complex AI models in-house.

---

#### 3. **AI Image Generation Service**

- **Purpose**: Provides unique images for cards and in-game visuals like bosses.

- **Communication**:
  - **AI image generation internal interfac → Image Generation API**: Requests for image creation.
  - **Image Generation API → AI image generation internal interface**: Returns generated image data.

- **Rationale**: Isolating image generation to a single interface allows flexibility in switching image providers or refining visuals in the future. Using external service allows us to avoid needing powerful computers to run the models locally.

---

#### 4. **OAuth Authentication Service**

- **Purpose**: Manages user authentication via OAuth providers (e.g., Google, Facebook) for secure login.(note supabase will responsible for using OAuth)

- **Communication**:
  - **Supabase**: Verifies user and provides session tokens.
  
- **Rationale**: OAuth authentication reduces the overhead of managing user passwords. Supabase will simplify OAuth handling and session management.

---

#### 5. **Supabase**

- **Purpose**: Provides backend services for user management, including authentication (via OAuth or email) and game data storage.

- **Communication**:
  - **Backend → Supabase**: Communicates for tasks like sign-up, sign-in, game progress, and transactions.
  - **Supabase → Backend**: Returns user data, game state, and authentication details.

- **Rationale**: Supabase provides a comprehensive, out-of-the-box solution for user management, session handling, and database interactions, allowing us to focus on game development.

---

### Interface Rationale

We divided our project into these interfaces to separate logic and ensure flexibility. This modular approach will make debugging easier and provide a solid foundation for future feature additions. Each interface is designed to handle a specific concern, ensuring that the overall system remains organized and adaptable.

***Interface Interaction Overview***
![alt text](BackendDiagram.png "Interface Main Interaction Overview")





## Database Interface

### Purpose
Manages all **persistent game data**, integrating with [Supabase](https://supabase.com/) for user authentication and storage. This interface ensures consistency and durability for essential information like:

- **User Accounts** 
- **Game State** 
- **Card Collections** 
- **Transaction Records** 
- **Story Progress & History** 

---

### Actions / Responsibilities

1. **Store User Data**  
   - Create new user records
   - Store minimal profile info (username, email, etc.) and passwords securely
   - Maintain ban status if necissary
   - Store purchase status (accounts can be created before purchase)

2. **Store & Retrieve Game State**  
   - **Runs** (playthroughs): Current HP, mana, deck contents, progress through the story, etc.  
   - **Permanent Death**: Mark runs as inactive/completed upon the user’s HP reaching 0 (in line with Roguelike rules).
   - Multiplayer session info (if the user is playing co-op).

3. **Transaction Logs**  
   - Record successful or failed payment attempts from the **Payment Interface** (Stripe).
   - Update user access once purchases are confirmed.

4. **Game History & Analytics**  
   - Optionally store each finished run or partial logs for replay, analytics, or user records.
   - Keep track of user decisions or story branches if you want advanced analytics or a “resume” feature.

5. **Card Collection Management**  
   - Store the user’s current deck: which cards they own, how many duplicates, any upgrades, etc.
   - Store global definitions for each type of card (Attack, Ability, Power) and link them to user decks.
   - Support card generation (as the cards are generated by AI, there shouldn't be a stored number of preset cards as new and unique cards being added will be a constant, although there should be a master table of all cards generated so far)

---

### Communication With Other Components

- **User Authentication Interface**  
  - **Reads/Writes** user data (account creation, password hashes, OAuth tokens).
  - Verifies user has purchased the game before granting broader permissions.

- **Game Engine**  
  - **Retrieves** and **stores** user runs (HP, deck composition, current scenario).
  - Logs and updates combat states or story progress.

- **Card Management**  
  - **Saves** newly generated cards in the user’s deck.
  - **Reads** card definitions from a master list (e.g., from a `cards` table).
  - Updates deck composition upon collecting or removing cards.

- **Payment Interface**  
  - **Writes** transaction records for successful Stripe payments.
  - **Reads** user purchase status to confirm game access.

- **AI-Language Model Interface** (Optional)  
  - Log and retrieve narrative progress for story building.

- **AI Image Generation Interface** (Optional)  
  - Store references to generated images in the database (e.g., linking them to specific cards or enemies).
  - 
<!--NOTE THIS SPECIFICATION MAY CHANGE AS WE MIGHT USE BIT BUCKETS FOR STORAGE-->
---

### Tables & Entities

#### 1. Users Table

- **Fields:**
  - `user_id` (PK)  
  - `email` or `username`  
  - `password_hash`
  - `created_at`, `updated_at`  
  - `purchase_status` 

#### 2. Runs (Playthroughs)

- **Fields:**
  - `run_id` (PK)  
  - `user_id` (FK → `users.user_id`)  
  - `current_hp`, `max_hp`  
  - `mana_capacity`
  - `is_active` (bool) — **false** when the run ends (death)  
  - `started_at`, `ended_at`  
  - `status_effects` (JSON) to track non-combat statuses.  

#### 3. Cards

- **Fields:**
  - `card_id` (PK)  
  - `title`, `type` (Attack, Ability, Power)  
  - `mana_cost`  
  - `description` *(text)*  
  - `keywords` *(JSON or text)* — e.g., `["Damage(6)","Weakened(2)"]`  
  - `image_reference` (for AI-generated images)  
- **Notes:**  
  - This table is the **master list** of all card definitions.  
  - The actual user deck references these by `card_id`.

#### 4. Player_Cards (Decks)

- **Fields:**
  - `deck_entry_id` (PK)  
  - `run_id` (FK → `runs.run_id`)  
  - `card_id` (FK → `cards.card_id`)  
  - `quantity`  
- **Notes:**  
  - Many-to-many relationship: a run can have many cards, and a card can exist in many runs (with different quantities).  
  - This effectively tracks each run’s **deck** composition.

#### 5. Combat / Encounters

- **`combat` Table**  
  - `combat_id` (PK)  
  - `run_id` (FK)  
  - `is_active` (bool)  

- **`combat_participants` Table**  
  - `combat_id` (FK)  
  - `participant_id` (PK)  
  - `entity_type` (“player” or “enemy”)  
  - `entity_id` (points to either `users` or `enemies` if it’s an enemy type)  
  - `current_hp`  
  - `status_effects` (JSON)

- **`combat_actions` Table** (logging each turn)  
  - `action_id` (PK)  
  - `combat_id` (FK)  
  - `participant_id` (FK)  
  - `card_id` (FK or null)  
  - `action_type` (Attack, Defend, etc.)  
  - `details` (JSON: damage done, targets, etc.)  
  - `timestamp`

#### 6. Payments / Transactions

- **Fields:**
  - `transaction_id` (PK)  
  - `user_id` (FK)  
  - `stripe_payment_id` or `transaction_ref`  
  - `amount`  
  - `currency`  
  - `status` (success, failed, etc.)  
  - `created_at`  
- **Notes:**  
  - The **Payment Interface** writes to this table upon receiving success/fail from Stripe.  
  - If `status = 'success'`, you might set the user’s `has_paid` to `true`.

#### 7. Other Potential Tables

- **Enemies**: Depends on how we structure these encounters determines if its worth storing these. 
- **SessionParticipants** (for co-op): Mapping multiple users (and runs) into a single session.
