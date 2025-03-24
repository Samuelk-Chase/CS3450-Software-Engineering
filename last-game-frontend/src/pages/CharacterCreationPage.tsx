import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import backgroundImage from "../images/Login background.jpg";

const CharacterCreationPage: React.FC = () => {
  const [characterName, setCharacterName] = useState("");
  const [characterDescription, setCharacterDescription] = useState("");
  const [adventureDescription, setAdventureDescription] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
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

const fetchImage = async () => {
  const prompt = `Generate an image of a character named ${characterName}, described as: ${characterDescription}.`;
  const response = await fetch("http://localhost:8080/v1/image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
  const data = await response.json();
  if (data.length > 0 && data[0].b64_json) {
    return `data:image/jpeg;base64,${data[0].b64_json}`;
  }
  throw new Error("No image data received");
};

  const handleGenerateImage = async () => {
    if (characterName.trim() === "") return;
    setLoading(true);
    try {
      const imgDataUrl = await fetchImage();
      setImageUrl(imgDataUrl);
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateImage = async () => {
    await handleGenerateImage();
  };

  const handleCreateCharacter = async () => {
    if (userId === null || characterName.trim() === "" || imageUrl === "") {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("characterName", characterName);
      const safeName = characterName.toLowerCase().replace(/\s+/g, "_");
      formData.append("characterImage", blob, `${safeName}.png`);

      const uploadResponse = await fetch("http://localhost:8080/v1/uploadCharacterImage", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(errorText);
      }

      const savedFileName = await uploadResponse.text();

      const requestBody = {
        user_id: userId,
        name: characterName,
        image: savedFileName,
        mode: mode,
      };

      const createResponse = await fetch("http://localhost:8080/v1/getNewCharacter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (createResponse.ok) {
        const data = await createResponse.json();
        console.log("Character created successfully:", data);
        setCharacterName("");
        setImageUrl("");
        navigate("/character-account");
      } else {
        const errorText = await createResponse.text();
        console.error("Failed to create character:", errorText);
      }
    } catch (error) {
      console.error("Error:", error);
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

          {/* Generate Button */}
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Button
              label="Generate Image"
              className="p-button p-button-rounded p-shadow-3"
              style={{
                height: "60px",
                fontSize: "1.2rem",
                background: "linear-gradient(180deg, #27ae60 0%, #1e8449 100%)",
                border: "none",
                borderRadius: "12px",
              }}
              onClick={handleGenerateImage}
            />
          </div>
        </div>

        {/* RIGHT SIDE - Image Display */}
        <div style={{ flex: 1, marginLeft: "1rem", display: "flex", flexDirection: "column" }}>
          {imageUrl && (
            <div style={{ textAlign: "center", marginTop: "9rem" }}>
              <img
                src={imageUrl}
                alt="Character"
                style={{
                  maxWidth: "80%",
                  border: "3px solid #27ae60",
                  borderRadius: "10px",
                  marginBottom: "1rem",
                }}
              />
              <div>
                <Button
                  label="Generate New Image"
                  className="p-button-warning"
                  onClick={handleRegenerateImage}
                />
              </div>
            </div>
          )}
          {loading && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <ProgressSpinner />
            </div>
          )}
        </div>
      </div>

      {/* Create Character Button */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "10rem" }}>
        <Button
          label="Create Character"
          className="p-button p-button-rounded p-shadow-3"
          style={{
            width: "250px",
            height: "50px",
            fontSize: "1.4rem",
            fontWeight: "bold",
            background: "linear-gradient(180deg, #27ae60 0%, #1e8449 100%)",
            border: "none",
            borderRadius: "12px",
          }}
          onClick={handleCreateCharacter}
        />
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