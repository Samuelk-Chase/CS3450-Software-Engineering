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
    <div className="individual-card" style={{ backgroundImage: `url(${cardImage})` }}>
      <div className="individual-mana-cost">{card.mana}</div>
      <h3 className="individual-card-title">{card.name}</h3>
      <div className="individual-card-effect">{card.effect}</div>
      <div className="individual-card-footer">
        <span className="card-level">LV: {card.level}</span>
        <span className="card-type">{card.type}</span>
      </div>
    </div>
  );
};

export default CardComponent;