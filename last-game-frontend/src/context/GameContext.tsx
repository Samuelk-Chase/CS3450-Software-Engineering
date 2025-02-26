// src/context/GameContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface User {
  username: string;
  email: string;
}

interface Character {
  name: string;
  description: string;
  health: number;
  mana: number;
  deck: Card[];
}

export interface Card {
  id: number;
  name: string;
  level: number;
  type: 'ATTACK' | 'ABILITY' | 'POWER';
  description: string;
  image: string;
  mana: number;
}

export interface Boss {
  id: number;
  name: string;
  level: number;
  health: number;
  mana: number;
  deck: Card[];
  image: string;
}

interface GameContextProps {
  user: User | null;
  character: Character | null;
  deck: Card[];
  login: (username: string, email: string) => void;
  logout: () => void;
  createCharacter: (name: string, description: string) => void;
  updateStats: (health: number, mana: number) => void;
  addCardToDeck: (card: Card) => void;
}

export const GameContext = createContext<GameContextProps>({
  user: null,
  character: null,
  deck: [],
  login: () => {},
  logout: () => {},
  createCharacter: () => {},
  updateStats: () => {},
  addCardToDeck: () => {},
});

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [deck, setDeck] = useState<Card[]>([]);

  const login = (username: string, email: string) => {
    // In real app, you'd do an API call here
    setUser({ username, email });
  };

  const logout = () => {
    setUser(null);
    setCharacter(null);
    setDeck([]);
  };

  const createCharacter = (name: string, description: string) => {
    // In real app, you'd do an API call here
    setCharacter({
      name,
      description,
      health: 100,
      mana: 50,
      deck: [],
    });
  };

  const updateStats = (health: number, mana: number) => {
    if (character) {
      setCharacter({
        ...character,
        health,
        mana,
      });
    }
  };

  const addCardToDeck = (card: Card) => {
    setDeck([...deck, card]);
  };

  return (
    <GameContext.Provider
      value={{
        user,
        character,
        deck,
        login,
        logout,
        createCharacter,
        updateStats,
        addCardToDeck,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};