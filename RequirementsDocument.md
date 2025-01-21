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


# 3. Requirements Overview  

This section outlines the essential requirements for the AI-based Multiplayer RPG Game. The requirements are categorized into **functional, nonfunctional, business, and user requirements** to ensure a clear and structured development approach.

## 3.1 Functional Requirements  
Functional requirements define the specific behaviors and features the game must implement to meet user expectations.

- **User Authentication & Profile Management** – Players must be able to **create, log in, and manage their profiles**.
- **Character Customization** – Players should be able to **create, modify, and save their characters**.
- **Multiplayer Session Management** – The game must support **real-time multiplayer interactions**.
- **AI-Driven Content Generation** – AI should **dynamically generate** quests, environments, and NPC interactions.
- **Game Progression & Saving** – Players must be able to **save and load** their progress.
- **Combat & Gameplay Mechanics** – The system should support **turn-based and/or real-time** combat mechanics.
- **Game Master & Watcher Roles** – Players should have the option to **act as facilitators** and influence the game.
- **Genre Customization** – The game should allow players to **choose a genre** (Fantasy, Cyberpunk, Horror, etc.).
- **Dynamic Storytelling** – The AI must provide **adaptive storytelling**, responding to player decisions.
- **Exploration & Achievements** – Players should be able to **discover hidden areas, complete quests, and unlock achievements**.

## 3.2 Nonfunctional Requirements  
Nonfunctional requirements define the system's quality attributes and constraints.

- **Scalability** – The game must support **multiple concurrent players** without performance degradation.
- **Performance** – The game should maintain **low-latency interactions** to ensure smooth gameplay.
- **Cross-Platform Accessibility** – The game must be **playable on desktops, tablets, and smartphones** via a browser.
- **Security & Data Privacy** – The system must implement **secure authentication and encryption** for player data.
- **Reliability** – The game must ensure **consistent uptime and minimal server downtime**.
- **Usability** – The interface should be **intuitive and accessible**, with clear UI/UX design.
- **AI Adaptability** – The AI should be **flexible enough to adapt to different player choices** in real-time.
- **Maintainability** – The system must allow for **future updates, bug fixes, and expansions**.

## 3.3 Business Requirements  
Business requirements outline the project’s high-level objectives and alignment with strategic goals.

- **Target Audience** – The game is designed for **RPG enthusiasts, online gamers, and AI-driven experience seekers**.
- **Revenue Model** – The game will be **free-to-play initially**.
- **Competitive Differentiation** – The game aims to stand out by offering **AI-driven, player-adaptive gameplay**.
- **Scalability for Future Expansions** – The system should be **designed to support new features** and updates over time.
- **Community Engagement** – The game should foster a **strong online community** with leaderboards.

## 3.4 User Requirements  
User requirements focus on what the players and other game participants need to experience in the game.

- **Players must be able to log in, save progress, and manage multiple characters.**
- **Players should have the freedom to explore, engage in combat, and interact with NPCs.**
- **The AI should respond dynamically to player choices, making each session unique.**
- **The game should provide intuitive controls and clear visual feedback.**
- **Players should have the ability to influence the game’s narrative through their actions.**
- **Game Masters must be able to adjust game difficulty and events in real time.**
- **Game Watchers should have interactive elements to influence gameplay.**
- **AI Bots must simulate real-player behavior and adapt dynamically to the game.**

# 4. Requirements Details  

This section provides an in-depth breakdown of the functional, nonfunctional, business, and user requirements. It elaborates on specific features, system interactions, performance expectations, and user experience considerations.

## 4.1 Functional Requirements  

Functional requirements specify the system's capabilities and behaviors necessary to meet user needs.

