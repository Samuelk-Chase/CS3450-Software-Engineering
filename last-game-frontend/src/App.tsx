import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CharacterCreationPage from './pages/CharacterCreationPage';
import MainPlayerView from './pages/MainPlayerView';
import BossFightPage from './pages/BossFightPage';
import DeckOverlayPage from './pages/DeckOverlayPage';
import CharacterAccountPage from './pages/CharacterAccountPage';
import SignupPage from './pages/SignupPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? <>{element}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

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
