import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import { ProgressSpinner } from 'primereact/progressspinner';
import '../css/BossFightView.css';
import playerImage from '../images/Bruce-Wayne-the-Batman-Elden-Ring-Character-Face.jpg';
import CardView from './DeckOverlayPage'; // 📌 Import the modal-style deck viewer

const BossFightPage: React.FC = () => {
  const { character, updateStats } = useContext(GameContext);
  const navigate = useNavigate();
  const location = useLocation();

  const { boss } = location.state || {};

  const [bossHealth, setBossHealth] = useState<number>(boss?.health ?? 100);
  const [maxBossHealth, setMaxBossHealth] = useState<number>(boss?.health ?? 100);
  const [maxPlayerHealth, setMaxPlayerHealth] = useState<number>(character?.health ?? 100);

  const [bossImage, setBossImage] = useState<string>('');
  const [bossNameInput, setBossNameInput] = useState<string>(boss?.name || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeckOpen, setIsDeckOpen] = useState<boolean>(false); // ✅ Controls deck modal

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

  const handleGenerateBossImage = async () => {
    if (bossNameInput.trim() === "") return;
    setLoading(true);
    try {
      const imgDataUrl = await fetchBossImage(bossNameInput);
      setBossImage(imgDataUrl);
    } catch (error) {
      console.error("Failed to generate boss image:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!boss) return;

    setBossHealth(boss.health ?? 100);
    setMaxBossHealth(boss.health ?? 100);
    setBossNameInput(boss.name ?? '');
    setMaxPlayerHealth(character?.health ?? 100);

    const autoGenerateImage = async () => {
      setLoading(true);
      try {
        const imgDataUrl = await fetchBossImage(boss.name);
        setBossImage(imgDataUrl);
      } catch (error) {
        console.error("Auto-generation failed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (boss.name) {
      autoGenerateImage();
    }
  }, [boss, character]);

  const handleAttack = () => {
    setBossHealth((prev) => Math.max(prev - 10, 0));
    if (character) {
      const newMana = Math.max(character.mana - 5, 0);
      const newHealth = Math.max(character.health - 7, 0);
      updateStats(newHealth, newMana);
    }
  };

  const handleBackToMain = () => {
    navigate('/main');
  };

  return (
    <div className="boss-fight-container">
      {loading && (
        <div className="loading-container">
          <ProgressSpinner style={{ width: '100px', height: '100px' }} strokeWidth="5" />
          <div className="loading-text">Generating boss image...</div>
        </div>
      )}

      {isDeckOpen && <CardView onClose={() => setIsDeckOpen(false)} />}

      <div className="fight-area">
        <div className="player-side">
          <img src={playerImage} alt="Player" className="character-img" />
          <h3 className="character-name">{character?.name ?? 'Warmonger'}</h3>
          <div className="health-bar-container">
            <div className="health-bar-background">
              <div
                className="health-bar-fill"
                style={{
                  width: `${((character?.health ?? 100) / maxPlayerHealth) * 100}%`,
                }}
              ></div>
              <span className="health-bar-text">
                {character?.health ?? 100} / {maxPlayerHealth}
              </span>
            </div>
          </div>
        </div>

        <div className="vs-text">VS</div>

        <div className="boss-side">
          {bossImage ? (
            <img src={bossImage} alt="Boss" className="character-img" />
          ) : (
            !boss?.name && (
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
            )
          )}
          <h3 className="character-name">{(boss?.name ?? bossNameInput) || 'Dark Fiend'}</h3>
          <div className="health-bar-container">
            <div className="health-bar-background">
              <div
                className="health-bar-fill"
                style={{ width: `${(bossHealth / maxBossHealth) * 100}%` }}
              ></div>
              <span className="health-bar-text">
                {bossHealth} / {maxBossHealth}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stats-box player-stats">
          <h3>{character?.name ?? 'Warmonger'} Stats</h3>
          <p><strong>Health:</strong> {character?.health ?? 100}</p>
          <p><strong>Mana:</strong> {character?.mana ?? 100}</p>
          <p><strong>Strength:</strong> 15</p>
          <p><strong>Defense:</strong> 12</p>
          <p><strong>Speed:</strong> 10</p>
          <p><strong>Critical Hit Chance:</strong> 5%</p>
          <p><strong>Fire Resistance:</strong> 20%</p>
        </div>

        <div className="stats-box boss-stats">
          <h3>{(boss?.name ?? bossNameInput) || 'Dark Fiend'} Stats</h3>
          <p><strong>Health:</strong> {bossHealth}</p>
          <p><strong>Mana:</strong> {boss?.mana ?? '???'}</p>
          <p><strong>Strength:</strong> 25</p>
          <p><strong>Defense:</strong> 18</p>
          <p><strong>Speed:</strong> 8</p>
          <p><strong>Poison Damage:</strong> 10 per turn</p>
          <p><strong>Shadow Resistance:</strong> 40%</p>
        </div>
      </div>

      <div className="bottom-actions">
        <button className="view-deck-button" onClick={() => setIsDeckOpen(true)}>
          View Deck
        </button>
        <button className="action-button" onClick={handleAttack}>
          Attack
        </button>
        <button className="action-button" onClick={handleBackToMain}>
          Back to Main
        </button>
      </div>
    </div>
  );
};

export default BossFightPage;