### 4.1.1 Feature Descriptions  
- **User Authentication & Profile Management** – Players must be able to create accounts, log in, and manage their profiles securely.
- **Character Customization** – Users can create, name, and modify their characters, selecting attributes, abilities, and appearances.
- **Multiplayer Session Management** – The system must support real-time connections, allowing players to join and interact dynamically.
- **AI-Driven Content Generation** – The AI will generate procedural quests, NPCs, and environmental elements based on player actions.
- **Game Saving & Loading** – Players should be able to save progress, reload previous sessions, and track quest history.
- **Combat & Gameplay Mechanics** – The system should include combat mechanics like rolling dice for attacks, leveling up, and team-based challenges.
- **Game Master Controls** – Game Masters should have tools to modify rules, introduce events, and oversee player progress.
- **Dynamic Storytelling** – AI should adapt the story based on player choices, allowing branching narratives.
- **Exploration & Achievements** – The game should encourage discovery of hidden areas, moral dilemmas, and progression-based rewards.

### 4.1.2 System Interactions  
- **Player Interactions** – Players will interact with NPCs, other players, and the environment through text, combat, and decision-making.
- **Game Master Influence** – The Game Master can adjust world rules and difficulty settings.
- **Game Watcher Actions** – Spectators can drop items, trigger events, or observe in spectator mode.
- **AI Adaptability** – The AI will monitor player behavior and adjust dynamically to keep the experience engaging.

---

## 4.2 Nonfunctional Requirements  

Nonfunctional requirements define system qualities that impact performance, security, and usability.

### 4.2.1 Performance Requirements  
- The system should support **low-latency gameplay**, ensuring smooth multiplayer interactions.
- AI-driven content generation should process within **milliseconds** to avoid gameplay delays.
- The game should handle **at least 100 concurrent players per session**.

### 4.2.2 Security Considerations  
- Implement **secure authentication** to protect user accounts.
- Encrypt all user data, including **saved progress and character details**.
- Prevent unauthorized access through **role-based permissions** (e.g., Game Masters cannot manipulate player profiles).

### 4.2.3 Usability Guidelines  
- The UI should be **intuitive and accessible**, following modern design principles.
- Text should be **clear and readable**, with adjustable font sizes for accessibility.
- The game should support **keyboard, mouse, and touchscreen inputs**.
- Tutorials and tooltips should be provided to onboard new players effectively.

---

## 4.3 Business Requirements  

Business requirements ensure that the project aligns with organizational goals and market positioning.

### 4.3.1 Organizational Goals  
- **Enhance player engagement** by leveraging AI-driven mechanics for replayability.
- **Increase accessibility** by making the game browser-based.
- **Encourage community interaction** with social features like leaderboards, chat, and cooperative gameplay.
- **Establish a scalable foundation** for potential expansions and future monetization.

### 4.3.2 Market Positioning  
- Target audience includes **RPG enthusiasts, online multiplayer gamers, and AI-driven experience seekers**.
- The game differentiates itself through **AI-generated storytelling and adaptive mechanics**.
- The initial release will be **free-to-play**, with the potential for **premium content in future versions**.

---

## 4.4 User Requirements  

User requirements focus on player expectations, accessibility, and interaction design.

### 4.4.1 User Interaction Expectations  
- Players should have **full control over their character’s progression, inventory, and decision-making**.
- AI should react **dynamically** to player choices, ensuring a unique experience in every session.
- Players must be able to **track stats, save progress, and resume gameplay easily**.

### 4.4.2 Accessibility Features  
- **Adjustable text size** and **color contrast settings** to accommodate visual impairments.
- **Audio cues and subtitles** for players with hearing impairments.
- **Customizable controls** for different playstyles and mobility needs.
- **Support for screen readers** where applicable to assist visually impaired players.


# 5. Requirement Characteristics  

This section outlines the key characteristics that all requirements in this document must adhere to, ensuring clarity, feasibility, and prioritization.

## 5.1 Clear  
- Each requirement must be **precisely defined** to avoid misinterpretation.  
- The language should be **simple and direct**, avoiding technical jargon unless necessary.  
- Example: Instead of "Players should have a way to manage their game state," use "Players must be able to save and load their game progress."  

