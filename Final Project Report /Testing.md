# Test Design Report

In this document, we outline our approach and strategy for thoroughly testing our application. Our goal is to ensure that every critical aspect of the system works as expected, providing a reliable and bug-free experience for our users. Note: ChatGpt assisted us in writing this document.

## Testing Approach, Philosophy, and Plan

### Unit Testing & Code Coverage
- **Objective:** Verify core business logic, API endpoints, and UI components.
- **Plan:** Write unit tests focusing on the most essential functionalities.
- **Target:** Aim for approximately 85% code coverage on both the frontend and backend to ensure we cover all critical features.

### Integration and System-Level Testing
- **Objective:** Confirm that different modules interact seamlessly.
- **Plan:** Implement integration tests that validate the communication between the frontend and backend.
- **Additional Testing:** Conduct end-to-end simulations to replicate real user scenarios, ensuring the application behaves as intended.

### Extended Testing Areas
- **Database Testing:**
  - **Objective:** Ensure our database schema enforces primary keys and maintains data integrity.
  - **Plan:** Run tests that simulate scenarios such as duplicate key insertions, schema migrations, and complex queries to verify referential integrity.
  
- **S3 Testing for Primary Keys and Image URLs:**
  - **Objective:** Validate that images uploaded to S3 have correctly generated primary keys and that the image URLs are both accurate and accessible.
  - **Plan:** Simulate image uploads and test the resulting data for consistency.

## System-Level Testing for the Final Presentation

### 1. End-to-End User Scenarios
- **Setup:** Launch both the backend and frontend services locally.
- **Actions:** Simulate typical game scenarios such as user logins, game state transitions, score updates, and multiplayer interactions.
- **Expected Outcome:** The UI and backend database should consistently reflect the correct state without any error messages.

### 2. Stress Testing
- **Setup:** Use a controlled environment to mimic multiple users interacting simultaneously.
- **Actions:** Monitor the application's behavior under high load, especially during real-time game updates.
- **Expected Outcome:** The system should remain stable, with any performance degradation falling within acceptable limits.

### 3. Ad-Hoc Manual Tests
- **Steps:**
  - Launch the application on various devices and browsers.
  - Interact with key features (e.g., multiplayer lobby, gameplay, scoreboards).
  - Record outcomes using screenshots and log files.
- **Expected Outcome:** Ensure consistent UI rendering and correct business logic execution across all scenarios.

### 4. Database and S3 Integration Tests
- **Database Testing:**
  - **Setup:** Use test databases pre-seeded with data that reflect real-world conditions.
  - **Actions:** Perform insert, update, and delete operations, verifying that primary keys and relationships are maintained.
  - **Expected Outcome:** No duplicate keys or broken relationships; migrations should execute without errors.
  
- **S3 Testing:**
  - **Setup:** Configure the application to use a test S3 bucket.
  - **Actions:** Simulate image uploads and confirm that each upload generates a correct primary key and a valid image URL.
  - **Expected Outcome:** Each image URL should correctly point to an accessible image on S3, and any errors in the upload process must be gracefully handled.

### 5. Authentication and Authorization Testing for Card, Character, and story Creation

- **Objective:**  
  Ensure that only authenticated and authorized users can create and access cards, characters, and story text associated with their accounts, preventing unauthorized access or data manipulation.

- **Plan:**  
  - Implement tests to simulate requests from both authenticated and unauthenticated users attempting to create cards, story, and characters.
  - Verify that the server correctly restricts access, returning appropriate status codes (e.g., `401 Unauthorized`, `403 Forbidden`) when unauthorized users attempt to perform these actions.
  - Confirm that authenticated users can only create or modify entities tied to their own accounts.

- **Expected Outcome:**  
  - Unauthorized requests are blocked with proper error responses.
  - Authorized users can successfully create and manage their own cards and characters.
  - No user can access or modify data belonging to another account.


## What We Actually Tested

### Backend
Our testing primarily focused on backend unit tests to verify the functionality of key server endpoints. We tested the following:

- Creating valid cards (`/card`)
- Fetching a specific card (`/cards/:id`)
- Fetching a specific character (`/character/:id`)
- Fetching all characters for a user (`/characters?userid`)
- Creating a new character (`/getNewCharacter`)
- Signing up (`/signup`)
- Creating a boss (`/boss`)

