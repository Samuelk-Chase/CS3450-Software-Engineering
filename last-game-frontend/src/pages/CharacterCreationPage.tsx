import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";

// 1) Import your background image
import backgroundImage from "../images/Login background.jpg";

const CharacterCreationPage: React.FC = () => {
  const [characterName, setCharacterName] = useState("");
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

  // Common function to fetch image from backend endpoint
  const fetchImage = async (prompt: string) => {
    const requestBody = { prompt };
    const response = await fetch("http://localhost:8080/v1/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
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
      const imgDataUrl = await fetchImage(characterName);
      setImageUrl(imgDataUrl);
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateImage = async () => {
    if (characterName.trim() === "") return;
    setLoading(true);
    try {
      const imgDataUrl = await fetchImage(characterName);
      setImageUrl(imgDataUrl);
    } catch (error) {
      console.error("Failed to regenerate image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCharacter = async () => {
    if (userId === null || characterName.trim() === "" || imageUrl === "") {
      return;
    }
    setLoading(true);

    try {
      // Convert the data URL (base64) to a blob.
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create a FormData object and append the character name and image file.
      const formData = new FormData();
      formData.append("characterName", characterName);
      const safeName = characterName.toLowerCase().replace(/\s+/g, "_");
      formData.append("characterImage", blob, `${safeName}.png`);

      // Upload image using the /uploadCharacterImage endpoint.
      const uploadResponse = await fetch("http://localhost:8080/v1/uploadCharacterImage", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(errorText);
      }
      const savedFileName = await uploadResponse.text();

      // Now create the character record using the saved image filename.
      const requestBody = {
        user_id: userId,
        name: characterName,
        image: savedFileName,
        mode: mode, // include the selected mode
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
        navigate("/character-account"); // Navigate to the account page
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
        // Use your background image
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
      {/* Main row: left half text, right half image */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          padding: "2rem",
        }}
      >
        {/* LEFT HALF: All text (Hard/Soft modes, name input, generate button) */}
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

          {/* Radio Buttons to Choose Hard/Soft */}
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

          {/* Character Name Input + Generate Image Button */}
          <h3 style={{ textAlign: "center", marginBottom: "9rem" }}>
            Enter Your Character Name
          </h3>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
            <InputText
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              style={{
                flex: 1,
                padding: "10px",
                fontSize: "1.4rem",
                backgroundColor: "#444444",
                color: "#E3C9CE",
                border: "2px solid #20683F",
                borderRadius: "8px",
                marginRight: "1rem",
              }}
              placeholder="Enter your character name..."
            />
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

        {/* RIGHT HALF: Display Generated Image */}
        <div style={{ flex: 1, marginLeft: "1rem", display: "flex", flexDirection: "column" }}>
          {imageUrl && (
            <div style={{ textAlign: "center", marginBottom: "2rem", marginTop: "9rem" }}>
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

   {/* BOTTOM: Centered "Create Character" Button */}
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

export default CharacterCreationPage;