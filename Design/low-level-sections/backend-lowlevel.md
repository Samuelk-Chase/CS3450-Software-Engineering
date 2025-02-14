Note: Chat GPT was used to help generate sections of this


# **Game Development Backlog**

## **Sprint 2: Core Systems & AI Experimentation (Backend + Initial Frontend)**

### **Backend Team**
#### **Database Setup:**
- [ ] **Set up User table:** Store authentication data, user profile details, and metadata for player progress.
- [ ] **Set up Run table:** Store each game session's progress, including choices made and card usage.
- [ ] **Set up Card tables:** Define schema for different card types, attributes, rarity levels, and effects.

#### **Backend-Server Development:**
- [ ] **Implement Authentication System:** OAuth integration (Google, email/password) using Supabase or Firebase.
- [ ] **Create foundational Game Engine & API Endpoints:**
  - Define routes for game state updates.
  - Implement functions for tracking player progress, stats, and story.
  - Handle card interactions in API responses.
- [ ] **Create Card Management System:**
  - CRUD operations for creating, storing, and retrieving cards.
  - Define internal rules for buffs, debuffs, and status effects.
- [ ] **Set up AI LLM Interface (Initial Mock Responses):**
  - Basic connection to an AI API (e.g., OpenAI, Mistral, Claude).
  - Interface should generate mock responses that simulate in-game interactions.
- [ ] **AI Model Testing & Prompt Engineering:**
  - Experiment with multiple LLMs (GPT-4, Claude, Mistral, etc.) to assess response quality.
  - Start designing/experimenting with structured prompts that align with narrative-driven gameplay.
  - Test AI’s ability to generate **meaningful** stories and responses.

### **Front-End Team**
#### **UI Development for Core Player Navigation**
- [ ] **Create Sign-in / Sign-up Pages:**
  - Basic UI with authentication integration.
  - Error handling for login failures.
- [ ] **Create Main Character Screen:**
  - Displays user stats, character progress, new character button.
- [ ] **Create Character Selection Screen:**
  - Allows players to choose between different starting characters with unique attributes.
- [ ] **Develop AI Text Input Page:**
  - Simple interface for text-based interactions.
  - Mock responses should be rendered dynamically.


    #### **Expectations:**
    **By the end of this sprint:**
      - Users should be able to sign in
      - Users should be authenticated on backend and frontend with supabase/oauth
      - Users should be able to create or select a new character
      - Characters should be stored in database and accessed through backend
      - Players should be able to type response and receive a response(even if just a mock response at first)
      - Back should be able to create mock up cards and store in database      

---

## **Sprint 3: AI Integration & Combat System Development**

### **Backend Team**
#### **Database Enhancements:**
- [ ] **Expand Card Table:**
  - Store additional attributes (mana cost, rarity, effect types).
  - Implement support for deck-building mechanics.

#### **Backend Development:**
- [ ] **Integrate AI into LLM Interface:**
  - Replace mock responses with real AI-generated interactions.
  - Implement token limits, input sanitization, and response formatting.
- [ ] **Implement AI Image Interface (AI-Generated Cards & Assets):**
  - Connect to an AI image generation API (e.g., DALL·E, Stability AI).
  - Generate visuals dynamically for new cards or unique bosses.
- [ ] **Enhance Game Engine with Boss Creation System:**
  - AI-driven bosses with unique abilities and patterns.
  - Implement scaling difficulty for encounters(make bosses have equal level/card power to character).

### **Front-End Team**
#### **Combat & Deck Mechanics UI**
- [ ] **Develop Battle Screen:**
  - Display turn-based battle interface.
  - Show enemy boss, player stats, and cards in hand.
- [ ] **Create Card Deck Component:**
  - UI for selecting and playing cards.
  - Implement drag-and-drop interactions.
- [ ] **Implement Internal Battle Logic for Boss Battles:**
  - Ensure AI-generated bosses have attack patterns.
  - Sync game state with backend API.

  #### **Expectations:**
    **By the end of this sprint:**
      - Users should be recieve AI generated story responses
      - Backend should generate,store, and send ai story responses to client
      - Backend should be able to receive card description and generate image and card stats which should be stored in db
      - Backend should be able to create Boss description, and image and send to client
      - Players should be able to initiate battle, see boss with its stats and image
      - Players should be able to play cards by dragging and dropping, cards should apply effects to user or boss
        


  

---

## **Sprint 4: Monetization, Rewards, and Final Polish**

### **Backend Team**
#### **Database Enhancements:**
- [ ] **Create Payment Transaction Table:**
  - Store user purchases.

