import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import backgroundImage from "../images/Login background.jpg";
import axiosInstance from "../utils/axiosInstance"; // Import the Axios instance

const CharacterCreationPage: React.FC = () => {
  const [characterName, setCharacterName] = useState("");
  const [characterDescription, setCharacterDescription] = useState("");
  const [adventureDescription, setAdventureDescription] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"hard" | "soft">("soft");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId || isNaN(Number(storedUserId))) {
      localStorage.removeItem("userId");
      navigate("/login");
      return;
    }
    setUserId(Number(storedUserId));
  }, [navigate]);

  const handleCreateCharacter = async () => {
    if (userId === null || characterName.trim() === "") {
      return;
    }
    setLoading(true);
    try {
      const requestBody = {
        user_id: userId,
        name: characterName,
        description: characterDescription,
        mode: mode,
      };

      // Use axiosInstance to make the POST request
      const createResponse = await axiosInstance.post("/getNewCharacter", requestBody);

      if (createResponse.status === 200) {
        const data = createResponse.data;
        console.log("Character created successfully:", data);
        navigate("/character-account", { state: { newCharacter: data } });
      } else {
        console.error("Failed to create character:", createResponse.statusText);
      }
    } catch (error) {
      console.error("Error creating character:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "#E3C9CE",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          padding: "2rem",
        }}
      >
        <div style={{ flex: 1, marginRight: "1rem", padding: "9rem" }}>
          <h2 style={{ textAlign: "center" }}>GAME PLAY</h2>
          <div style={{ margin: "1rem 0" }}>
            <h3>Hard Beans:</h3>
            <p>
              In hard beans, players will play as if they are experiencing
              the story in real life. Players get one life and realistic
              health and stamina.
            </p>
          </div>
          <div style={{ margin: "1rem 0" }}>
            <h3>Soft Beans:</h3>
            <p>
              In soft beans, players will have merciful experiences. Games will
              be fun and challenging. If you die, you simply go back to the
              last successful save.
            </p>
          </div>

          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <label style={{ marginRight: "1rem" }}>
              <input
                type="radio"
                name="mode"
                value="hard"
                checked={mode === "hard"}
                onChange={() => setMode("hard")}
                style={{ marginRight: "0.5rem" }}
              />
              Hard Beans
            </label>
            <label>
              <input
                type="radio"
                name="mode"
                value="soft"
                checked={mode === "soft"}
                onChange={() => setMode("soft")}
                style={{ marginRight: "0.5rem" }}
              />
              Soft Beans
            </label>
          </div>

          {/* Character Name */}
          <h3 style={{ textAlign: "center" }}>Enter Your Character Name</h3>
          <InputText
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            style={inputStyle}
            placeholder="Character name..."
          />

          {/* Character Description */}
          <h3 style={{ textAlign: "center", marginTop: "2rem" }}>Describe Your Character</h3>
          <InputText
            value={characterDescription}
            onChange={(e) => setCharacterDescription(e.target.value)}
            style={inputStyle}
            placeholder="E.g., tall elf archer with glowing tattoos..."
          />

          {/* Adventure Description */}
          <h3 style={{ textAlign: "center", marginTop: "2rem" }}>Describe Your Adventure World</h3>
          <InputText
            value={adventureDescription}
            onChange={(e) => setAdventureDescription(e.target.value)}
            style={inputStyle}
            placeholder="E.g., snowy mountain kingdom ruled by dragons..."
          />

          {/* Create Character Button */}
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Button
              label="Create Character"
              className="p-button p-button-rounded p-shadow-3"
              style={{
                height: "60px",
                fontSize: "1.2rem",
                background: "linear-gradient(180deg, #27ae60 0%, #1e8449 100%)",
                border: "none",
                borderRadius: "12px",
              }}
              onClick={handleCreateCharacter}
              loading={loading}
            />
          </div>
        </div>

        {/* RIGHT SIDE - Loading Symbol */}
        <div style={{ flex: 1, marginLeft: "1rem", display: "flex", flexDirection: "column" }}>
          {loading && (
            <div style={{ textAlign: "center", marginTop: "calc(9rem + 200px)" }}>
              <div
                className="loading-container"
                style={{
                  position: "relative",
                  width: "400px",
                  height: "400px",
                  margin: "0 auto",
                }}
              >
                <ProgressSpinner
                  style={{ width: "400px", height: "400px" }}
                  strokeWidth="5"
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "#fff",
                    fontSize: "28px",
                    textAlign: "center",
                  }}
                >
                  Creating character
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  fontSize: "1.2rem",
  backgroundColor: "#444444",
  color: "#E3C9CE",
  border: "2px solid #20683F",
  borderRadius: "8px",
  marginTop: "0.5rem",
};

export default CharacterCreationPage;