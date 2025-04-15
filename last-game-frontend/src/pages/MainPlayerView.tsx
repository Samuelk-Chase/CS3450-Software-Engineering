import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/MainPlayerView.css";
import backgroundImage from "../images/Login background.jpg";
import axiosInstance from "../utils/axiosInstance"; // Import the axios instance
import NewCardComponent from "../components/NewCardComponent";
import BossPopupComponent from "../components/BossPopupComponent";
import GameManual from "../components/GameManual";
import { Card, Boss } from "../context/GameContext";
import CardView from "./DeckOverlayPage";
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
  const [showManual, setShowManual] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const characterId = localStorage.getItem("characterId");

  const generateDeck = async () => {
    if (!characterId || !character) return;
    setIsGeneratingDeck(true);
    try {
      for (let i = 0; i < 3; i++) {
        const response = await axiosInstance.post("/card", {
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
          soundEffect: generatedCard.sound_effect,
        };

        setDeck((prevDeck) => [...prevDeck, mappedCard]);
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
      const response = await axiosInstance.get(`/cards/${characterId}`);
      const cardsData = response.data.cards || [];
      const cards = cardsData.map((card: any) => ({
        id: card.card_id,
        name: card.title,
        type: card.type_id,
        level: card.power_level,
        mana: card.mana_cost,
        effect: card.card_description,
        image: card.image_url,
        soundEffect: card.sound_effect,
      }));
      setDeck(cards);
    } catch (error) {
      console.error("Error fetching deck:", error);
      setDeck([]);
    }
  };

  const fetchStoryHistory = async () => {
    if (!characterId) return;
    setIsLoadingHistory(true);
    try {
      const response = await axiosInstance.post("/storyHistory", {
        character_id: Number(characterId)
      });
      const stories = response.data;
      console.log("Fetched stories:", stories);
      
      const cleanText = (text: string) => {
        return text
          .replace(/[{}"]/g, '') // Remove {, }, and "
          .replace(/intro/gi, '') // Remove 'intro' (case insensitive)
          .trim(); // Remove extra whitespace
      };
      
      const formattedHistory = [];
      if (Array.isArray(stories)) {
        // Start with just the first response (skip first prompt)
        if (stories.length >= 2) {
          formattedHistory.push({
            text: cleanText(stories[1]),
            timestamp: new Date().toLocaleTimeString(),
            sender: "AI"
          });
        }
        
        // Process the rest of the entries
        for (let i = 2; i < stories.length; i += 2) {
          if (stories[i]) {
            formattedHistory.push({
              text: cleanText(stories[i]),
              timestamp: new Date().toLocaleTimeString(),
              sender: "user"
            });
          }
          
          if (stories[i + 1]) {
            formattedHistory.push({
              text: cleanText(stories[i + 1]),
              timestamp: new Date().toLocaleTimeString(),
              sender: "AI"
            });
          }
        }
      }
      
      console.log("Formatted history:", formattedHistory);
      setChatHistory(formattedHistory);
    } catch (error) {
      console.error("Error fetching story history:", error);
    } finally {
      setIsLoadingHistory(false);
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

    const fetchCharacter = async () => {
      try {
        const response = await axiosInstance.get(`/character/${characterId}`);
        const data = response.data;

        if (data.user_id !== Number(userId)) {
          alert("This character does not belong to you. Redirecting...");
          navigate("/character-account");
          return;
        }

        setCharacter(data);
        fetchDeck();
        fetchStoryHistory(); // Fetch story history when character is loaded
      } catch (error) {
        console.error("Error fetching character:", error);
      }
    };

    fetchCharacter();
  }, [navigate, userId, characterId]);

  const handleSubmitResponse = async () => {
    if (userResponse.trim() === "") return;

    const timestamp = new Date().toLocaleTimeString();
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { text: userResponse, timestamp, sender: "user" }
    ]);

    setGameText("AI is generating content...");

    try {
      const response = await axiosInstance.post("/story", { 
        prompt: userResponse,
        character_id: Number(characterId)
      });
      const aiMessage = response.data.response;

      if (aiMessage.includes("*Receive card reward*")) {
        const cardResponse = await axiosInstance.post("/card", {
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
          soundEffect: generatedCard.sound_effect,
        };
        setNewCard(mappedCard);
        setShowCardPopup(true);
        setDeck([...deck, mappedCard]);
      }

      if (aiMessage.toLowerCase().includes("*combat begins*") || aiMessage.toLowerCase().includes("*combat begins.*") ) {
        console.log("Combat begins");
        const response = await axiosInstance.post("/boss", { prompt: aiMessage });
        console.log("boss response", response.data);
        setNewBoss(response.data);
        setShowBossPopup(true);
      }

      setUserResponse("");
      setGameText("");
      const aiTimestamp = new Date().toLocaleTimeString();
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { text: aiMessage, timestamp: aiTimestamp, sender: "AI" }
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
      {showManual && <GameManual onClose={() => setShowManual(false)} />}

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
            <ProgressSpinner style={{ width: "100px", height: "100px" }} strokeWidth="5" />
            <div style={{ color: "#fff", fontSize: "24px", marginTop: "20px", textAlign: "center" }}>
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
                  <div className="bar-fill health-bar-fill" style={{ width: `${(character.current_hp / character.max_hp) * 100}%` }} />
                  <span className="bar-text">{character.current_hp} / {character.max_hp}</span>
                </div>
                <div className="bar-container">
                  <div className="bar-fill mana-bar-fill" style={{ width: `${(character.current_mana / character.max_mana) * 100}%` }} />
                  <span className="bar-text">{character.current_mana} / {character.max_mana}</span>
                </div>
              </div>
            </div>

            <button className="button" onClick={handleDeckButtonClick} disabled={isGeneratingDeck}>
              {isGeneratingDeck
                ? "Generating Deck..."
                : deck.length === 0
                  ? "Generate Deck"
                  : "View Deck"}
            </button>

            <button className="button" onClick={() => navigate("/boss")}>
              Enter Boss Fight
            </button>

            <button className="button" onClick={() => setShowManual(true)}>
              View Game Manual
            </button>
          </div>

          <div className="text-container">
            <div className="chat-history">
              {isLoadingHistory ? (
                <div className="loading-indicator">
                  <ProgressSpinner />
                  <p>Loading story history...</p>
                </div>
              ) : (
                chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`chat-message ${message.sender.toLowerCase()}`}
                  >
                    <span className="timestamp">{message.timestamp}</span>
                    <p>
                      {message.sender === "user" 
                        ? message.text.startsWith("You chose to:") ? message.text : `You: ${message.text}`
                        : message.text.startsWith("AI:") ? message.text : message.text.replace("*Receive card reward*", "").replace("*combat begins*", "").replace("*Combat begins.*", "")}
                    </p>
                  </div>
                ))
              )}
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
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmitResponse();
                  }
                }}
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
