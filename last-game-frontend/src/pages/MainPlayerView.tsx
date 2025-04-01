import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/MainPlayerView.css";
import backgroundImage from "../images/Login background.jpg";
import axios from "axios";
import NewCardComponent from "../components/NewCardComponent";
import BossPopupComponent from "../components/BossPopupComponent";
import { Card, Boss } from "../context/GameContext";
import CardView from "./DeckOverlayPage"; // ✅ Import deck modal component

interface Character {
  character_id: number;
  character_name: string;
  current_hp: number;
  max_hp: number;
  current_mana: number;
  max_mana: number;
  image_url: string;
}

const cards: Card[] = [
  { id: 1, name: "Dagger", type: "Attack", level: 1, mana: 3, effect: "Deal a Guaranteed 20 damage per hit", image: "src/images/dagger.jpg" },
  { id: 2, name: "Necromancy", type: "Ability", level: 6, mana: 7, effect: "Bring back opponent for your team", image: "src/images/necromancy.jpg" },
  { id: 3, name: "Mirrors", type: "Ability", level: 1, mana: 1, effect: "Any damage done to you reflects to opponent", image: "src/images/magicmirror.jpg" },
];

const MainPlayerView: React.FC = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [gameText, setGameText] = useState("Welcome to the adventure! What will you do next?");
  const [userResponse, setUserResponse] = useState("");
  const [chatHistory, setChatHistory] = useState<{ text: string; timestamp: string; sender: string }[]>([]);
  const [showChestModal, setShowChestModal] = useState(false);
  const [newCard, setNewCard] = useState<Card | null>(null);
  const [showCardPopup, setShowCardPopup] = useState(false);
  const [showBossPopup, setShowBossPopup] = useState(false);
  const [newBoss, setNewBoss] = useState<Boss | null>(null);
  const [isDeckOpen, setIsDeckOpen] = useState(false); // ✅ Deck modal toggle

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
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP status ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (data.user_id !== Number(userId)) {
          alert("This character does not belong to you. Redirecting...");
          navigate("/character-account");
          return;
        }
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
      const response = await axios.post("http://localhost:8080/v1/story", { prompt: userResponse });
      const aiMessage = response.data.response;

      if (aiMessage.includes("*Receive card reward*")) {
        const cardResponse = await axios.post("http://localhost:8080/v1/card", {
          prompt: aiMessage.replace(/\*/g, ""),
        });
        const generatedCard = cardResponse.data;
        const mappedCard: Card = {
          id: generatedCard.card_id,
          name: generatedCard.title,
          type: generatedCard.type_id,
          level: generatedCard.power_level,
          mana: generatedCard.mana_cost,
          effect: generatedCard.card_description,
          image: generatedCard.image_url,
        };
        setNewCard(mappedCard);
        setShowCardPopup(true);
      }

      if (aiMessage.toLowerCase().includes("*boss combat begins.*")) {
        const response = await axios.post("http://localhost:8080/v1/boss", { prompt: aiMessage });
        setNewBoss(response.data);
        setShowBossPopup(true);
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

  const handleBossFight = (boss: Boss) => {
    navigate("/boss", { state: { boss } });
  };

  if (!character) return <p>Loading character...</p>;

  return (
    <>
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
        <div className="top-bar">
          <h1>The Last Game</h1>
        </div>

        {showCardPopup && newCard && (
          <NewCardComponent card={newCard} onClose={() => setShowCardPopup(false)} />
        )}
        {showBossPopup && newBoss && (
          <BossPopupComponent
            boss={newBoss}
            onClose={() => setShowBossPopup(false)}
            onStartBossFight={() => handleBossFight(newBoss)}
          />
        )}

        {isDeckOpen && <CardView onClose={() => setIsDeckOpen(false)} />} {/* ✅ Deck Modal */}

        <div className="main-container">
          <div className="left-panel">
            <img
              src={character.image_url}
              alt={character.character_name}
              onError={(e) => (e.currentTarget.src = "/default-image.png")}
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
                display: "block",
                margin: "0 auto 1rem auto",
              }}
            />
            <div className="player-info">
              <strong>{character.character_name}</strong>
              <div className="health-mana-bars">
                <div className="bar-container">
                  <div
                    className="bar-fill health-bar-fill"
                    style={{ width: `${(character.current_hp / character.max_hp) * 100}%` }}
                  ></div>
                </div>
                <div className="bar-container">
                  <div
                    className="bar-fill mana-bar-fill"
                    style={{ width: `${(character.current_mana / character.max_mana) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* ✅ Open Deck Modal */}
            <button className="button" onClick={() => setIsDeckOpen(true)}>
              View Deck
            </button>

            <button className="button" onClick={() => navigate("/boss")}>
              Enter Boss Fight
            </button>
          </div>

          <div className="text-container">
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
            <button className="close-button" onClick={() => setShowChestModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MainPlayerView;