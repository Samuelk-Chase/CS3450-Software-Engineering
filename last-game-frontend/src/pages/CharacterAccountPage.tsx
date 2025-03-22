import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import backgroundImage from "../images/Login background.jpg";

interface Character {
  character_id: number;
  character_name: string;
  current_hp: number; // renamed to match backend
  max_hp: number;     // renamed to match backend
  current_mana: number;
  max_mana: number;
}

const CharacterAccountPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [slideIn, setSlideIn] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId || isNaN(Number(userId))) {
      console.error("Invalid user ID! Redirecting to login...");
      localStorage.removeItem("userId");
      navigate("/login");
      return;
    }

    const apiUrl = `http://localhost:8080/v1/characters?user_id=${userId}`;
    console.log("Fetching characters from:", apiUrl);

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched characters:", data);
        setCharacters(data);
      })
      .catch((error) => console.error("Error fetching characters:", error));
  }, [navigate, userId]);

  // When a character is selected, trigger the slide after the overlay is rendered
  useEffect(() => {
    if (selectedCharacter) {
      const timer = setTimeout(() => {
        setSlideIn(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setSlideIn(false);
    }
  }, [selectedCharacter]);

  // Handle character click by saving the selected character
  const handleCharacterSelect = (character: Character) => {
    console.log(`Selected character ID: ${character.character_id}`);
    setSelectedCharacter(character);
  };

  // Close the overlay
  const handleCloseOverlay = () => {
    setSelectedCharacter(null);
  };

  // Navigate to the main view with the selected character
  const handlePlay = () => {
    if (selectedCharacter) {
      localStorage.setItem("characterId", String(selectedCharacter.character_id));
      navigate("/main");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        minHeight: "100vh",
        color: "#E3C9CE",
        textAlign: "center",
        padding: "2rem",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Select Your Character</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
        Choose a character to enter the game.
      </p>

      {/* Horizontal Scrollable Container for Character Cards */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          padding: "1rem 0",
          gap: "10px",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {characters.map((char) => {
          const safeName = char.character_name.toLowerCase().replace(/\s+/g, "_");
          const imageUrl = `http://localhost:8080/character_images/${safeName}.png`;

          return (
            <div
              key={char.character_id}
              onClick={() => handleCharacterSelect(char)}
              style={{
                flex: "0 0 auto",
                margin: "0 5px",
                cursor: "pointer",
                border: "1px solid #27ae60",
                borderRadius: "8px",
                width: "250px",
                height: "500px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={imageUrl}
                alt={char.character_name}
                onError={(e) => {
                  console.log("Error loading image for:", char.character_name, "at URL:", imageUrl);
                  e.currentTarget.src = "/default-image.png"; // Fallback image if error occurs
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  background: "rgba(0, 0, 0, 0.5)",
                  color: "#E3C9CE",
                  textAlign: "center",
                  padding: "0.5rem",
                }}
              >
                <h3 style={{ margin: 0 }}>{char.character_name}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Character Button */}
      <Button
        label="Create Character"
        className="p-button p-button-rounded p-shadow-3"
        style={{
          marginTop: "2rem",
          width: "200px",
          height: "50px",
          fontSize: "1.4rem",
          fontWeight: "bold",
          background: "linear-gradient(180deg, #27ae60 0%, #1e8449 100%)",
          border: "none",
          borderRadius: "12px",
        }}
        onClick={() => navigate("/character-creation")}
      />

      {/* Overlay for Expanded Character */}
      {selectedCharacter && (
        <div
          onClick={handleCloseOverlay}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1000,
            padding: "2rem",
            boxSizing: "border-box",
          }}
        >
          {/* Flex container with image on the left and stats on the right */}
          <div
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the container
            style={{
              display: "flex",
              backgroundColor: "#222",
              borderRadius: "8px",
              overflow: "hidden",
              width: "90%",
              maxWidth: "1200px",
              position: "absolute",
              top: "50%",
              left: slideIn ? "5%" : "50%",
              transform: slideIn ? "translate(0, -50%)" : "translate(-50%, -50%)",
              transition: "left 0.5s ease, transform 0.5s ease",
            }}
          >
            {/* Image Section */}
            <div
              style={{
                flex: "0 0 900px",
                height: "1000px",
              }}
            >
              <img
                src={`http://localhost:8080/character_images/${selectedCharacter.character_name
                  .toLowerCase()
                  .replace(/\s+/g, "_")}.png`}
                alt={selectedCharacter.character_name}
                onError={(e) => {
                  e.currentTarget.src = "/default-image.png";
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            {/* Stats Section */}
            <div
              style={{
                flex: 1,
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "left",
              }}
            >
              <h2>{selectedCharacter.character_name}</h2>
              <p>
                <strong>Health:</strong> {selectedCharacter.current_hp} / {selectedCharacter.max_hp}
              </p>
              <p>
                <strong>Mana:</strong> {selectedCharacter.current_mana} / {selectedCharacter.max_mana}
              </p>
              <p>
                <strong>Cards:</strong> N/A
              </p>
              <div style={{ marginTop: "2rem" }}>
                <Button
                  label="Play"
                  onClick={handlePlay}
                  style={{
                    width: "250px",
                    height: "70px",
                    fontSize: "2rem",
                    background: "linear-gradient(180deg, #27ae60 0%, #1e8449 100%)",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterAccountPage;