import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/MainPlayerView.css";

interface Character {
  character_id: number;
  character_name: string;
  current_hp: number;
  max_hp: number;
  current_mana: number;
  max_mana: number;
}

const MainPlayerView: React.FC = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const characterId = localStorage.getItem("characterId");

  useEffect(() => {
    if (!userId || isNaN(Number(userId))) {
      alert("You are not logged in. Redirecting to login...");
      localStorage.removeItem("userId");
      navigate("/login");
      return;
    }

    if (!characterId || isNaN(Number(characterId))) {
      alert("No character selected! Redirecting to character selection...");
      navigate("/character-account");
      return;
    }

    const apiUrl = `http://localhost:8080/v1/character/${characterId}`;
    console.log("Fetching character details from:", apiUrl);

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.user_id !== Number(userId)) {
          alert("This character does not belong to you. Redirecting...");
          navigate("/character-account");
          return;
        }
        console.log("Fetched character:", data);
        setCharacter(data);
      })
      .catch((error) => console.error("Error fetching character:", error));
  }, [navigate, userId, characterId]);

  if (!character) {
    return <p>Loading character...</p>;
  }

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <h1>BEAN BOYS - The Last Game (Level 5)</h1>
      </div>

      {/* Main Container */}
      <div className="main-container">
        {/* LEFT PANEL: Player Stats & Actions */}
        <div className="left-panel">
          <div className="player-info">
            <div className="player-details">
              <strong>{character.character_name}</strong>
              <div className="health-mana-bars">
                <div className="bar-container">
                  <div
                    className="bar-fill health-bar-fill"
                    style={{
                      width: `${(character.current_hp / character.max_hp) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="bar-container">
                  <div
                    className="bar-fill mana-bar-fill"
                    style={{
                      width: `${(character.current_mana / character.max_mana) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <button className="view-deck-button" onClick={() => navigate("/deck")}>
            View Deck
          </button>
          <button className="action-button" onClick={() => alert("Chest opened! You found some loot.")}>
            Open Chest
          </button>
          <button className="action-button" onClick={() => navigate("/boss")}>
            Enter Boss Fight
          </button>
        </div>
      </div>
    </>
  );
};

export default MainPlayerView;