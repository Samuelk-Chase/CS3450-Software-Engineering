import React from "react";
import "../css/BossPopupComponent.css";
import { Boss } from "../context/GameContext";

interface BossPopupProps {
  boss: Boss;
  onClose: () => void;
  onStartBossFight: () => void;
}

const BossPopup: React.FC<BossPopupProps> = ({ boss, onClose, onStartBossFight }) => {
  console.log(boss.name);
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

  export default BossPopup;