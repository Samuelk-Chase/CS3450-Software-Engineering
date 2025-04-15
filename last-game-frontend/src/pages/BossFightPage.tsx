import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import { ProgressSpinner } from "primereact/progressspinner";
import "../css/BossFightView.css";
import axiosInstance from "../utils/axiosInstance"; // Import the axios instance
import { Card } from "../context/GameContext";
import CardComponent from "../components/CardComponent"; // Import the CardComponent

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
  game_mode: number;
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

// Extend the imported Card interface
interface ExtendedCard extends Card {
  lastUsed?: number;
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
  const [deck, setDeck] = useState<ExtendedCard[]>([]);
  const [hand, setHand] = useState<ExtendedCard[]>([]);
  const [bossEffects, setBossEffects] = useState<string[]>([]);
  const [playerEffects, setPlayerEffects] = useState<string[]>([]);
  const [isBossAttacking, setIsBossAttacking] = useState<boolean>(false);
  const [attackAnimation, setAttackAnimation] = useState<string>("");
  const [attackMessage, setAttackMessage] = useState<string>("");
  const characterId = localStorage.getItem("characterId");
  const [loadingNewCard, setLoadingNewCard] = useState<boolean>(false);
  
  const baseUrl = window.location.hostname.includes('localhost')
    ? 'https://lastgame-api.chirality.app' // Production URL
    : 'http://localhost:8080'; // Development URL

//const baseUrl = 'http://localhost:8080';
  const [showAttackPopup, setShowAttackPopup] = useState<boolean>(false);
  const [currentAttack, setCurrentAttack] = useState<{name: string, damage: number, effect: string, isWeakened: boolean, isExposed: boolean} | null>(null);
  const [showPlayerAttackPopup, setShowPlayerAttackPopup] = useState<boolean>(false);
  const [playerAttack, setPlayerAttack] = useState<{name: string, damage: number, effect: string, isWeakened: boolean, isExposed: boolean, isConfused: boolean} | null>(null);
  const [cooldownTimers, setCooldownTimers] = useState<{[key: number]: number}>({});
  const [newCard, setNewCard] = useState<JSONCard | null>(null); // State to store the new card

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
      const response = await axiosInstance.get(`/soundeffect?name=${encodeURIComponent(soundTrack)}`, {
        responseType: "blob", // Ensure the response is treated as a binary blob
      });