## 5.2 Unambiguous  
- Requirements should be **interpreted in only one way** to prevent confusion.  
- Avoid vague terms like *"should be fast"*, instead specify: *"The game should have a response time of under 200ms for all interactions."*  
- Use concrete descriptions with **quantifiable criteria** where applicable.  

## 5.3 Limited in Scope  
- Each requirement must be **specific and achievable within the project's constraints**.  
- Features outside the defined scope (e.g., VR support) should be explicitly excluded to maintain focus.  
- Requirements should align with **realistic development timelines and technical feasibility**.  

## 5.4 Consistent  
- Requirements should **not contradict each other** or introduce conflicting expectations.  
- Functional, nonfunctional, business, and user requirements must align to ensure a **cohesive game experience**.  
- Example: If "Players can create their own character" is a requirement, another requirement should not restrict this by forcing predefined characters.  

## 5.5 Verifiable  
- Each requirement must be **measurable and testable**, ensuring that it can be validated.  
- Use **specific metrics** where applicable (e.g., "The AI should generate new quests in under 3 seconds.").  
- Requirements should allow for automated testing, manual validation, or objective evaluation.  

## 5.6 MoSCoW Prioritization  
The **MoSCoW method** is used to categorize requirements based on their importance:

- **Must Have** – Critical requirements that are essential for the game’s core functionality.
  - Example: "Players must be able to save and load their progress."
  
- **Should Have** – Important features that enhance gameplay but are not essential for the initial release.
  - Example: "Players should have an in-game journal to track completed quests."

- **Could Have** – Features that would be nice to include but are lower priority.
  - Example: "Dynamic weather effects could enhance immersion."

- **Won't Have (for now)** – Features that are explicitly out of scope but may be considered in future updates.
  - Example: "The game will not support VR integration at launch."

By following these characteristics, the development team ensures that all requirements are **well-defined, achievable, and properly prioritized** for implementation.

# 6. MoSCoW Analysis  

The MoSCoW method categorizes requirements into four priority levels: **Must Have**, **Should Have**, **Could Have**, and **Will Not Have**. This ensures a structured development approach, focusing on critical features while acknowledging potential future enhancements.

## 6.1 Must Have  
These are the **critical features** required for the game to function. Without them, the core experience would be incomplete or unplayable.

- **User Authentication & Profile Management** – Players must be able to create accounts, log in, and manage their profiles.
- **Character Creation & Customization** – Players must be able to create, name, and modify their characters.
- **Multiplayer Connectivity** – The game must support real-time multiplayer interactions.
- **AI-Generated Content** – The AI must dynamically create quests, NPC interactions, and world elements.
- **Game Progression & Saving** – Players must be able to save and load their game progress.
- **Combat System** – The game must include an interactive combat system (turn-based or real-time).
- **Game Master Role** – The Game Master must have tools to modify rules and events in real time.
- **Dynamic Storytelling** – The AI must adapt the game’s narrative based on player choices.
- **Cross-Device Accessibility** – The game must be playable via web browsers on desktops, tablets, and smartphones.
- **Security & Data Protection** – User authentication and data must be securely managed.

## 6.2 Should Have  
These are **important features** that enhance the experience but are not mandatory for the initial release.

- **In-Game Economy** – Players should be able to earn and spend in-game currency.
- **AI-Controlled Party Members** – AI companions should assist players in battles.
- **Game Watcher Role** – Spectators should be able to interact with the game through minor influence.
- **Achievements & Progress Tracking** – Players should be able to unlock achievements and track stats.
- **Genre Customization** – Players should be able to select different game themes (Fantasy, Cyberpunk, Horror, etc.).
- **Multiple Save Slots** – Players should be able to manage multiple saved games.
- **Day/Night Cycle** – The game world should transition between different times of day.
- **Weather Effects** – AI should introduce environmental changes like rain or fog.
- **Character Animations** – Character actions should be visually represented with animations.

