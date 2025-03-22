import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";

const CharacterCreationPage: React.FC = () => {
  const [characterName, setCharacterName] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (!storedUserId || isNaN(Number(storedUserId))) {
      localStorage.removeItem("userId"); // Remove invalid value
      navigate("/login");
      return;
    }

    setUserId(Number(storedUserId)); // Convert to number
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

  // Generate image based on the character name
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

  // Regenerate image if user doesn't like the current one (using same endpoint)
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

// Create character and send image to backend
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
    // Append blob with a filename using the character name.
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
    // The backend returns the filename of the saved image.
    const savedFileName = await uploadResponse.text();

    // Now create the character record using the saved image filename.
    const requestBody = {
      user_id: userId,
      name: characterName,
      image: savedFileName,
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
      setShowDialog(false);
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

  // Styles for the dialog components
  const dialogStyles = {
    backgroundColor: "black",
    color: "#E3C9CE",
    border: "3px solid #27ae60",
    boxShadow: "0 0 15px #27ae60, 0 0 30px #1e8449",
    borderRadius: "10px",
    padding: "20px",
  };

  const headerStyles = {
    backgroundColor: "black",
    color: "#27ae60",
    borderBottom: "2px solid #27ae60",
  };

  const footerStyles = {
    backgroundColor: "black",
    borderTop: "2px solid #27ae60",
  };

  return (
    <div
      style={{
        backgroundColor: "#333333",
        minHeight: "100vh",
        padding: "4rem",
        color: "#E3C9CE",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h3 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
        Enter Your Character Name
      </h3>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem", width: "50%" }}>
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
          }}
          placeholder="Enter your character name..."
        />
        <Button
          label="Generate Image"
          className="p-button p-button-rounded p-shadow-3"
          style={{
            marginLeft: "1rem",
            height: "60px",
            fontSize: "1.2rem",
            background: "linear-gradient(180deg, #27ae60 0%, #1e8449 100%)",
            border: "none",
            borderRadius: "12px",
          }}
          onClick={handleGenerateImage}
        />
      </div>

      <Button
        label="Create Character"
        className="p-button p-button-rounded p-shadow-3"
        style={{
          width: "50%",
          height: "60px",
          fontSize: "1.8rem",
          fontWeight: "bold",
          background: "linear-gradient(180deg, #27ae60 0%, #1e8449 100%)",
          border: "none",
          borderRadius: "12px",
        }}
        onClick={() => setShowDialog(true)}
      />

      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header="Confirm Character Creation"
        modal
        style={{ width: "30vw", ...dialogStyles }}
      >
        <div style={headerStyles}>
          <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#E3C9CE" }}>
            Are you sure you want to create the character <b>{characterName}</b>?
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <Button
            label="Cancel"
            className="p-button-secondary"
            onClick={() => setShowDialog(false)}
          />
          <Button
            label="Confirm"
            className="p-button-success"
            onClick={handleCreateCharacter}
          />
        </div>
        <div style={footerStyles} />
      </Dialog>

      {imageUrl && (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <h4>Your Generated Character Image</h4>
          <img
            src={imageUrl}
            alt="Character"
            style={{ maxWidth: "50%", border: "3px solid #27ae60", borderRadius: "10px" }}
          />
          <div style={{ marginTop: "1rem" }}>
            <Button
              label="Generate New Image"
              className="p-button-warning"
              onClick={handleRegenerateImage}
            />
          </div>
        </div>
      )}

      {loading && (
        <div style={{ marginTop: "20px" }}>
          <ProgressSpinner />
        </div>
      )}
    </div>
  );
};

export default CharacterCreationPage;