We also implemented tests to ensure that invalid tokens were correctly rejected by our authentication middleware. In addition, we tested how these endpoints handled malformed or incomplete requests to verify that proper error responses were returned.

We implemented two main test files:

1. **API Endpoint Tests** (`v1_test.go`):
   - Comprehensive testing of all API endpoints listed above
   - Middleware tests for invalid token handling
   - Bad request handling tests
   - Response validation for each endpoint
   - Test coverage: 45% statement coverage

2. **Database Tests** (`db_test.go`):
   This test file validates the functionality of various database operations, including user, character, card, and story management. It ensures that the database operations handle both valid and invalid inputs correctly, covering edge cases and error scenarios. Here are the things we tested for database:

   - 1. **Environment Loading**
       - **Function Tested**: `loadEnv`
       - **Purpose**: Ensures that environment variables are correctly loaded from a `.env` file.
       - **Key Scenarios**:
         - Valid `.env` file with proper key-value pairs.
         - Handling of comments and empty lines in the `.env` file.

   - 2. **User Management**
       - **Function Tested**: `InsertUser`, `GetUserPasswordHash`
       - **Purpose**: Validates user creation and password hash retrieval.
       - **Key Scenarios**:
         - **`TestInsertUser`**:
           - Valid user creation.
           - Duplicate email detection.
           - Invalid email format handling.
         - **`TestGetUserPasswordHash`**:
           - Retrieval of password hash for valid users.
           - Handling of non-existent users.

   - 3. **Character Management**
       - **Functions Tested**: `InsertCharacter`, `GetCharacterByID`, `GetUserCharacters`
       - **Purpose**: Validates character creation and retrieval.
       - **Key Scenarios**:
         - **`TestInsertCharacter`**:
           - Valid character creation.
           - Handling invalid user IDs.
         - **`TestGetCharacterByID`**:
           - Retrieval of characters by valid IDs.
           - Error handling for invalid character IDs.
         - **`TestGetUserCharacters`**:
           - Retrieval of all characters associated with a user.
           - Handling of non-existent users.

   - 4. **Card Management**
       - **Functions Tested**: `InsertCard`, `GetCardsByCharacterID`
       - **Purpose**: Validates card creation and retrieval.
       - **Key Scenarios**:
         - **`TestInsertCard`**:
           - Valid card creation.
           - Handling invalid character IDs.
         - **`TestGetCardsByCharacterID`**:
           - Retrieval of all cards associated with a character.
           - Handling of invalid character IDs.

   - 5. **Story Management**
       - **Functions Tested**: `InsertStory`, `GetStoriesByCharacterID`
       - **Purpose**: Validates story creation and retrieval.
       - **Key Scenarios**:
         - **`TestInsertStory`**:
           - Valid story creation.
           - Handling invalid character IDs.
           - Validation of empty prompts.
         - **`TestGetStoriesByCharacterID`**:
           - Retrieval of the most recent stories for a character (limited to 5).
           - Handling of invalid character IDs.
           - Ensuring stories are ordered by most recent first.

---

#### Backend Test Summary
Overall, the endpoints performed well during testing. The biggest challenge was setting up the tests in Go, as we were unfamilar with testing in Go and Chi. We had to make several adjustments to the endpoints during the process. Most issues we encountered were related to handling bad requests—for example, missing or incorrectly formatted fields in the request body. In response, we added additional validation and improved error handling.

### Manual Testing:
In addition to backend unit tests, we performed manual testing on the frontend by playing through the game. This helped us discover issues such as story prompts failing to initiate a boss fight, even when the required keyword was present. We traced this issue to the AI not always sending an exact keyword match, so we added more flexible keyword detection. Dealing with AI responses is something we still worry about, because AI isn't always perfect at responding how you would wish, like in the case for initiating the battle. So we are still worried about that not working.

During middleware testing, we also identified an issue with how Supabase tokens were handled. The frontend wasn't sending the tokens in the expected header format, and the middleware wasn't properly decoding them. We resolved this by updating both the frontend and middleware to handle Supabase authentication correctly. We are still worried about the token-based middleware working, especially with Supabase, since it is a newer feature and we were having a lot of trouble with it. Every once and a while supabase key doesn't appear to play nice with our middleware. There are a variety of reason we speculate why, such as inconsitent server time, but haven't yet been able to pinpoint a solution yet. So we are still worried about Oauth working.

To view our general manual testing view Steps to Reproduce Test Results to see how to the system should function.