#### **Backend Development:**
- [ ] **Generate Card Descriptions Dynamically via AI LLM Interface:**
  - Convert item descriptions into unique, AI-generated card text.
  - Improve AI’s ability to balance game mechanics when generating card effects.
- [ ] **Implement Payment Interface:**
  - Integrate Stripe or another payment processor.
  - Enable purchasing the game.

### **Front-End Team**
#### **Finalizing UI & Visual Enhancements**
- [ ] **Create Reward Screen:**
  - Displays unlocked cards, ai battle summary, and earned items after battles.
- [ ] **Final UI Styling & UX Polish:**
  - Improve animations and transitions.
  - Ensure smooth navigation between screens.
  - Add accessibility features like screen reader support
     
    #### **Expectations:**
    **By the end of this sprint:**
     
      - Players should see a battle summary with ai generated text after defeating boss
      - Backend should generate unique item descriptions based on boss the user beat
      - Players should be able select which item after a boss fight to keep and turn into card
      - Animations should be smooth.
      - Users should see unique visual effects applied during battle
      - Users should be able to buy the game before being granted access
      

---

## 🚀 **Next Steps After Sprint 3:**
Once Sprint 3 is completed, the game should be **fully playable** with AI-driven battles, deck-building, and monetization features. Given extra time, the next phase could focus on:

✅ **Bug Fixing & Optimization**  
✅ **Multiplayer Features** (Co-op battles, pvp)   

---
# idea for low-level classes on front end if the front end team wants to use
# Low-Level Design Front End
-----
Game management:

- **Class: EntityClass()** provides structure for player characters and boss entities
  - Attributes
    - **name:** str
    - **health_total:** int
    - **mana_total:** int
    - **current_health:** int
    - **current_mana:** int
    - **alive:** bool
   
   - Methods:
    - `upgrade_mana(increase_amount: int):`
      *Increases mana_total*
      
    - `upgrade_health(increase_amount: int):`
      *Increases health_total*

    - `restore_health()`
      *Sets current_health to health_total*

    - `restore_mana()`
      *Sets current_mana to mana_total*

    - `add_health(health_added: int)`
      *adds hearts/health to character*

    - `add_mana(mana_added: int)`
      *adds hearts/health to character*


  - **Class: Character()** inherits entity class

    
    - Methods:
      - `upgrade_mana(increase_amount: int):`
        *Increases mana_total*
        
      - `upgrade_health(increase_amount: int):`
        *Increases health_total*
  
      - `restore_health()`
        *Sets current_health to health_total*
  
      - `restore_mana()`
        *Sets current_mana to mana_total*
  
      - `add_health(health_added: int)`
        *adds hearts/health to character*
  
      - `add_mana(mana_added: int)`
        *adds hearts/health to character*

  - **Class: Boss_Entity()** Inherits properties of entity class
    - **damage_amount**: int
    - **description**: string
    - **image_url**: string
  


## Card class:
  Attributes:
  - **name**: str
  - **image_url**: str
  - **power_level**: int
  - **mana_cost**: int
  - **Available**: bool
    
   Methods:

   -`set_available(bool)`**
     * sets available to false so it can't be used*

  - `use_card()`
    *Overloaded function that will apply an effect depending on the card*
     
  ## Class DamageCard:
      - **damage_type:** str

      Methods: 
      - `use_card()`
        *Returns damage effect and the power of the effect, json format that will be applied during battle, by battle logic*
        

  ## Class BuffCard:
      - **buff_type**:
      
      Methods:

      - `use_card()`
      *Returns buff effect and the power of the effect, json format that will be applied during battle*

  ## Class EnemyDebuff:
   - **debuff_type**:
      
      Methods:

      - `use_card()`
      *Returns debuff effect and the power of the effect, json format that will be applied to enemy during battle*

      
    
-----

- **Class: Character()**
  - Attributes
    - **name:** str
    - **health_total:** int
    - **mana_total:** int
    - **current_health:** int
    - **current_mana:** int
    - **alive:** bool
  - Methods:
    - `upgrade_mana(increase_amount: int):`
      *Increases mana_total*
      
    - `upgrade_health(increase_amount: int):`
      *Increases health_total*

    - `restore_health()`
      *Sets current_health to health_total*

    - `restore_mana()`
      *Sets current_mana to mana_total*

    - `add_health(health_added: int)`
      *adds hearts/health to character*

    - `add_mana(mana_added: int)`
      *adds hearts/health to character*


