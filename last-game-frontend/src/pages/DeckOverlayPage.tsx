import React from 'react';
import '../css/CardView.css';

const cards = [
  {
    id: 1,
    name: "Dagger",
    type: "Attack",
    level: 1,
    mana: 3,
    effect: "Deal a Guaranteed 20 damage per hit",
    image: "src/images/dagger.jpg"
  },
  {
    id: 2,
    name: "Necromancy",
    type: "Ability",
    level: 6,
    mana: 7,
    effect: "Bring back opponent for your team",
    image: "src/images/necromancy.jpg"
  },
  {
    id: 3,
    name: "Mirrors",
    type: "Ability",
    level: 1,
    mana: 1,
    effect: "Any damage done to you reflects to opponent",
    image: "src/images/magicmirror.jpg"
  },
  {
    id: 4,
    name: "Health",
    type: "Power",
    level: 2,
    mana: 4,
    effect: "Heal instantly",
    image: "src/images/heath.jpg"
  },
  {
    id: 5,
    name: "Fireball",
    type: "Attack",
    level: 3,
    mana: 10,
    effect: "Burns opponent, dealing 30 damage over 3 turns",
    image: "src/images/fireball.jpg"
  }
];

interface CardViewProps {
  onClose: () => void;
}

const CardView: React.FC<CardViewProps> = ({ onClose }) => {
  return (
    <div className="deck-modal-overlay">
      <div className="deck-modal-content">
        <h2>Your Card Deck</h2>
        <div className="card-scroll-container">
          {cards.map((card) => (
            <div
              key={card.id}
              className="card"
              style={{ backgroundImage: `url(${card.image})` }}
            >
              <div className="mana-cost">{card.mana}</div>
              <h3 className="card-title">{card.name}</h3>
              <div className="card-effect">{card.effect}</div>
              <div className="card-footer">
                <span className="card-level">LV: {card.level}</span>
                <span className="card-type">{card.type}</span>
              </div>
            </div>
          ))}
        </div>

        <button className="close-button" onClick={onClose}>
          Back
        </button>
      </div>
    </div>
  );
};

export default CardView;