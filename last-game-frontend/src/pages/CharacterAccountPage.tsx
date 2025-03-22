import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import backgroundImage from "../images/Login background.jpg"; // Import the background image

interface Character {
  character_id: number;
  character_name: string;
  current_hp: number;
  max_hp: number;
  current_mana: number;
  max_mana: number;
}

const CharacterAccountPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
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

  // Function to select a character and navigate to the game
  const handleCharacterSelect = (characterId: number) => {
    console.log(`Selected character ID: ${characterId}`);
    localStorage.setItem("characterId", String(characterId)); // Store in localStorage
    navigate("/main"); // Redirect to game
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
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
        Select Your Character
      </h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
        Choose a character to enter the game.
      </p>

      {/* Display Character List */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "20px",
          maxWidth: "800px",
        }}
      >
        {characters.map((char) => {
          const safeName = char.character_name.toLowerCase().replace(/\s+/g, "_");
          const imageUrl = `http://localhost:8080/character_images/${safeName}.png`;
          console.log("Rendering character:", char.character_name, "with image URL:", imageUrl);

          return (
            <div
              key={char.character_id}
              className="card"
              onClick={() => handleCharacterSelect(char.character_id)}
              style={{
                position: "relative",
                cursor: "pointer",
                border: "1px solid #27ae60",
                borderRadius: "8px",
                width: "250px",
                height: "500px", // Increased height for a taller card
                overflow: "hidden",
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
              {/* Overlay text at the bottom of the image */}
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
    </div>
  );
};

export default CharacterAccountPage;