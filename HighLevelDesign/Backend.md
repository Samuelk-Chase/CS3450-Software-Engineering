


## Architecture
The system will follow a Client-Server Architecture with distinct components: the Client, the Backend Server, and external services for AI generation, card generation (images), and authentication.

* ***Client:*** The user interface that will allow players to interact with the game. Will allow user to interact with a text console and use items in game.
* ***Backend Server:*** The heart of the application, responsible for maintaining game state, user management, card handling, story generation, and business logic.
* ***External Services:***
  * ***AI Story Generator:*** An AI system (such as a fine-tuned LLM) generates the dynamic story.
  * ***Card Image Generator:*** An AI-based image generation API to create unique card images.
  * ***Payment Service Stripe:*** A third-party service for user account management (OAuth, Firebase, etc.).

#### Design Rationale:
This modular setup allows each component to be developed and scaled independently. By using a client-server architecture, we ensure that the backend logic is centralized, which makes it easier to maintain and update the game. External services are isolated so that any changes in their implementation do not affect the core game logic.

# Backend Design for Text-Based Game

## Internal Interfaces for Backend

### 1. **User Authentication & Authorization Interface**
- **Purpose**: Manages user registration, login, and authentication. Ensures that users can securely sign in and access their game data.
- **Actions**:
  - **Sign Up**: User creates an account by providing necessary details (e.g., email, password).
  - **Login**: Authenticates a returning user, generating a JWT (JSON Web Token) for session management.
  - **Password Reset**: Allows users to reset their password if forgotten.
  - **Authorization**: Ensures users can only access their own game data.
- **Communication with Other Interfaces**:
  - **Internal**:
    - **Database**: Interacts with the user table to store credentials and securely hash passwords (e.g., using bcrypt).
    - **Game State Management**: Upon successful login, the user’s game state is retrieved from the database to resume gameplay.
    - **Payment System**: Uses a payment interface to allow the user to buy the game so that paid users are given access to the game.
  - **External**:
    - None.

---

### 2. **Game Engine (Story Generation & Game Logic) Interface**
- **Purpose**: Powers the dynamic AI-driven story generation, manages the game flow, handles player choices, and generates appropriate responses.
- **Actions**:
  - **Story Generation**: Interacts with the AI model (e.g., GPT-4 or a custom LLM) to generate text-based story content based on the theme chosen by the player.
  - **Handle Player Actions**: Processes actions taken by the user (e.g., collecting items, battling bosses).
  - **Card and Buff Management**: Manages the card collection and ensures buffs and abilities apply correctly during combat or other in-game actions.
  - **Boss Battle Simulation**: Executes the logic for combat between players and bosses, updating health, energy, and game progress.
- **Communication with Other Interfaces**:
  - **Internal**:
    - **Card Management**: Asks Card Management to update, create, or apply cards in the player's inventory during the course of the game.
    - **Database**: Uses database to store the game state, player inventory, and progress, ensuring it’s updated after each action.
  - **External**:
    - **AI Language Model (LLM)**: Interacts with the external AI model (e.g., OpenAI’s GPT-4 or a custom LLM) to generate the story dynamically based on the current game state and player input. The backend sends requests to the API with the current game context, and the AI returns a new segment of the story.

---

### 3. **Card Management Interface**
- **Purpose**: Handles the collection, use, and upgrades of cards within the game. Each card has its attributes (e.g., attack, buff, cost, strength).
- **Actions**:
  - **Card Generation**: Creates cards when they are acquired by the player, potentially using an AI image generation service for visual representation.
  - **Card Usage**: Allows players to use cards during combat or to buff themselves. Handles energy costs and buffs/debuffs applied.
  - **Card Collection**: Tracks which cards the user has and allows them to use them throughout the game.
  - **Card Upgrades**: Facilitates upgrading or enhancing cards.
- **Communication with Other Components**:
  - **Internal**:
    - **Game Engine**: Updates card usage during events like battles, triggering specific buffs or attack damage. When the user picks up an item Game engine will ask the Card engine to create a new card. The card engine is responsible for creating cards and their attributes and returns cards and their actions to the game engine for use.
    - **Database**: Saves card data in the user’s inventory and updates the database on each card use or collection.
  - **External**:
    - **AI Image Generation**: Requests images for newly generated cards. The backend sends data to the external AI image generation service (e.g., DALL·E or other image generation models) to generate a visual representation of each card. The AI then returns an image URL which is stored in the database.

---

### 4. **Database Interface**
- **Purpose**: Manages all persistent data within the system. It stores information related to user accounts, game progress, cards, transactions, and more.
- **Actions**:
  - **Store User Data**: Store user details such as usernames, passwords (hashed), email, etc.
  - **Store Game State**: Keeps track of player progress, inventory, story state, and choices.
  - **Transaction Logs**: Logs payment transactions and ensures users’ purchases are recorded.
  - **Game History**: Maintains historical data for user games, which can be useful for analytics or resuming games.
