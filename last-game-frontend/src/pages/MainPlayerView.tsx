import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/MainPlayerView.css";
import backgroundImage from "../images/Login background.jpg"; // Import the background image

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
  const [gameText, setGameText] = useState<string>(
    "Welcome to the adventure! What will you do next?"
  );
  const [userResponse, setUserResponse] = useState<string>("");
  const [showChestModal, setShowChestModal] = useState<boolean>(false); // Controls chest modal visibility

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

  const handleSubmitResponse = () => {
    if (userResponse.trim() === "") return;
    setGameText(`You chose to: ${userResponse}`);
    setUserResponse(""); // Clear input after submission
  };

  const handleOpenChest = () => {
    setShowChestModal(true); // Show the chest modal
  };

  const handleCloseChest = () => {
    setShowChestModal(false); // Close the chest modal
  };

  if (!character) {
    return <p>Loading character...</p>;
  }

  return (
    <>
      {/* Background Wrapper */}
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "80px", // Adjust if needed for the navbar
        }}
      >
        {/* Top Bar */}
        <div className="top-bar">
          <h1>BEAN BOYS - The Last Game </h1>
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
            <button className="action-button" onClick={handleOpenChest}>
              Open Chest
            </button>
            <button className="action-button" onClick={() => navigate("/boss")}>
              Enter Boss Fight
            </button>
          </div>

          {/* TEXT CONTENT SECTION */}
          <div className="text-container">
            <div className="text-content">
              <p>{gameText}</p>
            </div>

            {/* USER RESPONSE SECTION */}
            <div className="user-response">
              <input
                type="text"
                placeholder="Type your response..."
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
              />
              <button onClick={handleSubmitResponse}>Submit</button>
            </div>
          </div>
        </div>
      </div>

      {/* Chest Modal (Shows Cards) */}
      {showChestModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>You've Found 3 Cards!</h2>
            <div className="card-container">
              {/* You can replace these with actual card images */}
              <img alt="Card 1" className="card" />
              <img alt="Card 2" className="card" />
              <img alt="Card 3" className="card" />
            </div>
            <button className="close-button" onClick={handleCloseChest}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MainPlayerView;