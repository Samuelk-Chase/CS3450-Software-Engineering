import React from "react";
import "../css/NewCardComponent.css"; // Apply only individual card styling
import CardComponent from "./CardComponent";

interface NewCardComponentProps {
  card: {
    id: number;
    name: string;
    type: string;
    level: number;
    mana: number;
    effect: string;
    image: string;
  } | null;
  onClose: () => void;
}

const NewCardComponent: React.FC<NewCardComponentProps> = ({ card, onClose }) => {
  if (!card) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <CardComponent card={card} /> {/* Uses the separated stylin */}
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default NewCardComponent;