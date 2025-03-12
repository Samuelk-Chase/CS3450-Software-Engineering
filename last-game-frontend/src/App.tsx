import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CharacterCreationPage from './pages/CharacterCreationPage';
import MainPlayerView from './pages/MainPlayerView';
import BossFightPage from './pages/BossFightPage';
import DeckOverlayPage from './pages/DeckOverlayPage';
import CharacterAccountPage from './pages/CharacterAccountPage'
import SignupPage from './pages/SignUpPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/character-creation" element={<CharacterCreationPage />} />
        <Route path="/main" element={<MainPlayerView />} />
        <Route path="/boss" element={<BossFightPage />} />
        <Route path="/deck" element={<DeckOverlayPage />} />
        <Route path="/character-account" element={<CharacterAccountPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

      </Routes>
    </Router>
  );
}

export default App;