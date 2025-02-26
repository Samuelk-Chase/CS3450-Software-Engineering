// src/pages/MainPlayerView.tsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import '../css/MainPlayerView.css'
import characterImage from '../images/Bruce-Wayne-the-Batman-Elden-Ring-Character-Face.jpg';
import { ScrollPanel } from 'primereact/scrollpanel';

const MainPlayerView: React.FC = () => {
  const { character } = useContext(GameContext);
  const navigate = useNavigate();
  
  const [decision, setDecision] = useState('');

  const handleOpenChest = () => {
    alert('Chest opened! You found some loot.');
    // Add logic to add new cards or items if needed
  };

  const handleViewDeck = () => {
    navigate('/deck');
  };

  const handleEnterBossFight = () => {
    navigate('/boss');
  };

  const handleDecisionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDecision(e.target.value);
  };

  const handleSubmitDecision = () => {
    alert(`Decision submitted: ${decision}`);
    setDecision('');
  };

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <h1>BEAN BOYS - The Last Game (Level 5)</h1>
      </div>

      {/* Main Container: Two Columns */}
      <div className="main-container">

        {/* LEFT PANEL: Player Stats & Actions */}
        <div className="left-panel">
          <div className="player-info">
            <img src={characterImage} alt="Warmonger Warrior" />
            <div className="player-details">
              <strong>{character?.name ?? 'Warmonger'}: Warrior</strong>
              <div className="health-mana-bars">
                <div className="bar-container">
                  <div className="bar-fill health-bar-fill"></div>
                </div>
                <div className="bar-container">
                  <div className="bar-fill mana-bar-fill"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Deck, Chest, and Boss Fight Buttons */}
          <button className="view-deck-button" onClick={handleViewDeck}>
            View Deck
          </button>
          <button className="action-button" onClick={handleOpenChest}>
            Open Chest
          </button>
          <button className="action-button" onClick={handleEnterBossFight}>
            Enter Boss Fight
          </button>
        </div>

        {/* RIGHT PANEL: Story & Decision Input */}
        <div className="right-panel">
          <div className="story-container">
            <h2>Dungeon Quest: "The Forgotten Depths"</h2>
            <p>Players: Alice (Warrior, Level 5), Bob (Ranger, Level 5), etc.</p>
            <p>[Session Start]</p>
            {/* Primereact scrollpanel to handle large amounts of context
            We can also increase font size for better readability, while keeping
            content within designated area */}
            <ScrollPanel style={{ width: '100%', height: '200px' }}>
            <p>
              Alice: "Alright team, let's breach these ancient doors. Stay alert."<br />
              Bob: "I'm going to head on the left—silent steps, quick approach."<br />
              Charlie: "I'll get the spells primed. Let's light these torches."<br />
              ...
            </p>
            {/* More story content can be appended dynamically */}
            </ScrollPanel>
            
          </div>

          <div className="action-row">
            <input
              type="text"
              placeholder="Enter decision here"
              value={decision}
              onChange={handleDecisionChange}
            />
            <button className="action-button" onClick={handleSubmitDecision}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPlayerView;