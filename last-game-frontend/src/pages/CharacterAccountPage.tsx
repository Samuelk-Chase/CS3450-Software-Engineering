import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

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
      localStorage.removeItem("userId"); // Remove incorrect value
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
    localStorage.setItem("characterId", String(characterId)); // ✅ Store in localStorage
    navigate("/main"); // ✅ Redirect to game
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#222222",
        color: "#E3C9CE",
        textAlign: "center",
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
        {characters.map((char) => (
          <div
            key={char.character_id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              padding: "10px",
              backgroundColor: "#444",
              borderRadius: "12px",
              border: "3px solid #20683F",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
              transition: "0.3s ease",
            }}
            onClick={() => handleCharacterSelect(char.character_id)} // ✅ Click to select character
          >
            <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#FFF" }}>
              {char.character_name}
            </h3>
            <p style={{ fontSize: "1.1rem", color: "#AAAAAA" }}>
              HP: {char.current_hp}/{char.max_hp} | Mana: {char.current_mana}/{char.max_mana}
            </p>
          </div>
        ))}
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