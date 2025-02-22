// src/pages/DeckOverlayPage.tsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const DeckOverlayPage: React.FC = () => {
  const { deck } = useContext(GameContext);
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1); // go back to the previous page
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Deck</h2>
      <div className="p-d-flex p-flex-wrap">
        {deck.map((card) => (
          <div key={card.id} style={{ width: '200px', margin: '1rem' }}>
            <Card
              title={card.name}
              subTitle={`LV: ${card.level} - ${card.type}`}
              style={{ textAlign: 'center' }}
            >
              <p>{card.description}</p>
            </Card>
          </div>
        ))}
      </div>
      <Button label="Close" onClick={handleClose} className="p-button-secondary" />
    </div>
  );
};

export default DeckOverlayPage;