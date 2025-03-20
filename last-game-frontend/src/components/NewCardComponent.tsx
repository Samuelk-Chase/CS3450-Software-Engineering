import React from 'react';
import "../css/NewCardComponent.css";

interface NewCardComponentProps {
  card: {
    card_description: string;
    title: string;
    type: string;
    level: number;
    mana: number;
    effect: string;
    image_url: string;
  };
  onClose: () => void;
}



const NewCardComponent: React.FC<NewCardComponentProps> = ({ card, onClose }) => {
    
    
  return (
    
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>New Card Received: {card.title}</h2>
        <img src={card.image_url} alt={card.title} className="card-image" />
        <div className="card-details">
          {card.card_description}
        </div>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default NewCardComponent;