- **Communication with Other Components**:
  - **Internal**:
    - **User Authentication**: Reads and writes user details like credentials.
    - **Game Engine**: Retrieves and stores the user’s game state (e.g., current story progress, active cards).
    - **Card Management**: Stores and retrieves the player’s collection of cards and their associated attributes.
    - **Payment System**: Stores transaction history related to Stripe payments.
  - **External**:
    - None.

---

### 5. **Payment Interface (Stripe Integration)**
- **Purpose**: Facilitates in-game purchases and the initial purchase of the game via Stripe. Ensures secure transactions and proper game access post-purchase.
- **Actions**:
  - **Purchase Game**: Handles the one-time purchase of the game using Stripe’s API.
  - **Transaction History**: Logs successful transactions and ensures users’ access is validated.
- **Communication with Other Components**:
  - **Internal**:
    - **Database**: Stores transaction records, which are essential for validating user purchases and maintaining access.
    - **User Authentication**: Once a payment is successful, update the user’s account to grant game access.
  - **External**:
    - **Stripe API**: The backend makes requests to the Stripe API to process payments. It sends details like purchase amounts, user details, and transaction types (e.g., one-time, subscription), and Stripe returns the transaction status (e.g., success, failure). The backend updates the user’s game access based on Stripe’s response.
   
      Rationale for internal Payment interface: We want an interface that is solely devoted to payments. We could have user auth handle payments, but in the future, if new paid game content is added, we want an interface that we can update. Its implementation now may not be strictly necessary but will allow for the game to add new paid features in the future.

---

### 6. **AI Image Generation Interface**
- **Purpose**: Generates custom images for cards that represent items, characters, or actions within the game. Ensures harmful content is not generated. Uses external image generation interface for image generation.
- **Actions**:
  - **Card Image Generation**: Receives requests from the Card Management component with card attributes and returns a generated image.
  - **Image Storage**: Saves generated images to cloud storage (e.g., AWS S3, Google Cloud Storage) and returns a URL to be used in the game.
- **Communication with Other Components**:
  - **Internal**:
    - **Card Management**: Requests image generation for newly created cards or when upgrading cards. Passes the necessary card data (e.g., type, strength, effects) to the service.
    - **Game Engine**: Ensures that the correct image is displayed during gameplay when a player interacts with a card.
  - **External**:
    - **Image Generation API**: Interacts with an external image generation service (e.g., DALL·E, MidJourney, or a custom model) to create images. The backend sends requests with the image description and attributes, and the service returns a URL to the generated image.

---

### 7. **AI Language Model Interface**
- **Purpose**: Generates the dynamic storylines based on user input and predefined game themes using an external LLM interface. Responsible for generation and ensure harmful content is not being generated.
- **Actions**:
  - **Story Generation**: Generates narrative elements in real-time based on user decisions, AI model inputs, and the theme of the game.
  - **Boss Battle Descriptions**: Provides descriptive content for boss battles, adding depth and excitement to the interactions.
  - **Quality Control**: Ensures harmful content is not used in text generation.
  - **Story Summary**: Summarizes important story beats during the user's journey. Used for reducing storage requirements, and providing a way to inform a user of past events after returning to the game.
- **Communication with Other Components**:
  - **Internal**:
    - **Game Engine**: Receives prompts for story generation (e.g., user choices, current game state) from the game engine and sends generated text for the user to interact with. The story’s progression is based on player decisions. 
    - **Database**: May store narrative branches and decisions for future gameplay sessions, ensuring continuity in the story.
  - **External**:
    - **AI Language Model API**: Interacts with an external AI language model (e.g., OpenAI’s GPT-4 or a custom model). The backend sends requests containing the current game context, player actions, and predefined themes, and the model returns a story update that is displayed to the player.

---

## External Interface Breakdown:

### 1. **Stripe Integration**
- **Purpose**: Handles all financial transactions for the game, from the initial purchase to in-game purchases.
- **Communication**:
  - **Backend → Stripe**: API calls for initiating and processing payments, including purchases for the game and microtransactions.
  - **Stripe → Backend**: Stripe returns payment confirmation, success/failure responses, and transaction data.
  
### 2. **AI Language Model (LLM)**
- **Purpose**: Powers dynamic, AI-generated storytelling for the game.
- **Communication**:
  - **Backend → LLM API**: Sends context and player input to the LLM to receive a dynamically generated story.
  - **LLM → Backend**: Returns AI-generated story content to be presented to the player.

### 3. **AI Image Generation Service**
- **Purpose**: Provides unique images for cards and other in-game visuals.
- **Communication**:
  - **Backend → Image Generation API**: Sends requests to generate images based on the attributes of newly created cards.
  - **Image Generation API → Backend**: Returns the generated image as a 


