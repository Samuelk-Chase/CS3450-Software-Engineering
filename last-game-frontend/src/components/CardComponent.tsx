import React from "react";
import "../css/CardComponent.css"; // Import the new CSS
import cardImage from "../images/fireball.jpg"; // Static image for background

interface CardProps {
  card: {
    id: number;
    name: string;
    type: string;
    level: number;
    mana: number;
    effect: string;
    image: string; // This is now unnecessary since we're using a static image
  };
}

const CardComponent: React.FC<CardProps> = ({ card }) => {
  return (
    <div className="individual-card-wrapper">
      <div className="individual-card">
        {/* Image container */}
        <div className="individual-card-image">
          <img src={cardImage} alt={card.name} className="card-image" />
        </div>
        
        {/* Card Content */}
        <div className="card-content">
          {/* Card Title */}
          <h3 className="individual-card-title">{card.name}</h3>
          
          {/* Card Effect Description */}
          <div className="individual-card-effect">{card.effect}</div>
          
          {/* Card Footer */}
          <div className="individual-card-footer">
            <span className="card-level">LV: {card.level}</span>
            <span className="card-type">{card.type}</span>
          </div>
        </div>
      </div>
      {/* Mana Cost */}
      <div className="individual-mana-cost">{card.mana}</div>
    </div>
  );
};

export default CardComponent;