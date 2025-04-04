import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import { ProgressSpinner } from "primereact/progressspinner";
import "../css/BossFightView.css";
import CardView from "./DeckOverlayPage";
import axios from "axios";
import { Card } from "../context/GameContext";

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

const BossFightPage: React.FC = () => {
  const { character, updateStats } = useContext(GameContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { boss } = location.state || {};

  const [localCharacter, setLocalCharacter] = useState<Character | null>(null);
  const [bossHealth, setBossHealth] = useState<number>(boss?.health ?? 100);
  const [maxBossHealth] = useState<number>(boss?.health ?? 100);
  const [bossImage, setBossImage] = useState<string>("");
  const [bossNameInput, setBossNameInput] = useState<string>(boss?.name || "");
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeckOpen, setIsDeckOpen] = useState<boolean>(false);
  const [deck, setDeck] = useState<Card[]>([]);
  const [hand, setHand] = useState<Card[]>([]);
  const [usedCards, setUsedCards] = useState<Card[]>([]);
  const characterId = localStorage.getItem("characterId");

  const soundEffectCache = new Map<string, string>();

  const playSoundEffect = async (soundTrack: string | null) => {
    const validSoundTrack =
      soundTrack && soundTrack.trim() !== "" ? soundTrack : "default_whoosh";

    // Check if the sound effect is already in localStorage
    const cachedSoundUrl = localStorage.getItem(`sound_${validSoundTrack}`);
    if (cachedSoundUrl) {
      const audio = new Audio(cachedSoundUrl);
      audio.volume = 1.0;
      audio.play();
      return;
    }

    // If not in localStorage, fetch it from the server
    try {
      const response = await fetch(
        `http://localhost:8080/v1/soundeffect?name=${encodeURIComponent(
          validSoundTrack
        )}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch sound effect:", await response.text());
        return;
      }

      const blob = await response.blob();
      const soundUrl = URL.createObjectURL(blob);

      // Store the sound effect in localStorage
      localStorage.setItem(`sound_${validSoundTrack}`, soundUrl);

      const audio = new Audio(soundUrl);
      audio.volume = 1.0;
      audio.play();
    } catch (error) {
      console.error("Error playing sound effect:", error);
    }
  };

  useEffect(() => {
    if (!characterId || isNaN(Number(characterId))) {
      alert("No character selected! Redirecting to character selection...");
      navigate("/character-account");
      return;
    }

    const fetchCharacter = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/v1/character/${characterId}`
        );
        setLocalCharacter(response.data);
      } catch (error) {
        console.error("Error fetching character:", error);
        setLocalCharacter(null);
      }
    };

    fetchCharacter();
  }, [navigate, characterId]);

  useEffect(() => {
    if (!characterId) return;
    const fetchDeck = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/v1/cards/${characterId}`
        );
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
        console.log("Fetched cards:", cards);
        const shuffledCards = shuffle(cards);
        const initialHand = shuffledCards.slice(0, 5);
        const remainingDeck = shuffledCards.slice(5);
        setHand(initialHand);
        setDeck(remainingDeck);
      } catch (error) {
        console.error("Error fetching deck:", error);
        setDeck([]);
        setHand([]);
      }
    };
    fetchDeck();
  }, [characterId]);

  useEffect(() => {
    if (!boss) return;
    setBossHealth(boss.health ?? 100);
    setBossNameInput(boss.name ?? "");
    if (boss.name) {
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
      autoGenerateImage();
    }
  }, [boss]);

  // New effect: Navigate back to main view when boss health reaches 0
  useEffect(() => {
    if (bossHealth === 0) {
      navigate("/main");
    }
  }, [bossHealth, navigate]);

  const shuffle = (array: Card[]): Card[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchBossImage = async (prompt: string) => {
    const requestBody = { prompt };
    const response = await fetch("http://localhost:8080/v1/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) throw new Error(await response.text());
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

  const playCard = (card: Card) => {
    console.log("Playing card:", card);

    playSoundEffect(card.soundEffect);

    if (!localCharacter || localCharacter.current_mana < card.mana) {
      console.log("Not enough mana");
      return;
    }

    const damageMatch = card.effect.match(/Deal (\d+) damage/);
    const damage = damageMatch ? parseInt(damageMatch[1], 10) : card.level;

    setBossHealth((prev) => Math.max(prev - damage, 0));

    const bossAttackDamage = 7;
    const newHealth = Math.max(localCharacter.current_hp - bossAttackDamage, 0);
    const newMana = localCharacter.current_mana - card.mana;

    setLocalCharacter((prev) =>
      prev ? { ...prev, current_hp: newHealth, current_mana: newMana } : null
    );
    updateStats(newHealth, newMana);

    const newHand = hand.filter((c) => c.id !== card.id);
    setUsedCards((prev) => [...prev, card]);

    if (deck.length > 0) {
      const newCard = deck[0];
      setHand([...newHand, newCard]);
      setDeck(deck.slice(1));
    } else if (newHand.length === 0 && deck.length === 0 && usedCards.length > 0) {
      const shuffledUsedCards = shuffle([...usedCards, card]);
      setHand(shuffledUsedCards.slice(0, 5));
      setUsedCards([]);
    } else {
      setHand(newHand);
    }
  };

  const handleBackToMain = () => navigate("/main");

  useEffect(() => {
    const preloadSoundEffects = async () => {
      const uniqueSoundTracks = new Set<string>();

      [...deck, ...hand].forEach((card) => {
        if (card.soundEffect) {
          uniqueSoundTracks.add(card.soundEffect);
        }
      });

      for (const soundTrack of uniqueSoundTracks) {
        if (!localStorage.getItem(`sound_${soundTrack}`)) {
          try {
            const response = await fetch(
              `http://localhost:8080/v1/soundeffect?name=${encodeURIComponent(
                soundTrack
              )}`,
              { method: "GET" }
            );

            if (!response.ok) {
              console.error(
                `Failed to fetch sound effect for ${soundTrack}:`,
                await response.text()
              );
              continue;
            }

            const blob = await response.blob();
            const soundUrl = URL.createObjectURL(blob);

            // Store the sound effect in localStorage
            localStorage.setItem(`sound_${soundTrack}`, soundUrl);
          } catch (error) {
            console.error(
              `Error preloading sound effect for ${soundTrack}:`,
              error
            );
          }
        }
      }
    };

    preloadSoundEffects();
  }, [deck, hand]);

  return (
    <div className="boss-fight-container">
      {loading && (
        <div className="loading-container">
          <ProgressSpinner style={{ width: "100px", height: "100px" }} strokeWidth="5" />
          <div className="loading-text">Generating boss image...</div>
        </div>
      )}

      {isDeckOpen && (
        <CardView onClose={() => setIsDeckOpen(false)} cards={[...usedCards, ...hand, ...deck]} />
      )}

      <div className="fight-area">
        <div className="player-side">
          <img
            src={localCharacter?.image_url || "/default-image.png"}
            alt={localCharacter?.character_name || "Player"}
            onError={(e) => (e.currentTarget.src = "/default-image.png")}
            style={{
              width: "150px",
              height: "auto",
              objectFit: "contain",
              display: "block",
              margin: "0 auto 1rem auto",
            }}
          />
          <h3 className="character-name">{localCharacter?.character_name ?? "Warmonger"}</h3>
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
          <h3 className="character-name">{boss?.name}</h3>
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
          <h3>{localCharacter?.character_name ?? "Warmonger"} Stats</h3>
          <p><strong>Health:</strong> {localCharacter?.current_hp ?? 100}</p>
          <p><strong>Mana:</strong> {localCharacter?.current_mana ?? 100}</p>
          <p><strong>Strength:</strong> 15</p>
          <p><strong>Defense:</strong> 12</p>
          <p><strong>Speed:</strong> 10</p>
          <p><strong>Critical Hit Chance:</strong> 5%</p>
          <p><strong>Fire Resistance:</strong> 20%</p>
        </div>

        <div className="stats-box boss-stats">
          <h3>{boss?.name} Stats</h3>
          <p><strong>Health:</strong> {bossHealth}</p>
          <p><strong>Mana:</strong> {boss?.mana ?? "???"}</p>
          <p><strong>Strength:</strong> 25</p>
          <p><strong>Defense:</strong> 18</p>
          <p><strong>Speed:</strong> 8</p>
          <p><strong>Poison Damage:</strong> 10 per turn</p>
          <p><strong>Shadow Resistance:</strong> 40%</p>
        </div>
      </div>

      <div className="card-interface">
        <div className="used-cards">Used: {usedCards.length}</div>
        <div className="hand-container">
          {hand.map((card) => (
            <div
              className="card"
              style={{ backgroundImage: `url(${card.image})` }}
              key={card.id}
              onClick={() => playCard(card)}
            >
              <div className="card-mana">{card.mana}</div>
              <div className="card-title">{card.name}</div>
              <div className="card-level">Level: {card.level}</div>
              <div className="card-description">{card.effect}</div>
            </div>
          ))}
        </div>
        <div className="next-card">
          {deck.length > 0 ? (
            <div className="card" style={{ backgroundImage: `url(${deck[0].image})` }}>
              <div className="card-info">
                <p>{deck[0].name}</p>
              </div>
            </div>
          ) : (
            <p>No more cards</p>
          )}
        </div>
      </div>

      <div className="bottom-actions">
        <button className="view-deck-button" onClick={() => setIsDeckOpen(true)}>
          View Deck
        </button>
        <button className="action-button" onClick={handleBackToMain}>
          Back to Main
        </button>
      </div>
    </div>
  );
};

export default BossFightPage;