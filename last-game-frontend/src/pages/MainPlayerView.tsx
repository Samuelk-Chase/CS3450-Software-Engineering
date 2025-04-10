import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/MainPlayerView.css";
import backgroundImage from "../images/Login background.jpg";
import axiosInstance from "../utils/axiosInstance"; // Import the axios instance
import NewCardComponent from "../components/NewCardComponent";
import BossPopupComponent from "../components/BossPopupComponent";
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
  const [showPDF, setShowPDF] = useState(false); // <-- Added state

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const characterId = localStorage.getItem("characterId");

  const didAddIntroRef = useRef(false);

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

  useEffect(() => {
    if (!didAddIntroRef.current) {
      const storedIntro = localStorage.getItem("storyIntro");
      if (storedIntro) {
        let introText = storedIntro;
        try {
          const parsed = JSON.parse(storedIntro);
          if (parsed.intro) {
            introText = parsed.intro;
          }
        } catch (e) {
          console.warn("Could not parse stored intro as JSON:", e);
        }
        const timestamp = new Date().toLocaleTimeString();
        setChatHistory(prevHistory => [
          ...prevHistory,
          { text: introText, timestamp, sender: "AI" }
        ]);
      }
      didAddIntroRef.current = true;
    }
  }, []);

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
      { text: `You chose to: ${userResponse}`, timestamp, sender: "user" },
    ]);

    setGameText("AI is generating content...");

    try {
      const response = await axiosInstance.post("/story", { prompt: userResponse });
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
      console.log("message ia",aiMessage.toLowerCase());

      if (aiMessage.toLowerCase().includes("*combat begins*") || aiMessage.toLowerCase().includes("*combat begins.*") ) {
        console.log("Combat begins");
        const response = await axiosInstance.post("/boss", { prompt: aiMessage });
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
      {/* PDF Modal */}
      {showPDF && (
        <div style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100vw", height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            width: "80%",
            height: "80%",
            backgroundColor: "#fff",
            borderRadius: "10px",
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 0 20px rgba(0,0,0,0.5)"
          }}>
            <button
              onClick={() => setShowPDF(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                zIndex: 10000,
                background: "rgba(255, 255, 255, 0.8)",
                border: "none",
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#333",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)"
              }}
            >
              &times;
            </button>
            <iframe
              src="/gameManual.pdf"
              title="PDF Viewer"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          </div>
        </div>
      )}

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

            <button className="button" onClick={() => setShowPDF(true)}>
              View Game Manual (PDF)
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
