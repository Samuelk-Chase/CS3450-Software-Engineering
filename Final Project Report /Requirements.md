## Business Requirements
The following business requirements will be used to increase revenue and overall player count for the customer. These requirements will help business operators make decisions and improve the business side of the game.

### Implementation Status
<span style="color: green">

In version 1.0, the following business requirements were implemented:
* Basic user account system with secure authentication
* Simple progression system based on card collection
* Basic analytics tracking for user engagement
* Core gameplay mechanics without monetization
* Basic security measures for user data

</span>

The following were not implemented in version 1.0:
* Advanced analytics and data retrieval
* Monetization features
* Multi-language support
* Accessibility features
* Social media integration
* Community features
* Advanced retention strategies

### Analytics
The program should store information about users and how they engage with the platform. The following information should be tracked and sent to a separate business server for analyzing the data. This data will serve to inform business operators of demographics to target, features that will increase play time and player count, and the overall health of the game.

  * ***User Engagement:*** The program should keep track of users' time spent in activities such as single-player experiences, multiplayer, and co-op experiences within the game.

  * ***User Spending:*** The program should keep track of the user's monetary transactions within the game. It should store when, how much, and what the user spent money on. 

  * ***User Information:*** The program should keep track of user demographic info such as location, age, and hardware.

  * ***Player Count:*** The program should keep track of the number of active players per day.
    
  * ***Data Retrieval***: Business operators should be able to download data into common data formats such as .xlsx and Json for analysis.

### Implementation Status
<span style="color: green">

The following analytics features were implemented:
* Basic user engagement tracking (time spent in game)
* Simple player count tracking
* Basic user information storage

</span>

The following were not implemented:
* Detailed user spending tracking
* Advanced demographic tracking
* Data export functionality
* Business analytics dashboard

### User Acquisition Strategy:
A variety of strategies will be executed to increase user acquisition. 

* ***Search Engine Optimization (SEO):*** The game's website and app store listings should be optimized with targeted keywords to rank higher in search results.

* ***User Targeted Ads:*** User analytics should be used to target ads towards the demographic of people who play the game the most such as RPG enjoyers, Card game enjoyers, and other groups identified by game analytics.

* ***Multiplayer:*** The game should include multiplayer elements such as co-op battles and player versus player battles to encourage friends to buy the game.

* ***Referrals:*** The game should offer rewards such as loot boxes for current users for each new user they get to sign up.

*  ***New User Rewards:*** The game should offer in-game incentives such as loot boxes for new users who join.

*  ***Language Support:*** The game should be able to support multiple languages to reach a broader audience.

*  ***Accessibility:*** The game must adhere to accessibility standards, such as support for screen readers, text-to-speech, and customizable font sizes to reach a broader audience.

*  ***Platform Access***: The game should be built on a widely accessible platform like the web or multiple platforms to maximize access to the game.

### Implementation Status
<span style="color: green">

The following acquisition features were implemented:



</span>

The following were not implemented:
* SEO optimization
* Targeted advertising
* Advanced referral rewards
* Language support
* Accessibility features
* Multi-platform support
* Basic multiplayer functionality


#### Community Building
As part of user acquisition, the game should deploy a variety of features to foster a strong community for the game which will in return attract more players.

* ***Single Player Leaderboard:*** The game should provide a global leaderboard that tracks the fastest time through the single-player campaign to foster a speed-running community. 

* ***Multi-Player Leaderboard:*** The game should provide a multiplayer leaderboard, tracking the most wins and win percentage to encourage a competitive scene.

* ***Social Media Engagement:*** Social media channels should be created and regularly updated with content such as sneak peeks, gameplay trailers, updates, and community engagement. These accounts should be accessible from the game's main website.

*  ***Community Promotion:*** The official site should promote community content such as YouTube videos and Twitch streams to build a healthy community.
  
### Implementation Status
<span style="color: green">

The following community features were implemented:


</span>

The following were not implemented:
* Advanced leaderboards
* Social media integration
* Community content promotion
* Community events


### User Retention Strategy
A variety of strategies and features should be deployed to encourage players to continue playing the game.

 * ***Daily and Weekly Challenges:***	Offer daily and weekly challenges that reward players with bonuses such as experience points, currency, or unique cards. These challenges should be worthwhile for the player to encourage players to return regularly.
   
 * ***Achievement System:***	The game should offer an extensive achievement system where players can unlock milestones, titles, and special rewards based on their progress and accomplishments to encourage more playtime.
  
 * ***Progression System:*** The game should implement level-based progression where players unlock new gameplay features, cards, and things to do.
  
 * ***In-Game Events:*** The game should host limited-time events that feature exclusive content, challenges, or storylines. These events can encourage players to log in and participate during a specific time window.
   
 * ***Push Notifications:***	The game should utilize push notifications and emails to remind players of upcoming events, challenges, and important updates. Offer incentives like bonus rewards for logging in after a period of inactivity.

