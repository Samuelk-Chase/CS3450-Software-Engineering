# Frontend Low Level Design

## Overview

The frontend application is built using React with TypeScript, following a component-based architecture. The application integrates with the backend services through RESTful APIs and manages game state using React Context and local state management.

## Type Definitions & Interfaces

### Core Types

#### Game Progress
- Game progress will contain the current story node, players inventory at the time, and the date the player last played the game. 

```typescript

type GameProgress = {
  currentStoryNode: string;
  inventory: Card[];
  lastPlayed: Date;
};
```
#### Card
- The card type will contain attributes and descriptions of the card. It will also have a link to the S3 bucket where we store the card image. Cards will have both attributes and effects, to provide a wide range of options for the player. 
```typescript

type Card = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  type: CardType;
  attributes: CardAttributes;
  effects: CardEffect[];
};

type CardType = 'attack' | 'defense' | 'buff' | 'special';
type EffectType = 'damage' | 'heal' | 'buff' | 'debuff';
type CardAttributes = {
  cost: number;
  power: number;
  duration?: number;
};

type CardEffect = {
  type: EffectType;
  value: number;
  duration?: number;
};

```
### Game State and Player Story Nodes
- We need a way to store story information, for when players leave and exit the gam.
- We also want to store players inventory. 
- Story Nodes contain AI generated story content. When a player enters their choice into the text box, AI will generate the content for the next story node, and the game will progress. 
- Boss state defines whether or not the player is in a boss fight.

```typescript
type Game = {
  description: string;
  player: Player;
  theme: string;
}
type GameState = {
  currentStory: StoryNode;
  player?: Player;
  playerState: PlayerState;
  boss?: Boss;
  bossState?: BossState;
  inventory: Card[];
};

type StoryNode = {
  id: string;
  content: string;
};

```

### Player and Boss States
- Boss type defines a boss, with abilities, health, and an image. 
- Player type defines a player, along with all the attributes a player needs
- Boss and Player states contain current health and effects granted by cards

```typescript
type Boss = {
  id: string;
  name: string;
  maxHealth: number;
  imageUrl: string;
  abilities: BossAbility[];
};

type BossAbility = {
  name: string;
  damage: number;
  effects: CardEffect[];
};


type Player = {
  id: string;
  name: string;
  description: string;
  maxHealth: number;
  inventory: Cards[];
  effects: CardEffect[];
  imageUrl: string;
}

type PlayerState = {
  health: number;
  activeCard: Card[];
  
};

type BossState = {
  health: number;
  effects: CardEffect[];
}
```


### API Interfaces
- These interfaces define how the frontend interacts with the API. 
- The authentication will be handled on the backend by a 3rd party provider, but we still need to pass the data.
- GameAPI handles generating the next story node and saving progress.
- The card API handles retrieving, upgrading, and storing cards. 
- Start game retrieves a new game, and takes user input game description.
- createPlayer retreives a new player, and takes user input player description and name

```typescript
interface GameAPI {
  startGame( gameDescription: string): Promise<Game>;
  saveProgress(gameState: GameState): Promise<void>;
  getNextNode(storyNode: StoryNode, choice: string): Promise<StoryNode>;
  createPlayer(playerDescription: string, playerName: string): Promise<Player>;
}

interface AuthAPI {
  login(credentials: LoginCredentials): Promise<User>;
  logout(): Promise<void>;
  register(userData: RegistrationData): Promise<User>;
  resetPassword(email: string): Promise<void>;
}

interface CardAPI {
  getCards(): Promise<Card[]>;
  upgradeCard(cardId: string): Promise<Card>;
  getCardDetails(cardId: string): Promise<Card>;
  useCard(cardId: string, targetId?: string): Promise<GameState>;
  collectCard(itemId: string): Promise<Card>;
}
```

## Component Architecture

### Core Components


#### BattleInterface

```typescript
interface BattleInterfaceProps {
  player: Player;
  boss: Boss;
  playerState: PlayerState;
  bossState: BossState;
  availableCards: Card[];
  onCardPlayed: (cardId: string) => void;
}

const BattleInterface: React.FC<BattleInterfaceProps> = ({
  player, 
  boss,
  playerState,
  bossState,
  availableCards,
  onCardPlayed,
}) => {
  // Component implementation
};
```

#### Inventory
- We will use a PrimeReact prebuilt card component to display the card. We will use the Primereact gallery component to actually display the full inventory.
```typescript
interface InventoryProps {
  cards: Card[];
  onCardSelected: (card: Card) => void;
}

const Inventory: React.FC<InventoryProps> = ({ cards, onCardSelected }) => {
  //PrimeReact Gallery
};
```

