import React, { useState } from 'react';
import GameManual from './GameManual';

interface MainPlayerViewProps {
  character: {
    id: string;
    name: string;
    // Add other character properties as needed
  };
}

const MainPlayerView: React.FC<MainPlayerViewProps> = ({ character }) => {
  const [showManual, setShowManual] = useState(false);

  return (
    <div className="main-player-view">
      <button 
        className="manual-button"
        onClick={() => setShowManual(true)}
      >
        Game Manual
      </button>
      {showManual && (
        <GameManual onClose={() => setShowManual(false)} />
      )}
    </div>
  );
};

export default MainPlayerView; 