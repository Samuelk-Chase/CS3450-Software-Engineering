AI Note: This document was generated with the help of Chat GPT.


## Architecture
**System Overview:** The system follows a client-server architecture where the client is a web application that communicates with a backend server to handle game state, user accounts, card collections, payments, and story generation. The server-side logic will be responsible for processing game logic, generating dynamic stories using AI language models, and managing data persistence.

**Key Components:**

- **Client (Web Interface):**

   - **Frontend (UI):** Provides users with an interface for interacting with the game, such as creating accounts, initiating game sessions, viewing storylines, and interacting with the game world (e.g., collecting cards, battling bosses).
   - **Game State Management:** The client stores temporary game states and interactions while interacting with the server to update game progress.

- **Backend (Server):**

   - **API Layer:** The server exposes RESTful APIs to facilitate communication with the client. It will be responsible for handling requests like user authentication, card collection updates, story generation, and game state management.
   - **Internal Backend interfaces:** The core of the backend, which handles the AI-generated story, card interactions and generation, and game logic (including user progress and boss battles).
   - **Database:** A relational database to persist game data, user accounts, card collections, game progress, and transaction history.
- **External Services:**

  - **Stripe:** For handling payments and purchasing the game.
  - **AI Language Model:** An AI-based model that generates stories for the game. This can be an API for a pre-trained model like GPT-4 or a custom language model.
  - **AI Image Generation:** An external service to generate card images based on AI models, providing users with unique visual content for the game.
  - **OAuth**: For handling authentication and to provide extra security for the user.

**Design Rationale:**
Client-Server separation ensures clear division of responsibilities, allowing the backend to manage game logic and storage, while the frontend focuses on delivering an interactive experience.
REST APIs provide a standard interface for communication, ensuring scalability and ease of integration with external services (like Stripe and the AI models).
AI-driven story generation and card image generation provide a unique and dynamic user experience.

# Backend Design for Text-Based Game

## Internal Interfaces

### 1. **User Authentication & Authorization Interface**
- **Purpose**: Manages user registration, login, and authentication. Ensures that users can securely sign in and access their game data. See security section for more details on how we will protect data.
- **Actions**:
  - **Sign Up**: User creates an account by providing the necessary details (e.g., email, password).
  - **Login**: Authenticates a returning user, generating a JWT (JSON Web Token) for session management.
  - **Password Reset**: Allows users to reset their password if forgotten.
  - **Authorization**: Ensures users can only access their own game data.
- **Communication with Other Interfaces**:
  - **Internal**:
    - **Database**: Interacts with the user table to store credentials and securely hash passwords (e.g., using bcrypt).
    - **Game State Management**: Upon successful login, the user’s game state is retrieved from the database to resume gameplay.
    - **Payment System**: Uses a payment interface to allow the user to buy the game so that paid users are given access to the game.
  - **External**:
    - OAuth: If OAuth is used will exchange the authorization code for an access token and possibly a refresh token.
   
- **Rationale:** The User Authentication & Authorization Interface is essential for securing user accounts and ensuring that players can safely access their game data. It manages secure sign-ins, session handling via JWTs, and ensures that users only have access to their own information. By integrating with internal systems and supporting external OAuth, it provides both a seamless and secure authentication process, which is critical for maintaining player privacy, data integrity, and a personalized gaming experience. It allows the interface to be used by other interfaces in the future if needed.

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
    -  **AI Image Interface**: Asks AI image interface for images related to the game such as an image of a boss to battle.
    -  **AI-Language Model Interface**: Interacts with the AI-Language Model Interface (e.g., OpenAI’s GPT-4 or a custom LLM) to generate the story dynamically based on the current game state and player input. The Game engine sends requests to the interface with the current game context, and the interface returns a new segment of the story.
  - **External**:
    - none
   
- **Rationale:** We want some central interface that controls the game and interacts with other interfaces to update the game. This will serve as a constant entry point between the client and the server and managing the game state.

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
   
- **Rationale:** Cards are going to be a big feature of the game so we want to separate the card implementation from other components like the game engine. This will allow us to add new card features in the future without having to change many details in other interfaces.

---

### 4. **Database Interface**
- **Purpose**: Manages all persistent data within the system. It stores information related to user accounts, game progress, cards, transactions, and more. See Data Base Design for more details about the Database.
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
   
- **Rationale**: See Database design

---

### 5. **Payment Interface (Stripe Integration)**
- **Purpose**: Facilitates in-game purchases and the initial purchase of the game via Stripe. Ensures secure transactions and proper game access post-purchase.
- **Actions**:
  - **Purchase Game**: Handles the one-time purchase of the game using Stripe’s API.
  - **Transaction History**: Logs successful transactions and ensures users’ access is validated.
