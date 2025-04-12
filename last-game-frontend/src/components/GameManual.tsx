import React from 'react';
import ReactMarkdown from 'react-markdown';
import '../css/GameManual.css';

interface GameManualProps {
  onClose: () => void;
}

const GameManual: React.FC<GameManualProps> = ({ onClose }) => {
  const manualContent = `
# Last Game - Player Manual

## Overview
Last Game is an AI-driven, dynamic roguelike deckbuilding game where your choices shape the world around you. Every playthrough is unique, with procedurally generated content that adapts to your playstyle and decisions.

### Key Features
- AI-generated worlds and stories that adapt to your choices
- Dynamic deckbuilding with unique cards
- Multiple game modes and difficulty settings
- Thematic flexibility (choose your setting: fantasy, cyberpunk, horror, etc.)
- Both single-player and multiplayer experiences

## Getting Started

### System Requirements
- Modern web browser (Chrome 90+, Firefox 90+, Safari 14+, Edge 90+)
- Minimum viewport width: 768px
- Stable internet connection

### Account Creation and Login
1. **Creating an Account**
   - Click on "Sign Up" on the login page
   - Enter your email and password
   - Click "Create Account" to register
   - Alternatively, use OAuth to log in with your Google account

2. **Logging In**
   - Enter your email and password
   - Click "Login" to access your account
   - Your progress is automatically saved

### Character Creation
1. **Creating Your Character**
   - After logging in, click "Create New Character"
   - Enter your character's name
   - Write a detailed description of your character and the adventure you want to embark on
   - Choose your preferred theme (fantasy, cyberpunk, horror, etc.)
   - Click "Create Character" and wait for your character image to generate
   - The AI will use your description to create a unique character image

## Gameplay Guide

### Starting Your Adventure
1. **Generating Your Initial Deck**
   - Once your character is created, you'll be taken to the main game view
   - Click the "Generate Deck" button to create your starting deck
   - Wait for all three cards to generate (this may take a few moments)
   - Your deck will be based on your character's description

2. **Understanding Card Types**
   - **Attack Cards**: Deal damage to enemies
   - **Ability Cards**: Perform special one-time actions
   - **Power Cards**: Apply lasting effects
   - Each card has a mana cost and unique effects

3. **Game Interface**
   - Health and mana bars at the top of the screen
   - Card hand display at the bottom
   - Text input box for story interactions
   - Combat area in the center

### Combat System
1. **Turn-Based Combat**
   - Player always goes first
   - Play cards by dragging them to the play area
   - Each card has a mana cost
   - Monitor your health and mana bars
   - End your turn when ready

2. **Card Effects**
   - **Damage**: Deal direct damage to targets
   - **Defense**: Block incoming damage
   - **Status Effects**: Apply buffs or debuffs
   - **Keywords**: Special effects with consistent rules

### Game Modes
1. **Hard Beans (Roguelike)**
   - One life per run
   - Permanent death upon defeat
   - More challenging gameplay
   - Realistic health and stamina

2. **Soft Beans (Adventure)**
   - More forgiving gameplay
   - Return to last save point upon death
   - Great for learning the game mechanics
   - Focus on story and exploration

### Multiplayer Features
1. **Co-op Mode**
   - Team up with friends
   - Share decks and strategies
   - Face challenging bosses together

2. **Competitive Mode**
   - Battle other players
   - Use your collected decks
   - Climb the leaderboards

## Advanced Strategies

### Deck Building Tips
- Balance your deck with different card types
- Consider mana costs when building your deck
- Look for card synergies
- Adapt your strategy based on the theme

### Combat Strategies
- Watch enemy attack patterns
- Time your defenses effectively
- Manage your mana resources
- Use status effects strategically

### Story Choices
- Your choices affect the world and story
- Different paths lead to unique encounters
- Some choices unlock special cards
- Build relationships with NPCs

## Troubleshooting

### Common Issues
1. **Card Generation Delay**
   - Wait a few moments for cards to generate
   - Check your internet connection
   - Refresh the page if needed

2. **Game Progress Not Saving**
   - Ensure you're logged in
   - Check your internet connection
   - Try logging out and back in

3. **Performance Issues**
   - Clear your browser cache
   - Try a different browser
   - Check your internet connection

### Need Help?
- Check the manual for detailed instructions
- Contact support through the in-game help system
- Visit our community forums for tips and strategies
- Report bugs through the in-game feedback system

## Frequently Asked Questions

Q: Can I play without an internet connection?
A: No, an internet connection is required for AI generation and progress saving.

Q: How do I get more cards?
A: Cards are earned through story progression, defeating enemies, and making specific choices.

Q: Can I change my character's theme?
A: Each run can have a different theme, but you'll need to create a new character for a new theme.

Q: Is there a way to save my favorite cards?
A: Yes, you can save cards to your collection for use in future runs.

`;

  return (
    <div className="game-manual-overlay">
      <div className="game-manual-content">
        <button className="close-manual" onClick={onClose}>×</button>
        <div className="manual-text">
          <ReactMarkdown>{manualContent}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default GameManual; 