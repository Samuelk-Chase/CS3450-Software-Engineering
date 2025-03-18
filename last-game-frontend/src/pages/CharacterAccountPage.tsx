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
        minHeight: "100vh", // Ensure it takes full viewport height
        color: "#E3C9CE", // White text color for better readability
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
        {characters.map((char) => (
          <div
            key={char.character_id}
            className="card" // Ensure this matches the CSS class for cards
            onClick={() => handleCharacterSelect(char.character_id)}
          >
            <h3>{char.character_name}</h3>
            <p>HP: {`${char.current_hp}/${char.max_hp}`} | Mana: {`${char.current_mana}/${char.max_mana}`}</p>
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