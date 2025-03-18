import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import '../css/BossFightView.css'; // Make sure to import your updated CSS
import playerImage from '../images/Bruce-Wayne-the-Batman-Elden-Ring-Character-Face.jpg';
import backgroundImage from '../images/Login background.jpg';
import bossImage from '../images/Bruce-Wayne-the-Batman-Elden-Ring-Character-Face.jpg';

const BossFightPage: React.FC = () => {
  const { character, updateStats } = useContext(GameContext);
  const navigate = useNavigate();

  const [bossHealth, setBossHealth] = useState(100);

  const handleAttack = () => {
    setBossHealth((prev) => Math.max(prev - 10, 0));
    if (character) {
      const newMana = Math.max(character.mana - 5, 0);
      updateStats(character.health, newMana);
    }
  };

  const handleViewDeck = () => {
    navigate('/deck');
  };

  return (
    <div className="boss-fight-container">
      {/* Player & Boss Layout */}
      <div className="fight-area">
        {/* Player */}
        <div className="player-side">
          <img src={playerImage} alt="Player" className="character-img" />
          <h3 className="character-name">{character?.name ?? 'Warmonger'}</h3>

          {/* Health Bar */}
          <div className="health-bar-container">
            <div
              className="health-bar"
              style={{ width: `${character?.health ?? 100}%` }}
            ></div>
          </div>
        </div>

        {/* VS in Center */}
        <div className="vs-text">VS</div>

        {/* Boss */}
        <div className="boss-side">
          <img src={bossImage} alt="Boss" className="character-img" />
          <h3 className="character-name">Dark Fiend</h3>

          {/* Boss Health Bar */}
          <div className="health-bar-container">
            <div className="health-bar" style={{ width: `${bossHealth}%` }}></div>
          </div>
        </div>
      </div>

      {/* Stats Section - Full Width */}
      <div className="stats-section">
        {/* Player Stats */}
        <div className="stats-box">
          <h3>{character?.name ?? 'Warmonger'} Stats</h3>
          <p><strong>Health:</strong> {character?.health ?? 100}</p>
          <p><strong>Mana:</strong> {character?.mana ?? 100}</p>
          <p><strong>Strength:</strong> {15}</p>
          <p><strong>Defense:</strong> {12}</p>
          <p><strong>Speed:</strong> {10}</p>
          <p><strong>Critical Hit Chance:</strong> 5%</p>
          <p><strong>Fire Resistance:</strong> 20%</p>
        </div>

        {/* Boss Stats */}
        <div className="stats-box">
          <h3>Dark Fiend Stats</h3>
          <p><strong>Health:</strong> {bossHealth}</p>
          <p><strong>Mana:</strong> ???</p>
          <p><strong>Strength:</strong> 25</p>
          <p><strong>Defense:</strong> 18</p>
          <p><strong>Speed:</strong> 8</p>
          <p><strong>Poison Damage:</strong> 10 per turn</p>
          <p><strong>Shadow Resistance:</strong> 40%</p>
        </div>
      </div>

      {/* View Deck Button - Locked to Bottom Left */}
      <div className="bottom-actions">
        <button className="view-deck-button" onClick={handleViewDeck}>
          View Deck
        </button>
      </div>
    </div>
  );
};

export default BossFightPage;