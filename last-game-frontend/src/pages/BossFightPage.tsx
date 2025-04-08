import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import { ProgressSpinner } from "primereact/progressspinner";
import "../css/BossFightView.css";
import axios from "axios";
import { Card } from "../context/GameContext";

// Boss attack types and their effects
const BOSS_ATTACKS = [
  {
    name: "Dark Strike",
    damage: { min: 5, max: 15 },
    effect: "Stunned",
    description: "The boss strikes with dark energy, stunning you!",
    animation: "dark-strike"
  },
  {
    name: "Mind Warp",
    damage: { min: 5, max: 15 },
    effect: "Confused",
    description: "The boss warps your mind, causing confusion!",
    animation: "mind-warp"
  },
  {
    name: "Soul Drain",
    damage: { min: 5, max: 15 },
    effect: "Exposed",
    description: "The boss drains your soul, leaving you exposed!",
    animation: "soul-drain"
  },
  {
    name: "Shadow Bind",
    damage: { min: 5, max: 15 },
    effect: "Weakened",
    description: "The boss binds you in shadows, weakening you!",
    animation: "shadow-bind"
  },
  {
    name: "Time Warp",
    damage: { min: 5, max: 15 },
    effect: "Slowed",
    description: "The boss warps time around you, slowing you down!",
    animation: "time-warp"
  }
];

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

interface JSONCard {
  card_id: number;
  title: string;
  type_id: number;
  power_level: number;
  mana_cost: number;
  card_description: string;
  image_url: string;
  sound_effect: string;
}