- **Class: Boss_Entity()** Inherits properties of entity class
  - **damage_amount**: int
  - **description**: string
  - **image_url**: string

- methods
  - `decrease_health(health_hit: int)`
    *takes health away from boss*
    
  - `add_health(health_added: int)`
      *adds hearts/health to boss*



- **Class: Boss_Entity()**
  - **name**: string
  - **health_total**: int
  - **health_current**: int
  - **mana**: int
  - **damage_amount**: int
  - **description**: string
  - **image_url**: string

- methods
  - `decrease_health(health_hit: int)`
    *takes health away from boss*
    
  - `add_health(health_added: int)`
      *adds hearts/health to boss*



## Card class:
  Attributes:
  - **name**: str
  - **image_url**: str
  - **power_level**: int
  - **mana_cost**: int
  - **Available**: bool
    
   Methods:

   -`set_available(bool)`**
     * sets available to false so it can't be used*

  - `use_card()`
    *Overloaded function that will apply an effect depending on the card*
     
  ## Class DamageCard:
      - **damage_type:** str

      Methods: 
      - `use_card()`
        *Returns damage effect and the power of the effect, json format that will be applied during battle, by battle logic*
        

  ## Class BuffCard:
      - **buff_type**:
      
      Methods:

      - `use_card()`
      *Returns buff effect and the power of the effect, json format that will be applied during battle*

  ## Class EnemyDebuff:
   - **debuff_type**:
      
      Methods:

      - `use_card()`
      *Returns debuff effect and the power of the effect, json format that will be applied to enemy during battle*

      
    

    

# Low-level Design Backend
Subsystem Design:

# Backend System Design (UML)

## User Authentication & Authorization
**Class: AuthService**  
- `validate_token(token: str) -> bool`  
  *Checks if the token is valid.*  
- `get_user_data(user_id: str) -> dict`  
  *Retrieves user data from DB.*  
- `check_purchase_status(user_id: str) -> bool`  
  *Confirms game purchase.*  

## Module Game Engine
This engine is going to be broken into 2 parts the main game manager that updates/saves character progression and the API layer that defines endpoints for client to call:


### Endpoints:

- `/getcards/id:` The server should return all cards belonging to character to client

- `/createcard:` Client passes card description selected to server, server returns a card object as json

- `/getgame/id:` server returns game run(story text, player stats(health, mana))( json)

- `/getsummary:` server returns a summary of the story(json)

- `/getstoryall:` server returns all story text

- `/playerresponse:` client passes user prompt to server, server continued story text

- `/createbattle:` server returns boss details as json(damage, health, url image)

- `/battleresults:` client passes boss outcome(win or lose) server returns ai summary of battle and items to choose from which will be turned into cards.

- `/createnewgame:` the client should pass the game description and character description, server then will create new game, and create a new character(using game engines`create_character(char_description)`) and run. Game and character will be returned as JSON.


**GameEngine Interface Front End** 
  


**Class: GameEngine Interface Backend**  
- **Object: Character()**
  - Attributes
    - **name:** str
    - **health_total:** int
    - **mana_total:** int
    - **current_health:** int
    - **current_mana:** int
    - **alive:** bool
  - Methods:
    - `upgrade_mana(increase_amount: int):`
      *Increases mana_total*
      
    - `upgrade_health(increase_amount: int):`
      *Increases health_total*

    - `restore_health()`
      *Sets current_health to health_total*

    - `restore_mana()`
      *Sets current_mana to mana_total*

    - `add_health(health_added: int)`
      *adds hearts/health to character*

    - `add_mana(mana_added: int)`
      *adds hearts/health to character*
     
    
   
- **Object: Boss_Entity()**
  - **name**: string
  - **health**: int
  - **mana**: int
  - **damage_amount**: int
  - **description**: string
  - **image_url**: string

- `get_character_state(user_id: str, char_id: str) -> dict`  
  *Loads saved game state(character stats/object) from Database creates character object.*

- `get_cards(user_id: str, char_id: str) -> dict`
  *Gets deck of cards for the character from Database*
  
- `generate_story(player_input: str) -> JSON object`  
  *Uses AI language model interface to generate the next story segment and sends it to the client.*
  
- `item_selection(item_selection: str, player_id: str) -> JSON Object`  
  *Processes player choice, returns card*

- `create_character(char_description)`
  * Creates and stores new character in database, calls ai image interface to make character image, returns character details stored in json*
  
  
- `create_boss_battle(player_id: str) -> Boss Json`  
  *Returns Json of boss object*


