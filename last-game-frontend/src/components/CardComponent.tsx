import React from "react";
import "../css/CardComponent.css"; // Make sure to include or merge the boss fight CSS here

interface CardProps {
  card: {
    id: number;
    name: string;
    type: string;
    level: number;
    mana: number;
    effect: string;
    image: string;
  };
  onClick?: () => void; // Optional click handler
}

const CardComponent: React.FC<CardProps> = ({ card, onClick }) => {
  return (
    <div
      className="card"
      style={{ backgroundImage: `url(${card.image})` }}
      onClick={onClick}
    >
      <div className="card-mana">{card.mana}</div>
      <div className="card-title">{card.name}</div>
      <div className="card-level">Level: {card.level}</div>
      <div className="card-description">{card.effect}</div>
    </div>
  );
};

export default CardComponent;