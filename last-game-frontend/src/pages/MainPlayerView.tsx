import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/MainPlayerView.css";
import backgroundImage from "../images/Login background.jpg"; // Import the background image
import axios from "axios";
import NewCardComponent from "../components/NewCardComponent";
import BossPopupComponent from "../components/BossPopupComponent";
import { Card, Boss } from "../context/GameContext";

interface Character {
  character_id: number;
  character_name: string;
  current_hp: number;
  max_hp: number;
  current_mana: number;
  max_mana: number;
}

const cards: Card[] = [
  { id: 1, name: "Dagger", type: "Attack", level: 1, mana: 3, effect: "Deal a Guaranteed 20 damage per hit", image: "src/images/dagger.jpg" },
  { id: 2, name: "Necromancy", type: "Ability", level: 6, mana: 7, effect: "Bring back opponent for your team", image: "src/images/necromancy.jpg" },
  { id: 3, name: "Mirrors", type: "Ability", level: 1, mana: 1, effect: "Any damage done to you reflects to opponent", image: "src/images/magicmirror.jpg" },
];

const MainPlayerView: React.FC = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [gameText, setGameText] = useState<string>("Welcome to the adventure! What will you do next?");
  const [userResponse, setUserResponse] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<{ text: string; timestamp: string; sender: string }[]>([]);
  const [showChestModal, setShowChestModal] = useState<boolean>(false);
  const [newCard, setNewCard] = useState<Card | null>(null);
  const [showCardPopup, setShowCardPopup] = useState<boolean>(false);
  const [showBossPopup, setShowBossPopup] = useState<boolean>(false);
  const [newBoss, setNewBoss] = useState<Boss | null>(null);
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

  const handleSubmitResponse = async () => {
    if (userResponse.trim() === "") return;

    const timestamp = new Date().toLocaleTimeString();
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { text: `You chose to: ${userResponse}`, timestamp, sender: "user" },
    ]);

    setGameText("AI is generating content...");

    try {
      const response = await axios.post("http://localhost:8080/v1/story", {
        prompt: userResponse,
        response: "",
      });

      const aiMessage = response.data.response;

      if (aiMessage.includes("*Receive card reward*")) {
        const cardResponse = await axios.post("http://localhost:8080/v1/card", {
          prompt: aiMessage,
        });
        console.log(cardResponse.data)
        const generatedCard = cardResponse.data;
        const mappedCard: Card = {
          id: generatedCard.card_id,
          name: "Fireball",
          type: "test",
          level: generatedCard.power_level,
          mana: generatedCard.mana_cost,
          effect: "Generates a fireball dealing 50 damage to the opponent",
          image: generatedCard.image_url,
        };

        setNewCard(mappedCard);
        setShowCardPopup(true);
      }
      if (aiMessage.includes("*Boss combat begins.*") || (aiMessage.includes("*boss combat begins.*"))) {
        try {
          const response = await axios.post("http://localhost:8080/v1/boss", {
            prompt: aiMessage,
          });
          setNewBoss(response.data);
          setShowBossPopup(true);
        } catch (error) {
          console.error("Error fetching boss:", error);
        }
      }

      setUserResponse("");
      setGameText("");
      const aiTimestamp = new Date().toLocaleTimeString();
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { text: `AI: ${aiMessage}`, timestamp: aiTimestamp, sender: "AI" },
      ]);
    } catch (error) {
      console.error("Error fetching AI response", error);
      setGameText("Sorry, something went wrong.");
    }
  };

  const handleOpenChest = () => {
    setShowChestModal(true);
  };

  const handleCloseChest = () => {
    setShowChestModal(false);
  };

  const handleCloseCardPopup = () => {
    setShowCardPopup(false);
  };

  const handleBossFight = (boss: Boss) => {
    navigate("/boss", { state: { boss } });
  };

  const handleCloseBossPopup = () => {
    setShowBossPopup(false);
  };

  if (!character) {
    return <p>Loading character...</p>;
  }

  // Derive the player's image URL based on their character name.
  const safeName = character.character_name.toLowerCase().replace(/\s+/g, "_");
  const playerImageUrl = `http://localhost:8080/character_images/${safeName}.png`;

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
          paddingTop: "80px",
        }}
      >
        {/* Top Bar */}
        <div className="top-bar">
          <h1>The Last Game</h1>
        </div>

        {showCardPopup && newCard && (
          <NewCardComponent card={newCard} onClose={handleCloseCardPopup} />
        )}
        {showBossPopup && newBoss && (
          <BossPopupComponent
            boss={newBoss}
            onClose={handleCloseBossPopup}
            onStartBossFight={() => handleBossFight(newBoss)}
          />
        )}
        {/* Main Container */}
        <div className="main-container">
          {/* LEFT PANEL: Player Stats, Image & Actions */}
          <div className="left-panel">
            {/* Player Image centered */}
            <img
              src={playerImageUrl}
              alt={character.character_name}
              onError={(e) => {
                console.log("Error loading player image for:", character.character_name);
                e.currentTarget.src = "/default-image.png"; // Fallback image if error occurs
              }}
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
                display: "block",
                margin: "0 auto 1rem auto", // Centered horizontally with bottom margin
              }}
            />

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
            <button className="button" onClick={() => navigate("/deck")}>
              View Deck
            </button>
          
            <button className="button" onClick={() => navigate("/boss")}>
              Enter Boss Fight
            </button>
          </div>

          {/* TEXT CONTENT SECTION */}
          <div className="text-container">
            {/* Chat History */}
            <div className="chat-history">
              {chatHistory.map((entry, index) => (
                <div key={index} className={`chat-entry ${entry.sender}`}>
                  <span className="timestamp">[{entry.timestamp}]</span>
                  <span className="chat-text">
                    {entry.text.replace("*Receive card reward*", "").replace("*Boss combat begins.*", "")}
                  </span>
                </div>
              ))}
            </div>

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
              {cards.map((card) => (
                <div key={card.id} className="card" style={{ backgroundImage: `url(${card.image})` }}>
                  <h3>{card.name}</h3>
                  <p>{card.effect}</p>
                  <div className="card-footer">
                    <span className="card-level">LV: {card.level}</span>
                    <span className="card-type">{card.type}</span>
                  </div>
                </div>
              ))}
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