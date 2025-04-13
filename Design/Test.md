# Our Testing Plan

In this document, we outline our approach and strategy for thoroughly testing our application. Our goal is to ensure that every critical aspect of the system works as expected, providing a reliable and bug-free experience for our users. Note: ChatGpt assisted us in writing this document.

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

- **Clone Repositories:** Clone both the backend and `last-game-frontend` repositories.
- **Install Dependencies:** Navigate to the `last-game-frontend` directory and run `npm install`.
- **Install Go:** Ensure Go is installed before running the backend server and tests.
- **Database Configuration:** The database and S3 bucket are already configured as outlined in our documentation. For future testing, we plan to populate the database with additional test data.

### 2. Run Unit and Integration Tests

- **Backend Tests:**  
  Navigate to `backend/internal/api/v1` and run the tests using:  
  ```bash
  go test -v
  ```

- **Frontend Tests:**  
  Currently, frontend tests are not implemented. We plan to add them so they can be executed with:  
  ```bash
  npm test
  ```

- **Test Functions in `v1_test.go`:**
  - **`TestRoutes`:** Verifies major endpoints using valid request data. A summary of passed and failed tests is printed at the end. Note: Console output may be extensive, so scroll up to view the summary.
  - **`TestMiddlewareWithoutValidToken`:** Checks that the middleware correctly blocks requests lacking a valid authentication token.
  - **`TestBadRequests`:** Sends malformed or incomplete request data to endpoints to ensure proper error handling.

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
    - Navigate back to the Character Account page to confirm the character was saved
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
