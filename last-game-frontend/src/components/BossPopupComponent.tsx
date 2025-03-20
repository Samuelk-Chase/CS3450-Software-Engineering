import React from "react";
import "../css/BossPopupComponent.css"; // Import the CSS file

interface BossPopupProps {
  boss: any; // Type it more specifically if you have more details about the boss structure
  onClose: () => void;
  onStartBossFight: () => void;
}

const BossPopupComponent: React.FC<BossPopupProps> = ({ boss, onClose, onStartBossFight }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Boss Combat Begins!</h2>
        <p>A new boss has appeared: {boss.name}</p>
        <button className="button" onClick={onStartBossFight}>
          Enter Boss Fight
        </button>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default BossPopupComponent;