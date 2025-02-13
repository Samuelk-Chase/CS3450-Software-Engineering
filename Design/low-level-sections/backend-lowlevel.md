Note: Chat GPT was used to help generate sections of this

# Low level Design
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

## Game Engine
**Class: GameEngine Interface**  
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
**Class: PaymentService(could have)**  
- `process_payment(user_id: str, amount: float) -> dict`  
  *Handles payment processing.*
  
- `save_transaction(user_id: str, transaction: dict)`
  *Stores a transaction record.*
  
- `get_transaction_history(user_id: str) -> list`  
  *Retrieves user payment history.*  


## AI Image Generator
**Class: AIImageGenerator**  
- `generate_card_image(description: str) -> str`  
  *Generates an image for a card, stores in S3 bucket, and returns URL.*
  
- `generate_boss_image(description: str) -> str`  
  *Generates an image for a boss, stores in an S3 bucket, and returns url.*

Rationale: This subcomponent will be responsible for communicating with the external AI image generator service. Both functions will have a custom prompt built for the type of image it is trying to make.

## AI Story Generator
**Class: AIStoryGenerator**(connects to external AI LLM for generating content)  
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