- **Communication with Other Components**:
  - **Internal**:
    - **Database**: Stores transaction records, which are essential for validating user purchases and maintaining access.
    - **User Authentication**: Once payment is successful, update the user’s account to grant game access.
  - **External**:
    - **Stripe API**: Makes requests to the Stripe API to process payments. It sends details like purchase amounts, user details, and transaction types (e.g., one-time, subscription), and Stripe returns the transaction status (e.g., success, failure). The backend updates the user’s game access based on Stripe’s response.
   
  - **Rationale**: We want an interface that is solely devoted to payments. We could have user auth handle payments, but in the future, if new paid game content is added, we want an interface that we can update and possibly have more payment options. Its implementation will not be prioritized during development since the focus will be on user experience.


    

---

### 6. **AI Image Generation Interface**
- **Purpose**: Generates custom images for cards that represent items, characters, or actions within the game.  Uses external AI image generation interface for actual image generation.
- **Actions**:
  - **Card Image Generation**: Receives requests from the Card Management component with card attributes and returns a generated image.
  - **Image Storage**: Saves generated images to the Database.
  - **Boss image Generation:** Generates images of a boss based on llm output.
- **Communication with Other Components**:
  - **Internal**:
    - **Card Management**: Requests image generation for newly created cards or when upgrading cards. Passes the necessary card data (e.g., type, effects, item description) to the service.
    - **Game Engine**: Request a new image of a Boss based on LLM output. 
  - **External**:
    - **Image Generation API**: Interacts with an external image generation service (e.g., DALL·E, MidJourney, or a custom model) to create images. Sends requests with the image description and attributes, and the service returns an image to the interface.

- **Rationale:** Since we will be generating images throughout we want a component that is solely devoted to image generation, which will make it easier to upgrade or change in the future. It will also allow other interfaces added in the future a way to generate images. 
---

### 7. **AI-Language Model Interface**
- **Purpose**: Generates the dynamic storylines based on user input and predefined game themes using an external LLM interface. 
- **Actions**:
  - **Story Generation**: Generates narrative elements in real-time based on user decisions, AI model inputs, and the theme of the game.
  - **Boss Battle Descriptions**: Provides descriptive content for boss battles, adding depth and excitement to the interactions.
  - **Quality Control**: Ensures harmful content is not used in text generation.
  - **Story Summary**: Summarizes important story beats during the user's journey. Used for reducing storage requirements, and providing a way to inform a user of past events after returning to the game.
- **Communication with Other Components**:
  - **Internal**:
    - **Game Engine**: Receives prompts for story generation (e.g., user choices, current game state) from the game engine and sends a generated text for the user to interact with. The story’s progression is based on player decisions. 
    - **Database**: May store narrative branches and decisions for future gameplay sessions, ensuring continuity in the story.
  - **External**:
    - **AI-Language Model API**: Interacts with an external AI language model (e.g., OpenAI’s GPT-4 or a custom model). The backend sends requests containing the current game context, player actions, and predefined themes, and the model returns a story update that is displayed to the player.

- **Rationale:** Since LLM generation is so important to the game we want to separate the functionality from the rest of our interfaces. This will allow us to extend the interface to other interfaces in the future if needed.
---

## External Interfaces:

### 1. **Stripe Integration**
- **Purpose**: Handles all financial transactions for the game, from the initial purchase to in-game purchases.
- **Communication**:
  - **Backend → Stripe**: API calls for initiating and processing payments for purchasing for the game.
  - **Stripe → Backend**: Stripe returns payment confirmation, success/failure responses, and transaction data.
 
- **Rationale**: Stripe won't be prioritized but if production is ahead of schedule, we will implement a way to pay for the game using Stripe, since some in our group are at least somewhat familiar with it.
  
  
### 2. **AI Language Model (LLM)**
- **Purpose**: Powers dynamic, AI-generated storytelling for the game.
- **Communication**:
  - **Backend → LLM API**: Sends context and player input to the LLM to receive a dynamically generated story.
  - **LLM → Backend**: Returns AI-generated story content to be presented to the player.

- **Rationale**:

### 3. **AI Image Generation Service**
- **Purpose**: Provides unique images for cards and other in-game visuals.
- **Communication**:
  - **Backend → Image Generation API**: Sends requests to generate images based on the attributes of newly created cards.
  - **Image Generation API → Backend**: Returns the generated image as a URL for storage.

- **Rationale**:

### 4. OAuth Authentication Service
 - **Purpose:** Authenticates users securely via OAuth and provides backend authorization to access user-specific game data and actions. It acts as a bridge between the backend system and external OAuth providers (e.g., Google, Facebook, etc.). This will not be a required way to sign in, but users will have the option besides giving an email and password.

- **Communication:**

  - **UserAuth interface → OAuth Provider (e.g., Google, Facebook):** The backend exchanges the authorization code for an access token and possibly a refresh token.
  - **OAuth Provider → Backend**: Returns an access token (and refresh token, if applicable), which grants the backend access to the user's profile information and other authorized resources.

- **Rationale:**
OAuth integration allows the backend to authenticate users without managing passwords directly, improving security and simplifying the login process. This ensures that only valid, authorized users can access protected resources and game data via the backend. Also provides a user a more convenient way to log in.

 # Note: Need to figure out how we are getting images and llm details. URL is just a place holder. 