const BossFightPage: React.FC = () => {
  const { updateStats } = useContext(GameContext);
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
  const [bossEffects, setBossEffects] = useState<string[]>([]);
  const [playerEffects, setPlayerEffects] = useState<string[]>([]);
  const [isBossAttacking, setIsBossAttacking] = useState<boolean>(false);
  const [attackAnimation, setAttackAnimation] = useState<string>("");
  const [attackMessage, setAttackMessage] = useState<string>("");
  const characterId = localStorage.getItem("characterId");
  
  const baseUrl = window.location.hostname.includes('localhost')
    ? 'https://lastgame-api.chirality.app' // Production URL
    : 'http://localhost:8080'; // Development URL

//const baseUrl = 'http://localhost:8080';
  const [showAttackPopup, setShowAttackPopup] = useState<boolean>(false);
  const [currentAttack, setCurrentAttack] = useState<{name: string, damage: number, effect: string} | null>(null);
  const [showPlayerAttackPopup, setShowPlayerAttackPopup] = useState<boolean>(false);
  const [playerAttack, setPlayerAttack] = useState<{name: string, damage: number, effect: string} | null>(null);

  const playSoundEffect = async (soundTrack: string | null) => {
    if (!soundTrack) return;
    
    try {
      const cachedSoundUrl = localStorage.getItem(`sound_${soundTrack}`);
      if (cachedSoundUrl) {
        const audio = new Audio(cachedSoundUrl);
        audio.play().catch(error => {
          console.error("Error playing cached sound:", error);
          // If cached sound fails, try to fetch it again
          fetchAndCacheSound(soundTrack);
        });
      } else {
        await fetchAndCacheSound(soundTrack);
      }
    } catch (error) {
      console.error("Error playing sound effect:", error);
    }
  };

  const fetchAndCacheSound = async (soundTrack: string) => {
    try {
      const response = await fetch(
        `${baseUrl}/v1/soundeffect?name=${encodeURIComponent(soundTrack)}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch sound effect: ${response.statusText}`);
      }

      const blob = await response.blob();
      const soundUrl = URL.createObjectURL(blob);
      localStorage.setItem(`sound_${soundTrack}`, soundUrl);

      const audio = new Audio(soundUrl);
      await audio.play();
    } catch (error) {
      console.error("Error fetching and caching sound:", error);
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
          `${baseUrl}/v1/character/${characterId}`
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
          `${baseUrl}/v1/cards/${characterId}`
        );
        const cardsData = response.data.cards || [];
        const cards = cardsData.map((card: JSONCard) => ({
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
       // const remainingDeck = shuffledCards.slice(5);
        setHand(initialHand);
        setDeck(shuffledCards);
      } catch (error) {
        console.error("Error fetching deck:", error);
        setDeck([]);
        setHand([]);
      }
    };

    // Only fetch deck if we don't have one yet
    if (hand.length === 0 && deck.length === 0) {
      fetchDeck();
    }
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
    const response = await fetch(`${baseUrl}/v1/image`, {
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

  const performBossAttack = () => {
    setIsBossAttacking(true);
    const randomAttack = BOSS_ATTACKS[Math.floor(Math.random() * BOSS_ATTACKS.length)];
    const damage = Math.floor(Math.random() * (randomAttack.damage.max - randomAttack.damage.min + 1)) + randomAttack.damage.min;
    
    setAttackAnimation(randomAttack.animation);
    setAttackMessage(randomAttack.description);
    setCurrentAttack({ name: randomAttack.name, damage, effect: randomAttack.effect });
    setShowAttackPopup(true);

    // Apply damage to player
    if (localCharacter) {
      const newHealth = Math.max(localCharacter.current_hp - damage, 0);
      setLocalCharacter(prev => prev ? { ...prev, current_hp: newHealth } : null);
      updateStats(newHealth, localCharacter.current_mana);
      
      // Apply effect to player
      if (!playerEffects.includes(randomAttack.effect)) {
        setPlayerEffects(prev => [...prev, randomAttack.effect]);
      }
    }

    // Reset attack animation after 2 seconds
    setTimeout(() => {
      setIsBossAttacking(false);
      setAttackAnimation("");
      setAttackMessage("");
      setShowAttackPopup(false);
      setCurrentAttack(null);
    }, 2000);
  };

  const playCard = (card: Card) => {
    console.log("Attempting to play card:", card);
    if (!localCharacter) {
      console.log("No character found");
      return;
    }
    if (localCharacter.current_mana < card.mana) {
      console.log("Not enough mana. Current:", localCharacter.current_mana, "Required:", card.mana);
      return;
    }

    // Close deck popup and show card played popup
    setIsDeckOpen(false);
    setShowPlayerAttackPopup(true);

    console.log("Playing card with effect:", card.effect);
    playSoundEffect(card.soundEffect);

    const damageMatch = card.effect.match(/Deal (\d+) damage/);
    const damage = damageMatch ? parseInt(damageMatch[1], 10) : card.level;
    console.log("Calculated damage:", damage);

    // Show player attack popup
    setPlayerAttack({
      name: card.name,
      damage: damage,
      effect: card.effect
    });

    // Apply card effect based on type
    switch (card.type.toString()) {
      case "1": // Stunned
        if (!bossEffects.includes("Stunned")) {
          setBossEffects(prev => [...prev, "Stunned"]);
        }
        break;
      case "2": // Confused
        if (!bossEffects.includes("Confused")) {
          setBossEffects(prev => [...prev, "Confused"]);
        }
        break;
      case "3": // Exposed
        if (!bossEffects.includes("Exposed")) {
          setBossEffects(prev => [...prev, "Exposed"]);
        }
        break;
      case "4": // Weakened
        if (!bossEffects.includes("Weakened")) {
          setBossEffects(prev => [...prev, "Weakened"]);
        }
        break;
      case "5": // Slowed
        if (!bossEffects.includes("Slowed")) {
          setBossEffects(prev => [...prev, "Slowed"]);
        }
        break;
    }

    // Update boss health
    setBossHealth(prev => Math.max(prev - damage, 0));

     //Update player mana
    //const newMana = localCharacter.current_mana - card.mana;
    //setLocalCharacter(prev => prev ? { ...prev, current_mana: newMana } : null);
    updateStats(localCharacter.current_hp, localCharacter.current_mana);

    // Remove the played card from deck
 
    const updatedDeck = deck.filter(c => c.id !== card.id);
    console.log("Deck after removal:", updatedDeck);
    setDeck(updatedDeck);

    // Close player attack popup and trigger boss attack after delay
    setTimeout(() => {
      setShowPlayerAttackPopup(false);
      performBossAttack();
    }, 2000);
  };

  // Add a useEffect to log deck changes


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
              `${baseUrl}/v1/soundeffect?name=${encodeURIComponent(
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
          {playerEffects.length > 0 && (
            <div className="effects-section">
              <h4>Effects:</h4>
              {playerEffects.map((effect, index) => (
                <span key={index} className="effect-badge">{effect}</span>
              ))}
            </div>
          )}
        </div>

        <div className="stats-box boss-stats">
          <h3>{boss?.name} Stats</h3>
          <p><strong>Health:</strong> {bossHealth}/{maxBossHealth}</p>
          <p><strong>Mana:</strong> {boss?.mana ?? "???"}</p>
          <p><strong>Strength:</strong> 25</p>
          <p><strong>Defense:</strong> 18</p>
          <p><strong>Speed:</strong> 8</p>
          <p><strong>Poison Damage:</strong> 10 per turn</p>
          <p><strong>Shadow Resistance:</strong> 40%</p>
          {bossEffects.length > 0 && (
            <div className="effects-section">
              <h4>Effects:</h4>
              {bossEffects.map((effect, index) => (
                <span key={index} className="effect-badge">{effect}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fight-area">
        <div className="player-side">
          <img
            src={localCharacter?.image_url || "/default-image.png"}
            alt={localCharacter?.character_name || "Player"}
            onError={(e) => (e.currentTarget.src = "/default-image.png")}
            className={`character-img ${isBossAttacking ? "hit-animation" : ""}`}
          />
          <h3 className="character-name">{localCharacter?.character_name ?? "Warmonger"}</h3>
        </div>

        <div className="vs-text">VS</div>

        <div className="boss-side">
          {bossImage ? (
            <img 
              src={bossImage} 
              alt="Boss" 
              className={`character-img ${attackAnimation}`}
            />
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
          {attackMessage && (
            <div className="attack-message">{attackMessage}</div>
          )}
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <ProgressSpinner style={{ width: "100px", height: "100px" }} strokeWidth="5" />
          <div className="loading-text">Generating boss image...</div>
        </div>
      )}

      {showAttackPopup && currentAttack && (
        <div className="attack-popup">
          <div className="attack-popup-content">
            <h3>{boss?.name} used {currentAttack.name}!</h3>
            <p>Dealt {currentAttack.damage} damage</p>
            {currentAttack.effect && <p>Applied {currentAttack.effect} effect</p>}
          </div>
        </div>
      )}

      {showPlayerAttackPopup && playerAttack && (
        <div className="attack-popup">
          <div className="attack-popup-content">
            <h3>You used {playerAttack.name}!</h3>
            <p>Dealt {playerAttack.damage} damage</p>
            <p>{playerAttack.effect}</p>
          </div>
        </div>
      )}

      <div className="card-interface">
        <button 
          className="view-deck-button" 
          onClick={() => {
            console.log("Opening deck popup");
            setIsDeckOpen(true);
          }}
        >
          Play Card
        </button>
      </div>

      {isDeckOpen && (
        <div className="deck-popup">
          <div className="deck-popup-content">
            <h3>Your Cards</h3>
            <p>Click on a card to play it</p>
            <div className="cards-grid">
              {deck.map((card) => {
                const hasEnoughMana = localCharacter?.current_mana && localCharacter.current_mana >= card.mana;
                console.log(`Card ${card.id} - Mana Required: ${card.mana}, Has enough: ${hasEnoughMana}`);
                return (
                  <div
                    key={card.id}
                    className={`card ${!hasEnoughMana ? 'disabled' : ''}`}
                    style={{ backgroundImage: `url(${card.image})` }}
                    onClick={() => {
                      console.log(`Clicked on card ${card.id}`);
                      if (hasEnoughMana) {
                        playCard(card);
                      }
                    }}
                  >
                    <div className="card-header">
                      <div className="card-mana">{card.mana}</div>
                      <div className="card-level">Lvl {card.level}</div>
                    </div>
                    <div className="card-body">
                      <div className="card-title">{card.name}</div>
                      <div className="card-description">{card.effect}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="close-popup" onClick={() => setIsDeckOpen(false)}>Close</button>
          </div>
        </div>
      )}

      <div className="bottom-actions">
        <button 
          className="view-deck-button" 
          onClick={() => {
            console.log("Opening deck popup");
            setIsDeckOpen(true);
          }}
        >
          Play Card
        </button>
        <button className="action-button" onClick={handleBackToMain}>
          Back to Main
        </button>
      </div>
    </div>
  );
};

export default BossFightPage;
