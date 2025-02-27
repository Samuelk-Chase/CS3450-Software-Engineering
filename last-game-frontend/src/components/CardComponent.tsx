import React from 'react';
import { Card } from 'primereact/card';
import {Card as CardType} from '../context/GameContext';

//this mirrors the interfaec in context file
interface CardProps extends CardType {}

const CardComponent: React.FC<CardProps> = ({ id, name, level, type, description, image, mana }) => {
  return (
    <Card title={name}
        header={<img alt="Card" src={image} />}
        subTitle={`LV: ${level} | MANA: ${mana}`} 
        //we can change this to dynamically render a button that either adds the card to the deck
        //or uses the card in the game
        footer={<button>USE (placeholder)</button>}
        style={{ width: '100%' }}>
        <p>{description}</p>
        <div className="p-text-right">{type}</div>
    </Card>
  );
};

export default CardComponent;
