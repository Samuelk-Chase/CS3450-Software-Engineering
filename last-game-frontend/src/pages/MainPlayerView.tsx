import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/MainPlayerView.css";
import backgroundImage from "../images/Login background.jpg";
import axios from "axios";
import NewCardComponent from "../components/NewCardComponent";
import BossPopupComponent from "../components/BossPopupComponent";
import { Card, Boss } from "../context/GameContext";
import CardView from "./DeckOverlayPage"; // ✅ Import deck modal component
import { ProgressSpinner } from "primereact/progressspinner";

interface Character {
  character_id: number;
  character_name: string;
  current_hp: number;
  max_hp: number;
  current_mana: number;
  max_mana: number;
  image_url: string;
  description: string;
}

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
  const [isDeckOpen, setIsDeckOpen] = useState(false);
  const [deck, setDeck] = useState<Card[]>([]);
  const [isGeneratingDeck, setIsGeneratingDeck] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const characterId = localStorage.getItem("characterId");
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://api.lastgame.chirality.app' // Production URL
    : 'http://localhost:8080'; // Development URL

  const generateDeck = async () => {
    if (!characterId || !character) return;
    setIsGeneratingDeck(true);
    try {
      // Generate 3 cards (adjust loop count as needed)
      for (let i = 0; i < 3; i++) {
        const response = await axios.post(`${baseUrl}/v1/card`, {
          prompt: character.description,
          character_id: Number(characterId),
        });
        
        const generatedCard = response.data;
        const mappedCard: Card = {
          id: generatedCard.card_id,
          name: generatedCard.title,
          type: generatedCard.type_id,
          level: generatedCard.power_level,
          mana: generatedCard.mana_cost,
          effect: generatedCard.card_description,
          image: generatedCard.image_url,
          soundEffect: generatedCard.sound_effect, // Added soundEffect property
        };
        
        setDeck(prevDeck => [...prevDeck, mappedCard]);
      }
    } catch (error) {
      console.error("Error generating deck:", error);
      alert("Failed to generate deck. Please try again.");
    } finally {
      setIsGeneratingDeck(false);
    }
  };

  const handleDeckButtonClick = async () => {
    if (deck.length === 0) {
      await generateDeck();
    } else {
      setIsDeckOpen(true);
    }
  };

  const fetchDeck = async () => {
    if (!characterId) return;
    try {
      const response = await axios.get(`${baseUrl}/v1/cards/${characterId}`); // Add logging to debug
      
      // Extract cards from the response
      const cardsData = response.data.cards || [];
      
      const cards = cardsData.map((card: any) => ({
        id: card.card_id,
        name: card.title,
        type: card.type_id,
        level: card.power_level,
        mana: card.mana_cost,
        effect: card.card_description,
        image: card.image_url,
        soundEffect: card.sound_effect, // Added soundEffect property
      }));
      setDeck(cards);
    } catch (error) {
      console.error("Error fetching deck:", error);
      setDeck([]); // Set empty deck on error
    }
  };

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

    const apiUrl = `${baseUrl}/v1/character/${characterId}`;
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
        fetchDeck();
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
      const response = await axios.post(`${baseUrl}/v1/story`, { prompt: userResponse });
      const aiMessage = response.data.response;

      if (aiMessage.includes("*Receive card reward*")) {
        const cardResponse = await axios.post(`${baseUrl}/v1/card`, {
          prompt: aiMessage.replace(/\*/g, ""),
          character_id: Number(characterId),
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
          soundEffect: generatedCard.sound_effect, // Added soundEffect property
        };
        setNewCard(mappedCard);
        setShowCardPopup(true);
        setDeck([...deck, mappedCard]);
      }

      if (aiMessage.toLowerCase().includes("*boss combat begins.*")) {
        const response = await axios.post(`${baseUrl}/v1/boss`, { prompt: aiMessage });
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

        {isDeckOpen && <CardView onClose={() => setIsDeckOpen(false)} cards={deck} />}

        {isGeneratingDeck && (
          <div className="loading-container" style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}>
            <ProgressSpinner style={{ width: '100px', height: '100px' }} strokeWidth="5" />
            <div style={{
              color: "#fff",
              fontSize: "24px",
              marginTop: "20px",
              textAlign: "center"
            }}>
              Generating your deck...
            </div>
          </div>
        )}

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
        style={{
          width: `${(character.current_hp / character.max_hp) * 100}%`,
        }}
      ></div>
      <span className="bar-text">
        {character.current_hp} / {character.max_hp}
      </span>
    </div>
    <div className="bar-container">
      <div
        className="bar-fill mana-bar-fill"
        style={{
          width: `${(character.current_mana / character.max_mana) * 100}%`,
        }}
      ></div>
      <span className="bar-text">
        {character.current_mana} / {character.max_mana}
      </span>
    </div>
  </div>
</div>

            {/* Updated Deck Button */}
            <button 
              className="button" 
              onClick={handleDeckButtonClick}
              disabled={isGeneratingDeck}
            >
              {isGeneratingDeck ? "Generating Deck..." : deck.length === 0 ? "Generate Deck" : "View Deck"}
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
    </>
  );
};

export default MainPlayerView;
