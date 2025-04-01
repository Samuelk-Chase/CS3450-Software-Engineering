// DeckOverlayPage.tsx
import React from "react";
import { Card } from "../context/GameContext";
import CardComponent from "../components/CardComponent";
import "../css/CardView.css";

interface CardViewProps {
  onClose: () => void;
  cards: Card[];
}

const CardView: React.FC<CardViewProps> = ({ onClose, cards }) => {
  console.log("CardView rendered with cards:", cards);

  return (
    <div className="deck-modal-overlay">
      <div className="deck-modal-content">
        <h2>Your Deck</h2>
        <div className="card-scroll-container">
          {cards.length > 0 ? (
            cards.map((card) => (
              <CardComponent key={card.id} card={card} />
            ))
          ) : (
            <p>No cards in your deck yet.</p>
          )}
        </div>
        <button
          className="close-button"
          onClick={() => {
            console.log("Closing CardView");
            onClose();
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CardView;