### Implementation Status
<span style="color: green">

The following retention features were implemented:
* Basic progression system
* Card collection mechanics
* Simple achievement system

</span>

The following were not implemented:
* Daily/weekly challenges
* Push notifications
* In-game events
* Advanced achievement system

### Quality Control and Feedback:
The program should provide a method for users to give feedback to improve the program and user experience.

* ***Bug reporting:*** Players should be able to report bugs and issues they come across in the game.

* ***Game Feedback:*** Players should have the option in the game to send feedback for improvements.

* ***Activity Feedback:*** When new features or gameplay mechanics are introduced the user should be prompted to rate the experience and send feedback if necessary.

### Implementation Status
<span style="color: green">

The following feedback features were implemented:


</span>

The following were not implemented:
* Advanced feedback collection
* User experience surveys
* Automated feedback analysis
* Basic bug reporting system
* Simple game feedback mechanism

### Monetization:
The game should employ a variety of monetization options.

* ***Paid Model:*** Players should pay for the game using a payment service such as Stripe. 

* ***Free Demo:*** A free demo should be offered for players to try the game for free by playing through 2 boss battles. After the trial expires they should be prompted to upgrade to the full paid version of the game.

* ***In-Game Monetization***: The game should not have micro-transactions. The game should allow players on the free trial to buy the full game in-game and should be built to allow future DLC content to be bought in-game as well as on other platforms it is built on.

### Implementation Status
<span style="color: green">

The following monetization features were implemented:
* None - monetization was deferred to future versions

</span>

### Scalability
The game should be built to allow growth in users and experiences:

* ***Data-base***: The database must be capable of scaling to millions of players. 

* ***Game experiences***: The game should allow for easy implementation of future content such as DLCs and special events.

* ***Servers***: Game Servers must be able to handle high traffic as much as 1 million concurrent players at a time.

### Implementation Status
<span style="color: green">

The following scalability features were implemented:
* Basic database structure for user data
* Simple server architecture

</span>

The following were not implemented:
* Advanced database scaling
* High-traffic server optimization
* Content management system

### Security
User information and game services should be secure

* ***System Authorization:*** The system should only be accessible to authorized employees such as software engineers and business operators. The system should employ some employee verification system (employee sign-in) allowing only authorized personnel to access the site.

* ***User Account Security:***: User's accounts must be secured through username and password. Passwords and emails must not be in plain text and must be encrypted.
  
 * ***User Data:*** Personal user data should be encrypted and user data for analytics should be anonymized. Data storage should comply with data protection regulations.

### Implementation Status
<span style="color: green">

The following security features were implemented:
* Basic user authentication
* Password encryption
* Simple authorization system

</span>

The following were not implemented:
* Advanced system authorization
* Data anonymization
* Compliance with data protection regulations

### Business Requirements MoSCoW Analysis:
For version 1.0 of our project, we will largely focus on the main core single-player experience, so many of our business requirements will not be prioritized until the base gameplay of our game is finished. If must have business requirements conflict with core game requirements we will prioritize the game requirements and focus on business requirements in version 2.0.

#### Must-Have:

* ***Progression features:*** We will have some progression system in version 1.0 that will allow users to feel like they are making progress. To begin this will be based on card collection. Other progression features will be treated as could haves for version 1.0.

* ***Paid Model:*** We will prioritize the paid model over all other monetization options since the customer wants to make money from the game. This implementation should be easier to implement than others and is a generally accepted monetization model. 

* ***User Data Security:*** We will prioritize protecting user data.

* ***User Account Security:*** We will require users to create an account with a username, email, and password to sign in. Passwords and emails will be encrypted.
  
#### Should-Have:

* ***Multiplayer:*** We believe this is an important aspect of creating a fun game people can play. Multiplayer will help with user retention and recruiting new players, but we want the core single-player gameplay to be prioritized first since it makes up the bulk of the customer's wants. If single-player is polished we will move to Multiplayer implementation next.
  
* ***System Authorization:*** Before the product ships we should have some form of system authorization. However, because we are mostly focused on core gameplay we anticipate system authorization will not be highly prioritized until the core game is built. System authorization during this initial development cycle will be handled through Git Hub.