## 6.3 Could Have  
These are **non-essential features** that would improve immersion or engagement but can be added in later updates.

- **Voice Chat or Text Chat** – Players could communicate in real-time within the game.
- **Advanced AI Learning** – The AI could learn from past player choices to improve future interactions.
- **Crafting System** – Players could combine resources to create items.
- **Customizable UI** – Players could modify the interface layout and HUD.
- **Player-Owned Housing** – Players could own and decorate in-game spaces.
- **Expanding Game Master Controls** – More advanced tools for world customization.
- **Minigames & Side Activities** – Additional small-scale challenges within the game.

## 6.4 Will Not Have  
These are **out-of-scope features** for the current development cycle but may be considered in future iterations.

- **VR & AR Support** – The game will not support virtual reality or augmented reality at launch.
- **Console Versions** – The game will not have versions for PlayStation, Xbox, or Switch.
- **Blockchain Integration** – No NFTs, crypto-based transactions, or blockchain rewards.
- **Fully Scripted Campaigns** – The game will not have pre-written storylines; it relies on AI-driven storytelling.
- **Pay-to-Win Mechanics** – There will be no in-game purchases that give competitive advantages.
- **Licensed Content** – The game will not include characters or settings from copyrighted franchises.

This **MoSCoW prioritization** ensures that the most critical elements are implemented first, while future updates may introduce additional enhancements.

7. **User Stories**

here are some potential user stories 

##### Player 

- As a player, I want to choose from multiple options or do my own thing so that I can be led or choose my own way

- As a player, I want to be able to read the text clearly so that I can understand what’s going on 

- As a player, I want to be able to save my spot and go back to it so that if my game gets cut short it’s not over

- As a player, I want to customize my character so that I feel like I’m in control 

- As a player, I want to be able to roll a random dice so that I can have a stronger attack 

- As a player, I want to be able to choose the theme of the game so that it’s more what I like 

- As a player, I want to be able to have options from the chest I choose so that I have a sense of control 

- As a player, I want to choose my characters name so that it matches the other characters that I play as

- As a player, I want to be able to save my character so that I can play with him later 

- As a player, I want to be able to save the game so that I can show my friends 

- As a player, I want to be able to upgrade my items so that they are stronger 

- As a player, I want to be able to see my stats at all times so I can see where I am at 

- As a player, if I want to have multiple characters I want to be able to log in and choose who I am playing as so that I can level up different characters 

- As a player, I should be able to see what’s currently going on but I don’t want to see the whole game so that it’s not a mess to look at 

- As a player, I want to interact with NPC's so that I can gather information and progress in the story. 

- As a player, i want to craft items using resources i find so that i can enhance my game play abilities. 

- As a player, I want to participate in team challenges to that we can come to gether as a team and do more than just what one person is capable 

- As a player, I want to explore hidden areas so that i can discover unique items or quests. 

- As a player, I want to have a journal that logs quests so that i can easily track my progress

- As a player, I want to engage in moral dilemmas so that my choices influence the story. 

- As a player, I want to be able see where I have been so that I can see where I want to go. 

- as a player, I want to unlock achievements so that i can feel a sense of accomplishments. 

##### Game Master  
this is not set in stone but the game master could just be the leader of the group 

- As a game master, I want to set the difficulty level of the game so that it matches the players’ skill levels.

- As a game master, I want to modify game rules mid-session so that I can adapt to unexpected situations.

- As a game master, I want to introduce unique challenges so that I can keep the game engaging.

- As a game master, I want to oversee players’ stats so that I can guide them when needed.

- As a game master, I want to veto certain actions so that I can maintain balance in the game.

- As a game master, I want to communicate privately with the AI so that I can adjust scenarios without players knowing.

