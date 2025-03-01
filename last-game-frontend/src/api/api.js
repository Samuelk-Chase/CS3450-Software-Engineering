const API_BASE_URL = "http://localhost:8080/v1"; // Update for production

export const createNewCharacter = async (characterData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/getNewCharacter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(characterData),
    });

    if (!response.ok) throw new Error("Failed to create character");

    return await response.json();
  } catch (error) {
    console.error("Error creating character:", error);
    return null;
  }
};