### Test Coverage:
Our test coverage still has room for a lot of room for improvement. Our endpoint testing showed 45% statement coverage, and our database code showed 79% coverage. There are several edge cases and additional helper functions that we haven't tested yet. Testing AI-related endpoints was more limited, mainly due to cost concerns.

## Steps to Reproduce Test Results

### 1. Set Up the Environment

- **Clone Repositories:** Clone the repository at https://github.com/Samuelk-Chase/CS3450-Software-Engineering/tree/main.
- **Install Dependencies:** Navigate to the `last-game-frontend` directory and run `npm install`.
- **Install Go:** Ensure Go is installed before running the backend server and tests.
- **Database Configuration:** The database and S3 bucket are already configured in our project, but may need to be added to the env file. For future testing, we plan to populate the database with additional test data. **Important:** Unit tests may not work for clones of the project since the project relies on sensitive details, such as database, AI, and AWS keys in our env file(which is not publicly available). example.env in backend and frontend outlines which data is needed, but authorized testers may need to request important data to successfully run the tests.

### 2. Run Unit and Integration Tests

- **Backend Tests:**  
  Endpoint Test: Navigate to `backend/internal/api/v1` and run the tests using:  
  ```bash
  go test -v
  ```
  

  

  Database Test: Navigate to `backend/internal/db` and run the db tests using:
  ```bash
  go test
  ```
  Coverage Note: To view coverage for each test group run "go test -cover"
  
- **Frontend Tests:**  
  Currently, frontend tests are not implemented. We plan to add them so they can be executed with:  
  ```bash
  npm test
  ```



### 3. Perform System-Level and Manual Testing

