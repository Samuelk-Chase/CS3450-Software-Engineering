# Our Testing Plan

In this document, we outline our approach and strategy for thoroughly testing our application. Our goal is to ensure that every critical aspect of the system works as expected, providing a reliable and bug-free experience for our users.

## Testing Approach and Philosophy

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


### What We Actually Tested

Our testing primarily focused on backend unit tests to verify the functionality of key server endpoints. We tested the following:

- Creating valid cards (`/card`)
- Fetching a specific card (`/cards/:id`)
- Fetching a specific character (`/character/:id`)
- Fetching all characters for a user (`/characters?userid`)
- Creating a new character (`/getNewCharacter`)
- Signing up (`/signup`)
- Creating a boss (`/boss`)

We also implemented tests to ensure that invalid tokens were correctly rejected by our authentication middleware. In addition, we tested how these endpoints handled malformed or incomplete requests to verify that proper error responses were returned.

Our test coverage still has room for improvement. There are several edge cases and additional helper functions that we haven't tested yet. Testing AI-related endpoints was more limited, mainly due to cost concerns.

Overall, the endpoints performed well during testing. The biggest challenge was setting up the tests in Go, as we were relatively new to the language. We had to make several adjustments to the endpoints during the process. Most issues we encountered were related to handling bad requests—for example, missing or incorrectly formatted fields in the request body. In response, we added additional validation and improved error handling.

In addition to backend unit tests, we performed manual testing on the frontend by playing through the game. This helped us discover issues such as story prompts failing to initiate a boss fight, even when the required keyword was present. We traced this issue to the AI not always sending an exact keyword match, so we added more flexible keyword detection.

During middleware testing, we also identified an issue with how Supabase tokens were handled. The frontend wasn’t sending the tokens in the expected header format, and the middleware wasn’t properly decoding them. We resolved this by updating both the frontend and middleware to handle Supabase authentication correctly.

Interestingly, the frontend testing provided the most valuable insights, as it highlighted real-world issues that players might experience.


## Steps to Reproduce Test Results

### 1. Set Up the Environment
- **Clone Repositories:** Clone the project and open the backend directory and the last-game-frontend directory.
- **Install Dependencies:** Run `npm install` (or the equivalent command) in last-game-frontend directory.
- **Install Go:** If Go is not installed, install go before starting the server and tests in the backend directory. 
- **DB Configuration:** We already have databases and S3 bucket configured according to our documentation. For future testing we will create more testing data in the database.

### 2. Run Unit and Integration Tests
- **Backend:** Run the test by moving into "backend/internal/api/v1" and running "go test -v".
- **Frontend:** We currently do not have front-end tests, but in the future will set them up such that "npm test" can be used to run front-end tests.
- **Review:** Currently, there are 3 different Test functions in v1_test.go that test a variety of cases and endpoints.
  - **TestRoutes:** This tests important endpoints using valid request data. A summary is printed at the end of which tests failed and passed. Note: The server's endpoints may print a lot of data to the console so you may have to scroll up to find the test summary.
  - **TestMiddlewareWithoutValidToken:** This test simply tests sending a request to a protected endpoint without a valid token in the header.
  - **TestBadRequests:** This function tests sending requests with bad request data to endpoints. 

### 3. Perform System-Level/Ad-hoc Tests
- **Launch Services:** Start the backend server and the frontend application.
    -  ***Front End:*** In the last-game-frontend run "npm run dev" to start the client and go to the localhost link in your browser(http://localhost:5173/).
    -   ***Backend:*** In the backend run "go run cmd/api/main.go --port 8080" to start the server.
- **User Flow Simulation:** Follow a typical user flow.
  - **Signing up:** Sign up using multiple accounts
  - **Logging in:** Log in using both email and oauth.
  - **Character data:** Ensure that when signed in characters belonging to account are displayed on the character account page. Test on multiple accounts
  - **Character Creation:** Clicking create new character should bring user to new character page. Test entering in name, character description, and world description. Clicking create character should present a loading circle and eventaully return a character object with a generated image. Verify Character exists by going back to CharacterAccount page. Verify Character is linked to account by either checking the database for the correct userid associated with the character or by signing out and back in.
  - **Test Signing out:** Signing out should send user back to login page. User should not beable to naviate to protected pages so test trying to navigate to other pages.
  - **Test Main Game View:** In CharacterAccount Page, click on character should take you to the main game view for that character. Test clicking on other characters to make sure story, picture, and character details are for that character. If the character is new a custom beginner story should appear to start the journey. Test sending responses to AI chat. Ensure that responses display on screen in order. After chatting with AI ensure that if AI response has *combat begins* that a popup appears asking user to enter the battle. Test that character can generate 3 cards by clicking generate deck.
  - **Test combat:** In combat test that when cards are clicked they make a sound effect. In combat test that when cards are used they damage the boss.
  
 
- **Capture Evidence:** Take screenshots at key steps:
  - **Screenshot 1:** Code coverage summary (approximately 85% for the backend and around 75% for the frontend).
  - **Screenshot 2:** The main game screen during a live session.
  - **Screenshot 3:** Logs from a stress test run, highlighting the successful handling of concurrent operations.
  - **Screenshot 4:** Test results confirming database integrity and accurate S3 image URL generation.
  -  **Other Screenshots:** Take screen shots of unexpected behavior and document steps to reproduce them. 
    

### 4. Document Outcomes
- **Verification:** Confirm that all tests pass with the expected outcomes.
- **Observation:** Note any anomalies in the logs or UI.
- **Iteration:** Use these findings to further refine and improve the application.

---
We still have a lot more that could be tested. In the future we will add more testing coverage to validate all functions are performing as expected. We will also implement frontend tests. Also we will improve the testing environment itself to include more testing data in the database and use new tools like Istanbul or Jest to report testing coverage to ensure we meet our coverage targets. We will also clean up our tests, so that they are more readable and ignore the server logging, so that only the test output is seen.
This comprehensive testing strategy is designed to give us confidence in our application's stability, performance, and overall user experience.
