// src/pages/BossFightPage.tsx
import React, { useContext, useState } from 'react';
import { GameContext } from '../context/GameContext';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';

const BossFightPage: React.FC = () => {
  const { character, updateStats } = useContext(GameContext);

  // Example boss health
  const [bossHealth, setBossHealth] = useState(100);

  const handleAttack = () => {
    // Simple example: reduce boss health by 10, reduce player mana by 5
    setBossHealth((prev) => Math.max(prev - 10, 0));
    if (character) {
      const newMana = Math.max(character.mana - 5, 0);
      updateStats(character.health, newMana);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Boss Fight!</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <img 
            src="https://via.placeholder.com/150" 
            alt="Your Character" 
            style={{ borderRadius: '50%' }}
          />
          <h3>{character?.name}</h3>
          <p>Health: {character?.health}</p>
          <p>Mana: {character?.mana}</p>
          <Button label="Attack" onClick={handleAttack} className="p-button-danger" />
        </div>

        <div style={{ textAlign: 'center' }}>
          <img 
            src="https://via.placeholder.com/150/FF0000/FFFFFF" 
            alt="Boss" 
            style={{ borderRadius: '50%' }}
          />
          <h3>Dark Fiend</h3>
          <p>Health: {bossHealth}</p>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h4>Boss Health</h4>
        <ProgressBar value={bossHealth} />
      </div>
    </div>
  );
};

export default BossFightPage;