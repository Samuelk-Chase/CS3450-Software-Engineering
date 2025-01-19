**AI-Based Multiplayer RPG Game - Requirements Document**

# **Table of Contents**
1. **Introduction**
   - __Purpose of the Document__
        - The purpose of this document is to define the requirements for the AI-zbased Multiplayer RPG Game. It serves as a reference for the developers when testing and designing the game.By outlining the functional, and nonfunctional,business and user requirements, this document aims to establish a structred approach to development while maintaining clarity and consistency. 

        - This document provides detailed specifications regarding User interactions, system behavior, and AI-driven mechanics. It ensures that the game's core elements, such as dynamic storytelling, role-based gameplay, and Ai generated conent are well-defined and verifiable. Additionally, this document aims to follow industry best practices by using the MoSCoW method. 

        - By referencing this document the develpment team will be able to effectivley build a robust and immersive multiplayer experience, where AI dynamically adapts to the game play creating a unique and engaging experience for players. the document will also serve as a foundation for the project evaluation, testing and future expansion of the game. 


   - __Scope of the Project__
        - The AI-Based Multiplayer RPG Game is designed as a real-time, AI-driven, multiplayer role-playing game that allows players to engage in dynamic, procedurally generated adventures. The game will be hosted on a central server, with players joining through a web-based client. The AI will act as both a game master and an adaptive element that personalizes gameplay based on player decisions.
        -  Key aspects of the project’s scope include:

            - __Multiplayer Integration__: Players can join the game via web-based connections, interacting with AI-generated scenarios and other players in a shared world.

            - __AI-Driven Gameplay__: AI will dynamically generate quests, characters, and world-building elements, ensuring a unique experience each session.

            - __Genre Customization__: Players can select from multiple game genres (Fantasy, Cyberpunk, Horror, etc.), affecting the story, setting, and mechanics.

            - __Character Development__: Players can create, customize, and develop their characters with ability trees, leveling systems, and inventory management.

            - __Game Master & Watcher Roles__: Some players may take on facilitator roles, allowing them to shape the game’s events or interact indirectly with active participants.

            - __Surprise Elements__: AI-driven randomness will introduce unpredictable twists, moral dilemmas, and unique decision-making paths.

            - __Cross-Device Accessibility__: The game will be playable from desktops, laptops, tablets, and smartphones through a browser-based interface.

            - __User Progress & Persistence__: Players will have the option to save their character progress and resume gameplay in future sessions.

        - __Out of Scope:__

            - VR or AR features (considered for future versions)

            - Console support (the game will be browser-based)

            - Fully scripted campaigns (the game relies on AI-driven dynamic storytelling rather than pre-written quests)

            - Blockchain-based rewards or in-game purchases

            - The scope of this project ensures a scalable, engaging, and AI-enhanced role-playing experience while remaining achievable within the given development timeframe. Future updates may expand the project’s capabilities, but the initial version will focus on delivering a high-quality, replayable, AI-driven multiplayer game.



   - __Intended Audience__
        ##### this section was AI generated for ideas before we start fine tuning  do not leave this in!!


        This document is intended for all involved in the design, development, and implementation of the AI-Based Multiplayer RPG Game. The primary audience includes:

        - Game Developers: Responsible for coding and implementing the core mechanics, AI functionality, and server-client architecture.

        - Game Designers: Define game mechanics, balance, and AI-driven interactions to create an engaging and immersive experience.

        - UX/UI Designers: Work on the user interface, ensuring accessibility, clarity, and ease of use for all players.

        - AI Engineers: Focus on the machine learning and procedural generation aspects of the game, ensuring the AI provides dynamic and engaging gameplay.

        - End Users (Players): The individuals who will play and interact with the game, providing feedback and contributing to future iterations.

        - Investors & Stakeholders: Individuals or organizations funding the project, requiring a clear understanding of the game’s objectives, target audience, and business model.

        - System Administrators & IT Support: Responsible for managing servers, databases, and ensuring the game runs efficiently and securely.

        - By providing clear and structured requirements, this document serves as a reference for all involved parties, ensuring alignment and clarity throughout the development process.



   - __Definitions & Acronyms__

2. **Roles & Responsibilities**
        This section outlines the different user roles within the game and their associated responsibilities. Each role has a distinct function that contributes to the overall gameplay experience.
## 2.1 Identified User Classes  