* ***Database Scalability:*** Our database should be able to scale. Since gameplay is the most important we won't prioritize this as high, but we believe we can implement a scalable database to account for a growing player base.


#### Could-Have:
* ***Leaderboards:*** Leaderboards could be implemented, but are likely more suitable after core gameplay features and mechanics are implemented. The game should be fun to play before trying to build a competitive scene.
  
* ***Analytics:*** We could implement a way to track user information for analytic purposes as that would be helpful for the business owner to make decisions, but we don't expect this will be in version 1.0. We want the game to be playable before we worry about collecting data for business decisions.

* ***User Acquisition:*** While user acquisition will be key for the game to be popular in the long term, we want to prioritize making the game playable and fun before implementing new ways to gain players. Focusing on making the core gameplay fun will be far more productive in enticing new players than trying other methods of recruitment. Multiplayer will be prioritized over other user acquisition strategies since it is gameplay-based but will come second to the single-player base game. If single-player and multiplayer are implemented we will move on to adding some of the feature requirements listed in the User Acquisition section to begin to expand the player base, but we don't expect these will be in version 1.0.

* ***Achievement System:*** An achievement system would be a great feature to retain players and increase playtime, but will not be prioritized over core gameplay mechanics. This likely will be in version 2.0.

* ***Bug reporting and Game Feedback:*** Bug reporting and game feedback will be crucial in maintaining the game, but we don't expect this to be present in version 1.0. While reporting/feedback likely won't be integrated straight into the game in this version, the business can rely on emails and app store feedback if used until these features are implemented.

* ***Social Media:*** If by the end of this development phase, the game is ready to launch, creating social media channels will be important in community building and advertising. Our focus is on the game itself so social media will not be as highly prioritized until we have a finished product to build a community around.

* ***Scalable Server:*** The server should be scalable, but we are more interested in making sure the game functions. Server capacity can be upgraded after the game is built and players start to join.

  
  
#### Won't Have:

* ***Localization:*** The game won't have support for other languages in version 1.0, but may become available in other languages after core gameplay has been implemented. Our focus for this cycle will be to target the English-speaking audience.

*  ***Accessibility:*** Accessibility is important but our focus will be on making the game playable for version 1.0. As the game becomes more polished we can begin to add accessibility features to broaden our audience in Version 2.0.

* ***In-game Monetization***: We will not be implementing in-game monetization for this version since we don't have any DLC content as the base game has not yet been developed. We will provide an option to pay for the game, but it likely won't be built directly into the game itself until future versions.

* ***Push Notifications, Daily and Weekly Challenges, In-game Events:*** These retention features may be prioritized in future versions of the game to retain the player base, but will not be implemented in version 1.0 since improving the core game experience will be the best way to retain new players in the games infancy.

* ***Game Content Scalability:*** We think it is important to build a game that makes adding new content easy, but we are focused on the main gameplay at this time. Also, AI implementation in the game should add a fresh experience that will allow the need for new content to be minimized in the future.

* ***Platform Access:*** The focus on version 1.0 will be game mechanics so we will develop for only one platform. We will choose a popular platform to reach a larger audience. If successful the game could be expanded to other platforms in version 2.0.



Note: Chat-GPT was used to generate some of the ideas for business requirements. It also wrote a few requirements such as SEO requirements, Social media Campaigns, Accessibility, Language,  and a lot of user retention strategies.


#### Business Operator User Stories:

* As a business operator, I want data for analytics so that I can better understand how users are playing the game and make good decisions for the game in the future.

* As a business operator, I want user feedback so that I can make decisions that will improve the game and increase revenue.

* As a business operator, I want to monetize the game so that I can make money.

* As a business operator, I want to advertise the game so that more games are bought and I can make money.

* As a business operator, I want to develop a community for the game so that player acquisition is cheaper and more organic.

* As a business operator, I want to increase playtime in-game so that I can make more money.

* As a business operator, I want data to be secure so that customers trust the game and I don't get sued.

# Functional Requirements
### Singleplayer Gameplay
* **Text Based Prompting**
    * Players can freely respond to AI generated elements and control their character using text entry.
* **Deckbuilding Mechanics**
    * Players must be able to create and manage a deck of cards, including adding, upgrading, and removing cards.
    * Card effects must support a variety of well-defined mechanics (e.g., attack, defense, buffs, debuffs, healing).