- **Launch Services:**
  - **Frontend:**  
    In the `last-game-frontend` directory, run:  
    ```bash
    npm run dev
    ```  
    Then open [http://localhost:5173](http://localhost:5173) in your browser.
  - **Backend:**  
    In the `backend` directory, run:  
    ```bash
    go run cmd/api/main.go --port 8080
    ```

- **Simulate User Flows:**
  - **Sign-Up:** Register multiple accounts to test sign-up functionality.
  - **Login:** Log in using both email/password and OAuth methods.
  - **Character Data:** After logging in, ensure the correct characters appear on the Character Account page for each account.
  - **Character Creation:** Test the full flow:
    - Click "Create New Character"
    - Enter a name, character description, and world description
    - Confirm a loading spinner appears and is followed by a generated character with an image
    - Confirm the character was saved in the character selection screen
    - Verify the character is linked to the correct user via the database or by signing out and logging in again
  - **Sign Out:** Signing out should redirect the user to the login page. Ensure that protected routes are no longer accessible.
  - **Main Game View:**
    - From the Character Account page, click on a character to enter the main game view
    - Ensure that character details, images, and stories are accurate
    - For new characters, a beginner story should be shown
    - Test sending inputs to the AI and confirm responses appear in order
    - If the AI response contains *combat begins*, verify that a popup appears to initiate the battle
    - Click "Generate Deck" and confirm that 3 cards are created
  - **Combat Testing:**
    - Ensure that clicking on cards plays the correct sound effects
    - Verify that playing cards reduces the boss's health appropriately
    - Verify that once a boss health reaches zero a card is rewarded to player and added to deck


#### Game Flow Walkthrough with Screenshots

Below is a walkthrough of the game flow, showcasing key steps and features using screenshots. Each image demonstrates how the application should behave during manual testing. Note: Some UI features may be slightly changed in the final project for some screenshots, but should largely be consistent with the final product.

### 1. Sign-Up and Login
- **Sign-Up:** Users can create an account by filling out the required fields.
  ![Sign-Up Screen](/images/GameViewScreenshots/signupscreenshot.png)
- **Login:** After signing up, users can log in to access their account. Users can also use oauth to log in. Note: Currently only github is set up.
  ![Login Screen](/images/GameViewScreenshots/LoginScreenshot.png)
- **Successful Login:** Upon successful login, users are redirected to the Character Account page. An alert popup frest appears and when ok is pressed the user goes to character screen to view there characters if they exist.
  ![Successful Login](/images/GameViewScreenshots/successfullogin.png)

---
### 2. Selecting a Character
- **Character View:** After logging in users are presented with all their characters.
  ![Clicking on a Character](/images/GameViewScreenshots/characterscreenshot.png)
- **Character Selection:** When a user clicks on a character, a component with that characters attributes appears and a play button which when clicked will take user to the main game view.
![Clicking on a Character](/images/GameViewScreenshots/clickingcharacter.png)

---

### 3. Character Creation
- **Creating a New Character:** When users press Create Character Button on the selection screen they are brought to character creation screen. Users can create a new character by entering details like name, character description, and a word description.
  ![Character Creation Step 1](/images/GameViewScreenshots/charactercreation2.png)
- **Spinning Wheel:** When Create Character is pressed a loading spinner appears while the character is being generated.
  ![Character Creation Step 2](/images/GameViewScreenshots/spinningcharacterwheel.png)
- **New Character Added:** Once character is created, user is automatically returned to character account page with all their characters including the new one they just created.
  ![Character Screen with New Character](/images/GameViewScreenshots/characterscreenwithnewcharacter.png)

---



### 4. Main Game View(character clicks play after selecting character)
- **First-Time Game View and AI chats:** The main game screen displays the character's details and the initial story prompt written for that character and world. Users can interact with the AI to progress the story by typing in the text box and clicking submit. Sometimes after chatting with AI, the AI will initiate a battle. When this happens a popup should appear asking the user to enter the battle. When the user accepts they are taken to the battle screen.
  ![Game View First Time](/images/GameViewScreenshots/gameviewscreenfirsttime.png)

- **Generate Deck Button**: New characters with no cards can press the Generate Deck button to generate a deck of cards. Upon pressing a spinning ring is displayed while the cards are generated.
![Generating Deck](/images/GameViewScreenshots/generatingdeck.png)

- **View Deck**: After initial deck is generated the Generate Deck button is replaced with View Deck button. Clicking button displays the character's deck of cards. To close the deck press close button.
![Open Deck Main](/images/GameViewScreenshots/opendeckmain.png)


### 5. Battle Screen
  - **Entering battle**: When user first goes to battle screen a spinning loading wheel should appear while a boss is generated. Once the boss is generated an image of the boss should appear.
  ![Open Deck Main](/images/GameViewScreenshots/bosspage.png)
  - **Combat**: User should be able to press play card button which will display the characters set of cards. Pressing an available card should close the deck and trigger an attack against the boss and lower its health. Pressing a card should also play a sound effect. After a card is used it will display a cooldown timer until in can be played again. Boss will also attack the user and lower their health.
  ![battle deck](/images/GameViewScreenshots/openingdecktoplay.png)
  Card Played 
  ![card used display attack](/images/GameViewScreenshots/playingcard.png)
  - **Boss Defeat**: Once the boss health reaches zero, a spinning wheel should appear while a card based off the boss just defeated is generated. Once it is generated the card should appear with an accept button. Pressing Accept brings user back to main game view.
  ![reward generating](/images/GameViewScreenshots/generatingrewardatbossdeath.png)

  Reward Generated:
  ![reward generated](/images/GameViewScreenshots/cardreward.png)


### 6. Micellaneous Actions:
  - **Logging Out**: Pressing log out should return user to sign in page. Users who are not signed in should be redirected to sign in page when trying to access other pages besides login.

  - **Viewing Game Manual**: On certain pages users may press game manual button to open a user manual for the game. 
  ![user manual](/images/GameViewScreenshots/gamemanualingame.png)


---

    

### 4. Document Outcomes
- **Verification:** Confirm that all tests pass with the expected outcomes.
- **Observation:** Note any anomalies in the logs or UI.
- **Iteration:** Use these findings to further refine and improve the application.

---
## Future Testing Improvements

There is still significant room to expand our test coverage. In future iterations, we plan to:

- **Increase Backend Test Coverage:** Add more unit and integration tests to validate that all backend functions behave as expected.
- **Implement Frontend Testing:** Introduce frontend tests using tools like Jest and React Testing Library to ensure UI components and user flows work correctly.
- **Improve the Testing Environment:** Enhance our testing setup by adding more test data to the database and incorporating tools like Istanbul or Jest for detailed code coverage reporting.
- **Clean Up Test Output:** Refactor existing tests to improve readability and suppress unnecessary server logs during test runs so that the test results are easier to review.

These improvements will help us maintain high code quality, detect issues earlier, and ensure our app remains stable as it scales.

This testing strategy is designed to give us confidence in our application's stability, performance, and overall user experience.