- As a game master, I want to rewind or replay events so that I can fix mistakes or try different outcomes.

- As a game master, I want to enable special effects (e.g., weather changes or surprise events) so that I can make the game more immersive.


##### Game Watcher 

- As a game watcher, I want to drop valuable items into the game so that I can help the players.

- As a game watcher, I want to trigger random events so that I can add excitement to the game.

- As a game watcher, I want to become a ghost so that I can interact with players in a fun and unpredictable way.

- As a game watcher, I want to challenge players with puzzles or traps so that I can test their skills.

- As a game watcher, I want to observe the players’ stats so that I can plan my interactions effectively.

- As a game watcher, I want to use a spectator mode so that I can see the game without distracting the players.

- As a game watcher, I want to reward players with in-game currency so that I can encourage teamwork or creativity.

- As a game watcher, I want to activate humorous events so that I can entertain everyone.

##### AI bot 

- As an AI bot, I want to mimic human decision-making so that I can provide a realistic gameplay experience.

- As an AI bot, I want to adapt my behavior based on the player’s actions so that the game feels dynamic.

- As an AI bot, I want to collaborate with players in battles so that I can assist them in difficult scenarios.

- As an AI bot, I want to roleplay my character so that I can contribute to the story.

- As an AI bot, I want to respond to dialogue choices so that I can participate in conversations.

- As an AI bot, I want to manage my own inventory so that I can play the game like a real player.

- As an AI bot, I want to compete with players in mini-games so that I can provide additional challenges.

- As an AI bot, I want to remember past interactions so that I can make consistent choices in the story.


8. **Use Case UML Diagrams**
   - Explanation of Use Case Diagrams
   - Number of Diagrams Required (Minimum 2)
   - Formatting Guidelines for UML Diagrams

# 9. Common Mistakes to Avoid  

This section highlights common pitfalls in requirements gathering and documentation to ensure clarity, feasibility, and completeness.

## 9.1 Focus on the Problem, Not the Solution  
- Requirements should describe **what** the system needs to achieve, not **how** it will be implemented.  
- Example of a mistake: *"Use a MySQL database to store player data."*  
- Correct approach: *"The system must securely store and retrieve player data with efficient performance."*  
- **Why?** Specifying a particular technology too early may limit flexibility and prevent optimal solutions.

## 9.2 Include All Requirement Types  
- Requirements should cover **functional, nonfunctional, business, and user needs** to provide a comprehensive roadmap.  
- Example of a mistake: Only defining gameplay mechanics without addressing **security, performance, and scalability**.  
- **Why?** Omitting nonfunctional requirements can lead to unexpected performance bottlenecks and security risks.

## 9.3 Intent vs. Implementation  
- Clearly separate **high-level goals (intent)** from **technical implementation details**.  
- Example of a mistake: *"The combat system must use a physics-based attack calculation with ragdoll mechanics."*  
- Correct approach: *"The combat system should provide dynamic and realistic attack interactions."*  
- **Why?** Developers should have the flexibility to choose the best implementation while meeting the intended goals.

## 9.4 Avoid Vague Requirements  
- Requirements must be **specific, measurable, and testable** to ensure they can be validated.  
- Example of a mistake: *"The game should be fast."*  
- Correct approach: *"The game should maintain a response time of under 200ms for all player interactions."*  
- **Why?** Vague requirements lead to misinterpretation and inconsistent expectations between stakeholders.

By avoiding these common mistakes, the requirements document remains **clear, actionable, and adaptable** throughout the development process.

10. **Markdown & Documentation Best Practices**
   - Ensuring Proper Formatting in Markdown
   - Reviewing the Document in PyCharm, VSCode, or GitLab Before Submission
   - Improving Readability for Non-Technical Stakeholders
   
11. **Conclusion & Next Steps**
   - Team Responsibilities for Completion
   - Submission Deadlines
   - Revision & Feedback Process

