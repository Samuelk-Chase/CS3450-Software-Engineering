import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import '../css/BossFightView.css';
import playerImage from '../images/Bruce-Wayne-the-Batman-Elden-Ring-Character-Face.jpg';
// Remove hard-coded bossImage import

const BossFightPage: React.FC = () => {
  const { character, updateStats } = useContext(GameContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the boss data from the state passed via the route (if any)
  const { boss } = location.state || {};
  
  // Boss health state (default to boss.health if provided, else 100)
  const [bossHealth, setBossHealth] = useState<number>(boss?.health ?? 100);

  // NEW: State to hold the generated boss image and prompt input
  const [bossImage, setBossImage] = useState<string>('');
  const [bossNameInput, setBossNameInput] = useState<string>(boss?.name || '');

  // NEW: Function to fetch boss image based on boss name prompt
  const fetchBossImage = async (prompt: string) => {
    const requestBody = { prompt };
    const response = await fetch("http://localhost:8080/v1/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const data = await response.json();
    if (data.length > 0 && data[0].b64_json) {
      return `data:image/jpeg;base64,${data[0].b64_json}`;
    }
    throw new Error("No image data received");
  };

  // NEW: Handle generating the boss image
  const handleGenerateBossImage = async () => {
    if (bossNameInput.trim() === "") return;
    try {
      const imgDataUrl = await fetchBossImage(bossNameInput);
      setBossImage(imgDataUrl);
    } catch (error) {
      console.error("Failed to generate boss image:", error);
    }
  };

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
      {/* Fight Area */}
      <div className="fight-area">
        {/* Player Side */}
        <div className="player-side">
          <img src={playerImage} alt="Player" className="character-img" />
          <h3 className="character-name">{character?.name ?? 'Warmonger'}</h3>
          {/* Player Health Bar */}
          <div className="health-bar-container">
            <div
              className="health-bar"
              style={{ width: `${character?.health ?? 100}%` }}
            ></div>
          </div>
        </div>

        {/* VS Text */}
        <div className="vs-text">VS</div>

        {/* Boss Side */}
        <div className="boss-side">
          {/* Instead of a hard-coded boss image, display a text box and a generate button */}
          {bossImage ? (
            <img src={bossImage} alt="Boss" className="character-img" />
          ) : (
            <div className="boss-generator">
              <input
                type="text"
                placeholder="Enter boss name..."
                value={bossNameInput}
                onChange={(e) => setBossNameInput(e.target.value)}
                className="boss-input"
              />
              <button onClick={handleGenerateBossImage} className="generate-boss-button">
                Generate Boss Image
              </button>
            </div>
          )}
          <h3 className="character-name">{(boss?.name ?? bossNameInput) || 'Dark Fiend'}</h3>
          {/* Boss Health Bar */}
          <div className="health-bar-container">
            <div className="health-bar" style={{ width: `${bossHealth}%` }}></div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
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
          <h3>{(boss?.name ?? bossNameInput) || 'Dark Fiend'} Stats</h3>
          <p><strong>Health:</strong> {bossHealth}</p>
          <p><strong>Mana:</strong> {boss?.mana ?? '???'}</p>
          <p><strong>Strength:</strong> {25}</p>
          <p><strong>Defense:</strong> {18}</p>
          <p><strong>Speed:</strong> {8}</p>
          <p><strong>Poison Damage:</strong> 10 per turn</p>
          <p><strong>Shadow Resistance:</strong> 40%</p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="bottom-actions">
        <button className="view-deck-button" onClick={handleViewDeck}>
          View Deck
        </button>
        <button className="attack-button" onClick={handleAttack}>
          Attack
        </button>
      </div>
    </div>
  );
};

export default BossFightPage;