### Player  
The **Player** is the primary participant in the game, responsible for making choices, interacting with the environment, and progressing through the story. Players engage with the game through exploration, character customization, and decision-making.

#### Responsibilities:  
- **Gameplay Progression** – Navigate the game world, complete quests.  
- **Customization** – Create and modify their character, choose names, and upgrade items.  
- **Decision Making** – Choose dialogue options, engage in moral dilemmas, and influence the storyline.  
- **Game Interaction** – Roll dice for attacks, open chests, craft items, and interact with the environment.  
- **Game Management** – Save progress, load previous sessions, and log in to manage multiple characters.  
- **Exploration & Discovery** – Unlock achievements, explore hidden areas, and track past movements.  
- **Collaboration** – Participate in team challenges, interact with other players, and share progress.  

### Game Master  
The **Game Master (GM)** serves as the orchestrator of the game, guiding the story, setting the difficulty, and introducing challenges. The GM has control over certain game mechanics to ensure a balanced and immersive experience.

#### Responsibilities:  
- **Game Balancing** – Adjust difficulty levels and veto actions that could disrupt game balance.  
- **Scenario Control** – Modify game rules mid-session, introduce special effects, and set unique challenges.  
- **Guidance & Oversight** – Monitor players' stats, provide hints, and rewind or replay events if needed.  
- **Adaptive Storytelling** – Communicate with the AI to dynamically change the storyline based on player actions.  
- **Immersion Management** – Enhance engagement through environmental changes, surprise events, and in-game restrictions.  

### Game Watcher  
The **Game Watcher** is a spectator role with interactive capabilities, allowing them to influence the game in minor but meaningful ways. Watchers can act as neutral observers or engage with players through various mechanics.

#### Responsibilities:  
- **Passive Observation** – View the game through a spectator mode without distracting active players.  
- **Interactive Support** – Drop valuable items, reward players with in-game currency, or activate humorous events.  
- **Dynamic Influence** – Introduce random events, challenge players with puzzles or traps, and interact as a ghost.  
- **Stat Monitoring** – Track player progression and adjust interactions accordingly.  

### AI Bot  
The **AI Bot** serves as a computer-controlled entity that mimics player behavior, ensuring a dynamic and engaging experience in single-player or AI-assisted multiplayer modes.

#### Responsibilities:  
- **Behavior Adaptation** – Respond to player actions and adjust its strategies accordingly.  
- **Combat & Assistance** – Collaborate in battles, compete in mini-games, and roleplay its character.  
- **Dialogue Interaction** – Engage in meaningful conversations and react to player choices.  
- **Inventory & Progression** – Manage its own items, remember past interactions, and make decisions that affect gameplay.  
3. **Requirements Overview**
   - Functional Requirements
   - Nonfunctional Requirements
   - Business Requirements
   - User Requirements
4. **Requirements Details**
   - Functional Requirements
     - Feature Descriptions
     - System Interactions
   - Nonfunctional Requirements
     - Performance Requirements
     - Security Considerations
     - Usability Guidelines
   - Business Requirements
     - Organizational Goals
     - Market Positioning
   - User Requirements
     - User Interaction Expectations
     - Accessibility Features
5. **Requirement Characteristics**
   - Clear
   - Unambiguous
   - Limited in Scope
   - Consistent
   - Verifiable
   - MoSCoW Prioritization
6. **MoSCoW Analysis**
   - Must Have
   - Should Have
   - Could Have
   - Will Not Have
7. **User Stories**
   - Format: "As a [role], I want [an action] so that [benefit/value]"
   - List of User Stories (minimum 19)
8. **Use Case UML Diagrams**
   - Explanation of Use Case Diagrams
   - Number of Diagrams Required (Minimum 2)
   - Formatting Guidelines for UML Diagrams
9. **Common Mistakes to Avoid**
   - Focus on the Problem, Not the Solution
   - Include All Requirement Types
   - Intent vs. Implementation
   - Avoid Vague Requirements
10. **Markdown & Documentation Best Practices**
   - Ensuring Proper Formatting in Markdown
   - Reviewing the Document in PyCharm, VSCode, or GitLab Before Submission
   - Improving Readability for Non-Technical Stakeholders
11. **Conclusion & Next Steps**
   - Team Responsibilities for Completion
   - Submission Deadlines
   - Revision & Feedback Process

