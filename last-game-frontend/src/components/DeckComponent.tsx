import React from 'react';
import { Carousel } from 'primereact/carousel';
import CardComponent from './CardComponent';
import { Card } from '../context/GameContext';


interface CardCarouselProps {
    
    availableCards: Card[]; 
  }

const CardCarousel: React.FC<CardCarouselProps> = ({availableCards}) => {
  // sample cards, will cahnge
  /*const availableCards = [
    { id: 1, name: 'Fireball', level: 1, type: 'ATTACK', description: 'Deals 30 damage to an enemy.' },
    { id: 2, name: 'Heal', level: 2, type: 'ABILITY', description: 'Heals 20 health points.' },
    { id: 3, name: 'Shield', level: 1, type: 'POWER', description: 'Provides 15 defense for 2 turns.' },
    { id: 4, name: 'Lightning Strike', level: 3, type: 'ATTACK', description: 'Deals 50 damage to all enemies.' },
    { id: 5, name: 'Mana Burst', level: 1, type: 'ABILITY', description: 'Restores 40 mana.' },
  ];
    */
   
  //just returns card components
  const cardTemplate = (card: Card) => {
    return (
      <CardComponent
        id={card.id}
        name={card.name}
        level={card.level}
        type={card.type}
        description={card.description}
        image={card.image}
        mana={card.mana}
      />
    );
  };

  return (
    <div>
      <h2>Available Cards</h2>
      <Carousel value={availableCards} itemTemplate={cardTemplate} numVisible={3} numScroll={1} />
    </div>
  );
};

export default CardCarousel;