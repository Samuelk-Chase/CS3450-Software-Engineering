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

### AI-Driven Content Generation
* **Dynamic Card Generation**
    * AI generates new cards during gameplay, considering the theme, player preferences, and progression.
    * AI ensures generated cards are balanced and fit within the player's deck strategy.
* **Event and Scenario Creation**
    * AI creates random in-game events with unique choices and consequences.
    * Scenarios are designed to match the player’s theme and adapt to their playstyle.
* **Enemy Scaling**
    * AI generates enemies with abilities, stats, and strategies that match player progression and deck strength.
* **Story Generation**
    * AI crafts narrative elements, including text for events, environment descriptions, and artwork.

### User Interface (UI) and Experience (UX)
* **Deck Management UI**
    * Visual interface to browse, upgrade, and remove cards.
    * Clear definitions of card stats and effects.
* **Battle UI**
    * Real-time display of player health, enemy stats, and the current turn’s effects.
    * Drag-and-drop or click-to-play functionality for cards.
* **Progression Map**
    * Interactive map showing branching paths with symbols representing upcoming encounters.
    * Highlights player-selected paths and their consequences.

### Analytics and Player Feedback
* **Player Performance Tracking**
    * System records data such as win/loss ratios, frequently used cards, and preferred themes.
* **Session Summaries**
    * At the end of a run, players receive detailed statistics, including enemies defeated, cards played, and progress made.
* **Feedback Mechanism**
    * Players can rate generated cards, events, and scenarios to refine future AI-generated content.

### Multiplayer
* **PvP Mode**
    * Players can challenge others with decks that are saved from previous runs.
* **Co-op Mode**
    * Players can play through campaigns together
* **Leaderboards**
    * Global leaderboards for top scores, runs completed, and unique achievements.

### Meta-Progression
* **Persistent Upgrades**
    * Option for players to invest in permanent upgrades that improve starting conditions for future runs.
    * Players can save cards or decks that they particularly enjoy.

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
### Won't Have: 
