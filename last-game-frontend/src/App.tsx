import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CharacterCreationPage from './pages/CharacterCreationPage';
import MainPlayerView from './pages/MainPlayerView';
import BossFightPage from './pages/BossFightPage';
import DeckOverlayPage from './pages/DeckOverlayPage';
import CharacterAccountPage from './pages/CharacterAccountPage';
import SignupPage from './pages/SignupPage';
import OauthCallback from './pages/OauthCallback';

// Protected Route Component
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioAllowed, setIsAudioAllowed] = useState(false);
  const navigate = useNavigate();
  const baseUrl = window.location.hostname.includes('localhost')
    ? 'http://localhost:8080/api/v1' // Development URL
    : ''; // Production URL (hosting frontend from backend)

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  useEffect(() => {
    if (isLoggedIn) {
      const fetchAudio = async () => {
        try {
          const response = await fetch(`${baseUrl}/backgroundaudio`);
          if (!response.ok) {
            throw new Error("Failed to fetch audio");
          }

          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioSrc(audioUrl);
        } catch (error) {
          console.error("Error fetching audio:", error);
        }
      };

      fetchAudio();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleInteraction = () => {
      if (!isAudioAllowed) {
        setIsAudioAllowed(true);
        if (audioRef.current) {
          audioRef.current.play().catch((e) => {
            console.error("Error playing audio:", e);
          });
        }
      }
    };

    if (isLoggedIn) {
      window.addEventListener("click", handleInteraction);
      window.addEventListener("keydown", handleInteraction);
    }

    return () => {
      if (isLoggedIn) {
        window.removeEventListener("click", handleInteraction);
        window.removeEventListener("keydown", handleInteraction);
      }
    };
  }, [isAudioAllowed, isLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {/* Background audio */}
      {audioSrc && (
        <audio ref={audioRef} loop>
          <source src={audioSrc} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          bottom: "50px",
          left: "20px",
          padding: "15px 30px",
          backgroundColor: "#cc0000",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 1000,
          fontSize: "16px",
          fontWeight: "bold",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
        }}
      >
        Logout
      </button>
      {element}
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/oauth-callback" element={<OauthCallback />} />

        {/* Protected Routes */}
        <Route path="/character-creation" element={<ProtectedRoute element={<CharacterCreationPage />} />} />
        <Route path="/character-account" element={<ProtectedRoute element={<CharacterAccountPage />} />} />
        <Route path="/main" element={<ProtectedRoute element={<MainPlayerView />} />} />
        <Route path="/boss" element={<ProtectedRoute element={<BossFightPage />} />} />
        <Route path="/deck" element={<ProtectedRoute element={<DeckOverlayPage />} />} />

        {/* Catch-all route (Redirect to Login if no match) */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