      const blob = response.data;
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
        const response = await axiosInstance.get(`/character/${characterId}`);
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
        const response = await axiosInstance.get(`/cards/${characterId}`);
        const cardsData = response.data.cards || [];
        const cards = cardsData.map((card: JSONCard) => ({
          id: card.card_id,
          name: card.title,
          type: card.type_id.toString(),
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

  useEffect(() => {
    const createCardFromBoss = async () => {
      if (!boss || !boss.description) return;

      // Close the deck if it's open
      setIsDeckOpen(false);

      // Show a "Generating..." state
      setNewCard(null); // Clear any existing card
      setLoadingNewCard(true); // Show loading state

      try {
        const response = await axiosInstance.post("/card", {
          prompt: boss.description,
          character_id: Number(characterId),
        });
        setNewCard(response.data); // Store the new card in state
      } catch (error) {
        console.error("Error creating card:", error);
      } finally {
        setLoadingNewCard(false); // Stop the loading state
      }
    };

    if (bossHealth === 0) {
      createCardFromBoss();
    }
  }, [bossHealth, boss, characterId]);

  const shuffle = (array: ExtendedCard[]): ExtendedCard[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchBossImage = async (prompt: string) => {
    const requestBody = { prompt };
    const response = await axiosInstance.post("/image", requestBody);
    const data = response.data;
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

  const performBossAttack = async () => {
    if (!localCharacter || !boss) return;
    setIsBossAttacking(true);
    const randomAttack = BOSS_ATTACKS[Math.floor(Math.random() * BOSS_ATTACKS.length)];
    let damage = Math.floor(Math.random() * (randomAttack.damage.max - randomAttack.damage.min + 1)) + randomAttack.damage.min;
    
    // Apply weakened effect if boss is weakened
    if (bossEffects.includes("Weakened")) {
      damage = Math.floor(damage * 0.75); // 25% less damage
    }
    
    // Apply exposed effect if player is exposed
    if (playerEffects.includes("Exposed")) {
      damage = Math.floor(damage * 1.25); // 25% more damage
    }
    
    setAttackAnimation(randomAttack.animation);
    setAttackMessage(randomAttack.description);
    setCurrentAttack({ 
      name: randomAttack.name, 
      damage, 
      effect: randomAttack.effect,
      isWeakened: bossEffects.includes("Weakened"),
      isExposed: playerEffects.includes("Exposed")
    });
    setShowAttackPopup(true);

    // Apply damage to player
    const newHealth = Math.max(localCharacter.current_hp - damage, 0);
    setLocalCharacter(prev => prev ? { ...prev, current_hp: newHealth } : null);
    updateStats(newHealth, localCharacter.current_mana);
    
    // Check if player is defeated
    if (newHealth === 0) {
      // Check game mode - only delete character in hard mode (1)
      if (localCharacter.game_mode === 1) {
        // Delete character from database
        try {
          await axiosInstance.post("/deleteCharacter", {
            character_id: localCharacter.character_id
          });
          // Show defeat message and navigate to character account page
          alert("Your character has been defeated and deleted!");
          navigate("/character-account");
        } catch (error) {
          console.error("Failed to delete character:", error);
          alert("Failed to delete character. Please try again.");
        }
      } else {
        // In easy mode, just go back to main page
        alert("Your character has been defeated! Try again!");
        navigate("/main");
      }
      return;
    }
    
    // Apply effect to player (replace any existing effect)
    setPlayerEffects([randomAttack.effect]);

    // Reset attack animation after 2 seconds
    setTimeout(() => {
      setIsBossAttacking(false);
      setAttackAnimation("");
      setAttackMessage("");
      setShowAttackPopup(false);
      setCurrentAttack(null);
    }, 2000);
  };

  // Function to check if a card is on cooldown
  const isCardOnCooldown = (card: ExtendedCard): boolean => {
    if (!card.lastUsed) return false;
    const now = Date.now();
    const cooldownTime = 60 * 1000; // 1 minute in milliseconds
    return now - card.lastUsed < cooldownTime;
  };

  // Function to get remaining cooldown time
  const getRemainingCooldown = (card: ExtendedCard): number => {
    if (!card.lastUsed) return 0;
    const now = Date.now();
    const cooldownTime = 60 * 1000; // 1 minute in milliseconds
    const remaining = Math.max(0, cooldownTime - (now - card.lastUsed));
    return Math.ceil(remaining / 1000); // Convert to seconds
  };

  // Function to get cooldown percentage
  const getCooldownPercentage = (card: ExtendedCard): number => {
    if (!card.lastUsed) return 0;
    const now = Date.now();
    const cooldownTime = 60 * 1000; // 1 minute in milliseconds
    const remaining = Math.max(0, cooldownTime - (now - card.lastUsed));
    return (remaining / cooldownTime) * 100;
  };

  // Update cooldown timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimers: {[key: number]: number} = {};
      
      deck.forEach(card => {
        if (card.lastUsed) {
          const remaining = getRemainingCooldown(card);
          if (remaining > 0) {
            updatedTimers[card.id] = remaining;
          }
        }
      });
      
      setCooldownTimers(updatedTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [deck]);

  const playCard = (card: ExtendedCard) => {
    console.log("Attempting to play card:", card);
    if (!localCharacter) {
      console.log("No character found");
      return;
    }
    if (localCharacter.current_mana < card.mana) {
      console.log("Not enough mana. Current:", localCharacter.current_mana, "Required:", card.mana);
      return;
    }
    if (isCardOnCooldown(card)) {
      console.log("Card is on cooldown");
      return;
    }

    // Handle confused effect
    if (playerEffects.includes("Confused")) {
      const availableCards = deck.filter(c => c.id !== card.id && !isCardOnCooldown(c));
      if (availableCards.length > 0) {
        const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
        console.log("Confused! Playing random card instead:", randomCard);
        card = randomCard;
      }
    }

    // Close deck popup and show card played popup
    setIsDeckOpen(false);
    setShowPlayerAttackPopup(true);

    console.log("Playing card with effect:", card.effect);
    playSoundEffect(card.soundEffect);

    const damageMatch = card.effect.match(/Deal (\d+) damage/);
    let damage = damageMatch ? parseInt(damageMatch[1], 10) : card.level;
    
    // Apply weakened effect if player is weakened
    if (playerEffects.includes("Weakened")) {
      damage = Math.floor(damage * 0.75); // 25% less damage
    }
    
    // Apply exposed effect if boss is exposed
    if (bossEffects.includes("Exposed")) {
      damage = Math.floor(damage * 1.25); // 25% more damage
    }
    
    console.log("Calculated damage:", damage);

    // Show player attack popup
    setPlayerAttack({
      name: card.name,
      damage: damage,
      effect: card.effect,
      isWeakened: playerEffects.includes("Weakened"),
      isExposed: bossEffects.includes("Exposed"),
      isConfused: playerEffects.includes("Confused")
    });

    // Apply card effect based on type (replace any existing effect)
    let newBossEffect = "";
    switch (card.type.toString()) {
      case "1": // Stunned
        newBossEffect = "Stunned";
        break;
      case "2": // Confused
        newBossEffect = "Confused";
        break;
      case "3": // Exposed
        newBossEffect = "Exposed";
        break;
      case "4": // Weakened
        newBossEffect = "Weakened";
        break;
      case "5": // Slowed
        newBossEffect = "Slowed";
        break;
    }
    setBossEffects([newBossEffect]);

    // Update boss health
    setBossHealth(prev => Math.max(prev - damage, 0));

    // Update player mana
    const newMana = localCharacter.current_mana - card.mana;
    setLocalCharacter(prev => prev ? { ...prev, current_mana: newMana } : null);
    updateStats(localCharacter.current_hp, localCharacter.current_mana);

    // Set card cooldown
    setDeck(prevDeck => 
      prevDeck.map(c => 
        c.id === card.id ? { ...c, lastUsed: Date.now() } : c
      )
    );

    // Close player attack popup and trigger boss attack after delay
    setTimeout(() => {
      setShowPlayerAttackPopup(false);
      performBossAttack();
    }, 2000);
  };

  // Add a useEffect to log deck changes


  const handleBackToMain = () => navigate("/main");

  const handleAcceptCard = () => {
    navigate("/main"); // Navigate back to the main page
  };

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
            const response = await axiosInstance.get(`/soundeffect?name=${encodeURIComponent(soundTrack)}`, {
              responseType: "blob",
            });

            const blob = response.data;
            const soundUrl = URL.createObjectURL(blob);

            // Store the sound effect in localStorage
            localStorage.setItem(`sound_${soundTrack}`, soundUrl);
          } catch (error) {
            console.error(`Error preloading sound effect for ${soundTrack}:`, error);
          }
        }
      }
    };

    preloadSoundEffects();
  }, [deck, hand]);

  return (
    <div className="boss-fight-container">
      <div className="stats-section">
        <div className="stats-box">
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

        <div className="stats-box">
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
            <p className="damage">Dealt {currentAttack.damage} damage</p>
            {currentAttack.isWeakened && <p className="weakened">The attack was weakened by 25%!</p>}
            {currentAttack.isExposed && <p className="exposed">The attack was amplified by 25% due to being exposed!</p>}
            {currentAttack.effect && <p className="effect">Applied {currentAttack.effect} effect</p>}
          </div>
        </div>
      )}

      {showPlayerAttackPopup && playerAttack && (
        <div className="attack-popup">
          <div className="attack-popup-content">
            <h3>You used {playerAttack.name}!</h3>
            <p className="damage">Dealt {playerAttack.damage} damage</p>
            {playerAttack.isWeakened && <p className="weakened">Your attack was weakened by 25%!</p>}
            {playerAttack.isExposed && <p className="exposed">Your attack was amplified by 25% due to the boss being exposed!</p>}
            {playerAttack.isConfused && <p className="confused">You were confused and played a random card!</p>}
            <p className="effect">{playerAttack.effect}</p>
          </div>
        </div>
      )}

      {newCard === null && bossHealth === 0 && (
        <div className="new-card-popup">
          <div className="new-card-content">
            <h3>Generating your reward...</h3>
            <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="5" />
          </div>
        </div>
      )}

      {newCard && (
        <div className="new-card-popup">
          <div className="new-card-content">
            <h3>Congratulations! You earned a new card:</h3>
            <div className="card-preview">
              <CardComponent
                card={{
                  id: newCard.card_id,
                  name: newCard.title,
                  type: newCard.type_id.toString(),
                  level: newCard.power_level,
                  mana: newCard.mana_cost,
                  effect: newCard.card_description,
                  image: newCard.image_url,
                }}
              />
            </div>
            <button className="accept-button" onClick={handleAcceptCard}>
              Accept
            </button>
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
        <div className={`deck-popup ${playerEffects.includes("Slowed") ? "slowed" : ""}`}>
          <div className="deck-popup-content">
            <h3>Your Cards</h3>
            <p>Click on a card to play it</p>
            <div className="cards-grid">
              {deck.map((card) => {
                const hasEnoughMana = localCharacter?.current_mana && localCharacter.current_mana >= card.mana;
                const isOnCooldown = isCardOnCooldown(card);
                const cooldownPercentage = getCooldownPercentage(card);
                const remainingTime = cooldownTimers[card.id] || 0;
                
                return (
                  <div
                    key={card.id}
                    className={`card ${!hasEnoughMana || isOnCooldown ? 'disabled' : ''} ${isOnCooldown ? 'cooldown' : ''}`}
                    style={{ backgroundImage: `url(${card.image})` }}
                    onClick={() => {
                      console.log(`Clicked on card ${card.id}`);
                      if (hasEnoughMana && !isOnCooldown) {
                        playCard(card);
                      }
                    }}
                  >
                    {isOnCooldown && (
                      <>
                        <div 
                          className="card-cooldown-overlay"
                          style={{ '--cooldown-percentage': `${cooldownPercentage}%` } as React.CSSProperties}
                        />
                        <div className="card-cooldown-timer">
                          {remainingTime}s
                        </div>
                      </>
                    )}
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

      <div className="action-buttons">
        <button className="button" onClick={handleBackToMain}>
          Back to Main
        </button>
      </div>
    </div>
  );
};

export default BossFightPage;