* **Roguelike Progression**
    * Procedurally generated campaigns with branching paths.
    * Encounters include battles, events, merchants, rest points, and elite challenges/bosses.
    * Permanent death upon losing all health, requiring players to begin a new run.
* **Dynamic Difficulty Adjustment**
    * AI analyzes player performance during runs (e.g., success rate, health, card synergy) to dynamically adjust encounter difficulty.
    * Gradual increase in difficulty as the player progresses further into a run.
* **Consistent Theme**
    * Players choose a theme at the start of a run (e.g., cyberpunk, fantasy, horror), and AI generates content tailored to that theme.
    * Thematic variations in cards, artwork, events, and environments.

### Implementation Status
<span style="color: green">

The following singleplayer features were implemented:
* Text-based prompting system
* Basic deckbuilding mechanics
* Simple roguelike progression
* Basic difficulty adjustment
* Theme-based content generation

</span>

The following were not implemented:
* Advanced difficulty scaling
* Complex branching paths
* Advanced event system

### AI-Driven Content Generation
* **Dynamic Card Generation**
    * AI generates new cards during gameplay, considering the theme, player preferences, and progression.
    * AI ensures generated cards are balanced and fit within the player's deck strategy.
* **Event and Scenario Creation**
    * AI creates random in-game events with unique choices and consequences.
    * Scenarios are designed to match the player's theme and adapt to their playstyle.
* **Enemy Scaling**
    * AI generates enemies with abilities, stats, and strategies that match player progression and deck strength.
* **Story Generation**
    * AI crafts narrative elements, including text for events, environment descriptions, and artwork.

### Implementation Status
<span style="color: green">

The following AI features were implemented:
* Basic card generation
* Simple event creation
* Basic enemy scaling
* Simple story generation

</span>

The following were not implemented:
* Advanced card balancing
* Complex scenario creation
* Advanced story branching

### User Interface (UI) and Experience (UX)
* **Deck Management UI**
    * Visual interface to browse, upgrade, and remove cards.
    * Clear definitions of card stats and effects.
* **Battle UI**
    * Real-time display of player health, enemy stats, and the current turn's effects.
    * Drag-and-drop or click-to-play functionality for cards.
* **Progression Map**
    * Interactive map showing branching paths with symbols representing upcoming encounters.
    * Highlights player-selected paths and their consequences.

### Implementation Status
<span style="color: green">

The following UI/UX features were implemented:
* Basic deck management interface
* Simple battle UI
* Basic progression tracking

</span>

The following were not implemented:
* Advanced inventory system
* Dynamic map interface
* Advanced visual effects

### Analytics and Player Feedback
* **Player Performance Tracking**
    * System records data such as win/loss ratios, frequently used cards, and preferred themes.
* **Session Summaries**
    * At the end of a run, players receive detailed statistics, including enemies defeated, cards played, and progress made.
* **Feedback Mechanism**
    * Players can rate generated cards, events, and scenarios to refine future AI-generated content.

### Implementation Status
<span style="color: green">

The following analytics features were implemented:


</span>

The following were not implemented:
* Advanced analytics
* Detailed performance metrics
* Complex feedback analysis
* Basic performance tracking
* Simple session summaries
* Basic feedback collection

### Multiplayer
* **PvP Mode**
    * Players can challenge others with decks that are saved from previous runs.
* **Co-op Mode**
    * Players can play through campaigns together
* **Leaderboards**
    * Global leaderboards for top scores, runs completed, and unique achievements.

### Implementation Status
<span style="color: green">

The following multiplayer features were implemented:


</span>

The following were not implemented:
* Advanced multiplayer modes
* Complex leaderboard system
* Advanced matchmaking
* Basic co-op functionality
* Simple PvP system

### Meta-Progression
* **Persistent Upgrades**
    * Option for players to invest in permanent upgrades that improve starting conditions for future runs.
    * Players can save cards or decks that they particularly enjoy.

### Implementation Status
<span style="color: green">

The following meta-progression features were implemented:
* Basic card collection
* Simple deck saving

</span>

The following were not implemented:
* Advanced persistent upgrades
* Complex progression systems
* Advanced deck management

## MoSCoW Analysis
### Must Have: 
* Deckbuilding and Roguelike Mechanics
* AI-driven story generation
* AI-driven card generation
* AI-driven artwork generation
* Battle UI
* Text entry to control character and prompt AI
* AI generated theme based on player preferences
### Should Have: 
* AI-driven adaptive difficulty
* Multiplayer Co-op mode
* Persistent upgrades
* UI-based inventory
### Could Have: 
* PVP Multiplayer
* Dynamic map
