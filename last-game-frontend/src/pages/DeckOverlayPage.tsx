import React from 'react';
import '../css/CardView.css';
import { Card } from '../context/GameContext';
import CardComponent from '../components/CardComponent';

interface CardViewProps {
  onClose: () => void;
  cards: Card[];
}

const CardView: React.FC<CardViewProps> = ({ onClose, cards }) => {
  return (
    <div className="deck-modal-overlay">
      <div className="deck-modal-content">
        <h2>Your Deck</h2>
        <div className="card-scroll-container">
          {cards.map((card) => (
            <CardComponent key={card.id} card={card} />
          ))}
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CardView;