- `finalize_battle(player_id: str, outcome: str, player_stats: str) -> JSON Object`  
      *Store player health and stats in DB,
      Create a card from Card Management,
      and return the JSON of the new card.*

  - `save_game_state(user_id: str, game_state: dict)`  
  *Saves game progress.*  

  **Class: Run Manager**




## Card Management
**Class: CardManager**  
- `generate_card(item_description: dict, player_id: str) -> dict`  
  *Given card attributes, creates, saves, and returns a new card.*

- `get_player_cards(player_id: str) -> list`  
  *Retrieves player's card inventory.*
  
- `use_card(card_id: str, player_id: str) -> dict`  
  *Uses a card in battle.*
  
- `upgrade_card(card_id: str, player_id: str) -> dict`  
  *Upgrades an existing card.*  

## Payment Interface
**PaymentService(could have)**  
- `process_payment(user_id: str, amount: float) -> dict`  
  *Handles payment processing.*
  
- `save_transaction(user_id: str, transaction: dict)`
  *Stores a transaction record.*
  
- `get_transaction_history(user_id: str) -> list`  
  *Retrieves user payment history.*  


## AI Image Generator Interface
**AIImageGenerator**  
- `generate_card_image(description: str) -> str`  
  *Generates an image for a card, stores in S3 bucket, and returns URL.*
  
- `generate_boss_image(description: str) -> str`  
  *Generates an image for a boss, stores in an S3 bucket, and returns url.*

- `generate_character_image(description: str`
  *Generates image that will be used to represent the character in-game, returns url*
  
Rationale: This subcomponent will be responsible for communicating with the external AI image generator service. Both functions will have a custom prompt built for the type of image it is trying to make. More information on how AI integration will work in section #

## AI Story Generator Interface
**AIStoryGenerator**(connects to external AI LLM for generating content)
- `generate_story_text(user_prompt: str) -> str`  
  *Prompts Ai with user input and custom prompt to Generate dynamic story content. Returns story text*
  
- `generate_boss_encounter_story(user_input: str) -> str`  
  *Generates an encounter with boss, returns story text*

- `summarize_story(story_data: list) -> str`  
  *Provides a story summary based on the list of all previous text.*

- `generate_item_options(AI_Text: str ) -> str`
  *Prompts the ai to generate a story where multiple objects can be picked up. generates attributes of each object that match card attributes*

- `parse_items(item_descriptions: str) -> dict`
  *Filters through item description to find keywords to build an card object later, returns dictionary of items and their attributes* 



*Rationale:* We've broken the story generator into multiple functions that perform different tasks, based on the need. For example, general story generation will be prompted differently than when we want to force a boss encounter. Also we need custom prompts for generating story with items.


## Relationships Between Components
- **GameEngine** → `AIStoryGenerator`: Requests story text  
- **GameEngine** → `DatabaseService`: Stores game state  
- **GameEngine** → `CardManager`: Requests card actions  
- **GameEngine** → `AIImageGenerator`: Requests boss images  
- **AuthService** → `DatabaseService`: Validates user data  
- **PaymentService** → `DatabaseService`: Stores transactions  
- **CardManager** → `AIImageGenerator`: Requests card images  
- **GameEngine** → `AuthService`: Checks user authentication
- 





### System Performance:

# System Performance

Ensuring optimal system performance is crucial for maintaining a seamless gaming experience, particularly as player engagement increases. This section addresses potential bottlenecks and how the system handles an increase in load.

## Potential Bottlenecks & Mitigation Strategies

1. **Database Performance**
   - **Bottleneck:** Increased concurrent queries from a growing user base may slow down game state retrieval and card collection updates.
   - **Mitigation:**
     - Implement database indexing to optimize query performance.
     - Utilize caching mechanisms (e.g., Redis) for frequently accessed data, such as user game state and card inventory.
     - Optimize database queries and use connection pooling to handle high traffic efficiently.
     
2. **AI-Generated Story & Image Processing**
   - **Bottleneck:** AI language model and AI image generation API calls may introduce latency, impacting real-time gameplay.
   - **Mitigation:**
     - Pre-generate and cache frequently used story elements and card images.
     - Implement asynchronous processing for AI requests to prevent blocking gameplay interactions.
     - Utilize a load balancer to distribute AI generation requests efficiently.
     
3. **Server Load & Scalability**
   - **Bottleneck:** High user concurrency may overwhelm the backend, leading to slower API response times.
   - **Mitigation:**
     - Deploy auto-scaling instances to dynamically adjust server capacity based on traffic.
     - Use a CDN (Content Delivery Network) to distribute assets and reduce server load.
     - Implement rate limiting to prevent abuse and ensure fair resource allocation.

