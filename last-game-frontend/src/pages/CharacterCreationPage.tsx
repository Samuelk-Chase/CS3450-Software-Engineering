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
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (!storedUserId || isNaN(Number(storedUserId))) {
      alert("You are not logged in. Redirecting to login...");
      localStorage.removeItem("userId"); // Remove invalid value
      navigate("/login");
      return;
    }

    setUserId(Number(storedUserId)); // Convert to number
  }, [navigate]);

  // Handle character creation
  const handleCreateCharacter = async () => {
    if (userId === null) {
      alert("User not logged in!");
      return;
    }
    if (characterName.trim() === "") {
      alert("Please enter a character name.");
      return;
    }

    setLoading(true); // Show loading spinner

    const requestBody = {
      user_id: userId,
      name: characterName,
    };

    try {
      const response = await fetch("http://localhost:8080/v1/getNewCharacter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        alert("Character created successfully!");
        setCharacterName(""); // Reset input field
        navigate("/character-account"); // Redirect back to character selection
      } else {
        const errorText = await response.text();
        console.error("Failed to create character:", errorText);
        alert(`Failed to create character: ${errorText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating character.");
    } finally {
      setLoading(false);
    }
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
      <InputText
        value={characterName}
        onChange={(e) => setCharacterName(e.target.value)}
        style={{
          width: "50%",
          padding: "10px",
          fontSize: "1.4rem",
          backgroundColor: "#444444",
          color: "#E3C9CE",
          border: "2px solid #20683F",
          borderRadius: "8px",
          marginBottom: "2rem",
        }}
        placeholder="Enter your character name..."
      />

      {/* Create Character Button */}
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

      {/* Confirmation Dialog */}
      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header="Confirm Character Creation"
        modal
        style={{ width: "30vw" }}
      >
        <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
          Are you sure you want to create the character <b>{characterName}</b>?
        </p>
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
      </Dialog>

      {/* Loading Spinner */}
      {loading && (
        <div style={{ marginTop: "20px" }}>
          <ProgressSpinner />
        </div>
      )}
    </div>
  );
};

export default CharacterCreationPage;