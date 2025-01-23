# Non-Functional Requirements   

### Key Attributes  
1. **Performance:**  
    - AI text responses must be generated and displayed to users within 2 seconds of users selecting/inputting a text response.
    - Cards (including AI generated image assets and card stats/abilities) must be generated and displayed to users within 3 seconds of player reaching card display page

2. **Multiplayer:**  
    - The game must support at least 25 simultaneous users per server initially.  
    - Multiplayer systems must maintain low latency (<200ms) even during peak usage.

3. **Reliability:**  
    - System uptime should be at 99.9%, once game is deployed, to minimize disruptions and ensure continuous availability to players
    - AI modules and other system modules must recover gracefully from failures and log errors for debugging without crashing the game instance.  
    - User customized games should be saved onto users account, and retrieved/loaded from database quickly upon login (>10 seconds)

4. **Security:**  
    - Provide secure user password storage through encryption, and ensure that passwords are retrieved/decrypted from database in >1 second
    - Ensure users are able to create account, complete with username and password, and the account details are encrypted/stored in database in >1 second
    - Perform regular security audits/checks to ensure fair gameplay for all users, and prevent against data leaks and exploits

5. **Usability:**   
    - All accessibility features (e.g., adjustable font sizes, colorblind modes) must adhere to WCAG Level AA standards.  

6. **Compatibility:**  
    - The application must function on Windows, macOS, and at least two popular Linux distributions.
    - Additionally, performance must meet or exceed minimum requirements on browser platforms for testing purposes.  

7. **Maintainability:**  
    - Codebase documentation must maintain 95% coverage for easy debugging and integrating team members respective modules.  
    - Modules must follow clean architecture principles, with dependencies clearly outlined and separated for independent updates. 

8. **AI Behavior:**  
    - NPCs must respond naturally within 2 seconds of player interaction.  
    - AI must ensure a meaningful variance in dialogues and random events across consecutive playthroughs, with no two stories alike

9. **Card Generation:**
    - Cards assets and statistics should be generated quickly (>3 seconds)
    - Cards must maintain a high level of randomness, with no two cards the same
    - Cards must adhere to a basic set of stats, and stay within the defined bounds
    - Card image asset generation should be random, draw from player's created game, and be stored/retrieved in asset database quickly (>1 second)

10. **User-Defined Game Generation**
    - AI should prompt user for short, descriptive aspects of their desired game, keeping the game creation process to >5 minutes
    - After AI has recieved necessary requirements from user, game setting and AI tone should be generated quickly (>30 seconds)
    - User defined game length, customizable from ~1 hour- ~20 hours
---  

## Identification of User Classes  

1. **Casual Players**  
   - Seek an enjoyable and intuitive gameplay experience, with fast, responsive gameplay
   - Desires low levels of downtime for continuous gameplay.
   - Wants to fight bosses with online friends (doesn't care as much about latency)
   - Desires fun, random cards 

2. **RPG Enthusiasts**  
   - Desire complex character development, high strategy, and significant player-driven choices
   - Expect deep AI adaptability and randomness (no 2 games the same) within quests and events
   - Expects AI to create accurate, realistic game scenarios based off user-supplied inputs

3. **Competitive Gamers**  
   - Value real-time multiplayer interactions(low latency is important) and challenging boss battles
   - Aim to showcase skills or achievements in team battles, employing cards at the top-end of defined bounds 

5. **Developers/Testers**  
   - Require insight into system logs, performance monitoring tools, and debugging capabilities. 
   - Ensure all functionalities adhere to documented standards during internal tests
   - Requires complete documentation and integration between various team modules

---  

## MoSCoW Analysis  

### Must-Have Requirements  
1. Secure, quick user account creation (>1 second)
2. Secure, quick user authentication (>1 second) via encrypted credentials.  
3. Display AI responses to in-game events and player inputs in >2 seconds.  
4. Efficient user-input game requirement gathering (>5 minutes)
5. Quick AI game environment/tone generation (> 30 seconds)
6. Accessibility features adhering to WCAG Level AA standards.
7. AI driven card image asset generation and storage in asset database (>3 seconds )
8. AI driven card stat generation, within consistent and defined bounds (>3 seconds).
9. AI NPC's take user input, and generate/display responses in >2 seconds

### Should-Have Requirements  
1. Brief in-game tutorial, with the average player able to complete the tutorial in >10 minutes, while still imparting all necessary gameplay knowledge.  
2. Multiplayer functionality for up to 25 users per server.  
3. Multiplayer functionality for boss battles, with latency of >200ms

### Could-Have Requirements  
1. User leaderboards displaying statistics about cards/boss battle achievements
2. OAuth2 authentication
3. SSO Authentication
4. AI generated backgrounds, based on player-created game, generated in >5 seconds  

### Won’t-Have Requirements
1. Cross-platform play between console and PC users in the initial release. 
2. Extended offline mode, with very small (>500 mb) AI models stored in local storage.
3. AI generated scenes and animations in >30 seconds.  
4. Portablity to various gaming consoles


---  

## User Stories  

1. **Casual Player:**  
   - *As a casual player, I want an easy-to-understand gameplay system so that I can quickly learn how to play the game.*  
   - *As a casual player, I want customizable gameplay length, so I don't have to complete a long, drawn out game.*  

2. **RPG Enthusiast:**  
   - *As an RPG enthusiast, I want a complex skill tree system so that I can create unique builds.*  
   - *As an RPG enthusiast, I want AI-driven narratives so that my choices influence the world.*  

3. **Competitive Gamer:**  
   - *As a competitive gamer, I want a low-latency multiplayer experience so that I can participate in real-time battles.*  
   - *As a competitive gamer, I want real-time team leaderboards to track rankings during events.*  

4. **Developer:**  
   - *As a developer, I want clearly logged AI behavior so that I can debug functionality faster.*  
   - *As a developer, I want modular coding practices so that updates and fixes don’t affect the entire system.*  
   - *As a developer, I want clearly documented code to easily patch bugs and roll out updates.*

---  

## Use Case Diagrams  

---  

*Note: AI was used to generate the general structure and template of this document*

