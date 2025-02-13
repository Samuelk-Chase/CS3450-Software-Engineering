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