4. **Authentication & Payment Processing**
   - **Bottleneck:** Increased authentication requests and payment transactions could lead to delays in login and purchase verification.
   - **Mitigation:**
     - Leverage Supabase’s authentication caching to minimize redundant authentication checks.
     - Use asynchronous processing for payment verification to avoid blocking gameplay progression.
     - Implement queue-based processing to handle peak transaction loads smoothly.

5. **Game Engine & Card Management Performance**
   - **Bottleneck:** Processing real-time game actions (e.g., battles, inventory updates) may introduce performance lag.
   - **Mitigation:**
     - Offload intensive game calculations to background workers to reduce response time.
     - Use efficient data structures to store and retrieve card details and game state quickly.
     - Optimize the game logic execution flow to minimize redundant computations.

## Handling Increased Load

As the player base grows, the system must scale effectively. The following measures will be in place to ensure smooth operation under increased load:

1. **Horizontal Scaling**
   - Load balance API requests across multiple instances to prevent any single point of failure.
   - Implement containerization (e.g., Docker, Kubernetes) to deploy and manage scalable microservices.

2. **Asynchronous Processing & Message Queues**
   - Use message queues (e.g., RabbitMQ, Kafka) to process non-urgent tasks in the background.
   - Implement event-driven architecture for handling game events and AI-generated content asynchronously.

3. **Optimized API Gateway**
   - Use an API gateway to efficiently route and manage API requests.
   - Implement request batching to reduce redundant API calls and improve response times.

4. **Monitoring & Performance Optimization**
   - Continuously monitor API response times, database query performance, and server health.
   - Implement automated alerts and logging to detect and address performance issues proactively.

By applying these strategies, the system will maintain high performance while ensuring scalability as the game evolves and attracts more players.

# Programming Languages, Libraries, and Frameworks

This section outlines the key programming languages, libraries, and frameworks that will be used in our system. The selections are based on project requirements such as performance, scalability, and long-term maintainability.

## Backend

- **Programming Language: Go**
  - *Why:* Go is a statically typed, compiled language known for its performance, simplicity, and excellent support for concurrent programming. These features make it an ideal choice for building a high-performance game server that can efficiently handle multiple simultaneous connections. While robust the language has fairly simple syntax which will make it easier for those on the team that don't yet know it to learn.

- **Framework: chi**
  - *Why:* chi is a lightweight and idiomatic HTTP router for Go, designed for building RESTful APIs. Its minimalistic design and composability allow for rapid development while keeping the backend lean and maintainable.


## Front End
- **React with TypeScript**
  - *Why:* React provides a powerful framework for building interactive user interfaces, while TypeScript adds static typing, reducing runtime errors and improving code maintainability. This combination ensures a scalable and robust front-end development experience. React will also allow us to reuse UI elements in multiple screens which will help us reuse components as new game content is added in the future.
 
- **Additional Frontend Libraries:**
  - **Fetch API**
    - *Why:* Used for making HTTP requests to our backend, ensuring smooth communication between the client and server.
  - **React Router**
    - *Why:* Manages in-app navigation, ensuring a seamless user experience as players move between different views.
  - **CSS Frameworks (Tailwind CSS)**
    - *Why:* Provides pre-built components and utility classes that expedite the development of a responsive and user-friendly interface. Will allow us to build a styled ui faster and help with designing new pages and content in the future.


## How these choices affect development and performance

- **Performance and Scalability:**  
  Both Go and React are optimized for high performance and scalability. Go's efficient concurrency handling may be crucial for managing a high volume of simultaneous requests, while React's virtual DOM and component-based architecture ensure a smooth and responsive user experience.

- **Ease of Development & Maintainability:**  
  Go's simplicity and clear syntax lower the learning curve and reduce complexity, making the backend easier to maintain over time. Meanwhile, React combined with TypeScript offers enhanced code quality and predictability on the frontend, facilitating long-term maintenance and reducing the risk of bugs.

- **Ecosystem and Community Support:**  
  The vast ecosystems around Go and React mean access to extensive libraries, frameworks, and community support. This ensures that any challenges encountered can be swiftly addressed with proven solutions and best practices.

- **Modularity and Flexibility:**  
  By leveraging specialized libraries (like chi for routing and stripe-go for payment integration), the system remains modular. This modularity allows individual components to be updated or replaced independently as the system evolves, aligning with future requirements and technological advancements.
