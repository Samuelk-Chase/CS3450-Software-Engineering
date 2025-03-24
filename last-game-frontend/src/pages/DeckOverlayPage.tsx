import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/CardView.css';
import backgroundImage from '../images/Login background.jpg'; // Import the background image

const cards = [
  { id: 1, name: "Dagger", type: "Attack", level: 1, mana: 3, effect: "Deal a Guaranteed 20 damage per hit", image: "src/images/dagger.jpg" },
  { id: 2, name: "Necromancy", type: "Ability", level: 6, mana: 7, effect: "Bring back opponent for your team", image: "src/images/necromancy.jpg" },
  { id: 3, name: "Mirrors", type: "Ability", level: 1, mana: 1, effect: "Any damage done to you reflects to opponent", image: "src/images/magicmirror.jpg" },
  { id: 4, name: "Health", type: "Power", level: 2, mana: 4, effect: "Heal instantly", image: "src/images/heath.jpg" },
  { id: 5, name: "Fireball", type: "Attack", level: 3, mana: 10, effect: "Burns opponent, dealing 30 damage over 3 turns", image: "src/images/fireball.jpg" },
  // { id: 6, name: "Ice Shield", type: "Ability", level: 4, mana: 8, effect: "Reduces incoming damage by 50% for 2 turns", image: "src/images/iceshield.jpg" },
  // { id: 7, name: "Lightning Strike", type: "Attack", level: 5, mana: 12, effect: "Hits all enemies for 25 damage", image: "src/images/lightningstrike.jpg" },
  // { id: 8, name: "Mana Surge", type: "Power", level: 2, mana: 5, effect: "Regain 50% of total mana instantly", image: "src/images/manasurge.jpg" },
  // { id: 9, name: "Dark Pact", type: "Ability", level: 6, mana: 10, effect: "Sacrifice 20 health to deal 40 damage", image: "src/images/darkpact.jpg" },
  // { id: 10, name: "Holy Blessing", type: "Power", level: 5, mana: 9, effect: "Heal all allies for 20 health", image: "src/images/holyblessing.jpg" }
];

const CardViewPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    window.history.back(); // This takes the user back to the previous page
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        color: "#E3C9CE", // White text color for readability
        textAlign: "center",
        padding: "2rem",
        boxSizing: "border-box",
      }}
    >
      <h1 className="page-title">Your Card Collection</h1>

      {/* Scrollable Card Grid */}
      <div className="card-scroll-container">
        {cards.map((card) => (
          <div
            key={card.id}
            className="card"
            style={{ backgroundImage: `url(${card.image})` }}
          >
            {/* Mana Cost */}
            <div className="mana-cost">{card.mana}</div>

            {/* Card Title */}
            <h3 className="card-title">{card.name}</h3>

            {/* Card Effect */}
            <div className="card-effect">{card.effect}</div>

            {/* Bottom Stats */}
            <div className="card-footer">
              <span className="card-level">LV: {card.level}</span>
              <span className="card-type">{card.type}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Back Button to Previous Page */}
      <button className="back-button" onClick={handleBackButtonClick}>
        Back 
      </button>
    </div>
  );
};

export default CardViewPage;