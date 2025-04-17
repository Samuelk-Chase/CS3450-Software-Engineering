# Low Level Design Document

## Table of Contents
1. [Frontend Design](#frontend-design)
2. [Security Design](#security-design)

## Frontend Design

### Overview
The frontend application is built using React with TypeScript, following a component-based architecture. The application integrates with the backend services through RESTful APIs and manages game state using React Context and local state management.

### Implementation Status
<span style="color: green">

In version 1.0, we implemented:
* Basic React + TypeScript frontend structure using React 18+ and TypeScript
* Core game state management using React Context (GameContext.tsx)
* RESTful API integration using axios for game actions
* Basic UI components for gameplay including:
  - CardComponent for displaying cards
  - BattleInterface for boss fights
  - DeckOverlayPage for card management
  - MainPlayerView for the main game interface

</span>

### Type Definitions & Interfaces

#### Core Types

##### Game Progress
```typescript
type GameProgress = {
  currentStoryNode: string;
  inventory: Card[];
  lastPlayed: Date;
};
```

##### Card
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

### Implementation Status
<span style="color: green">

In version 1.0, we implemented:
* Basic card types and attributes as defined in GameContext.tsx:
  ```typescript
  interface Card {
    id: number;
    name: string;
    type: string;
    level: number;
    mana: number;
    effect: string;
    image: string;
    soundEffect: string;
  }
  ```
* Simple effect system for cards with basic damage and status effects
* Basic game state tracking using React Context
* Core player and boss state management in BossFightPage.tsx

</span>

### API Interfaces

```typescript
interface GameAPI {
  startGame(): Promise<GameState>;
  makeChoice(choiceId: string): Promise<GameState>;
  useCard(cardId: string, targetId?: string): Promise<GameState>;
  collectItem(itemId: string): Promise<Card>;
  saveProgress(gameState: GameState): Promise<void>;
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
}
```

### Implementation Status
<span style="color: green">

In version 1.0, we implemented:
* Basic game API endpoints in Go backend:
  - /story for story generation
  - /boss for boss generation
  - /card for card generation
  - /character for character management
* Simple authentication system using JWT tokens:
  ```go
  func GenerateJWT(userID int) (string, error) {
    claims := jwt.MapClaims{
      "user_id": userID,
      "exp":     time.Now().Add(time.Hour * 24 * 30).Unix(),
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(jwtSecret)
  }
  ```
* Card management endpoints for retrieving and creating cards
* Progress saving functionality using localStorage and backend storage

</span>

### Component Architecture

#### Core Components

##### CardComponent
```typescript
interface CardProps {
  card: Card;
  isPlayable: boolean;
  onUse?: (cardId: string) => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({ card, isPlayable, onUse, className }) => {
  // Component implementation
};
```

##### StoryDisplay
```typescript
interface StoryDisplayProps {
  node: StoryNode;
  onChoiceSelected: (choiceId: string) => void;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ node, onChoiceSelected }) => {
  // Component implementation
};
```

##### BattleInterface
```typescript
interface BattleInterfaceProps {
  playerState: PlayerState;
  bossState: BossState;
  availableCards: Card[];
  onCardPlayed: (cardId: string) => void;
}

const BattleInterface: React.FC<BattleInterfaceProps> = ({
  playerState,
  bossState,
  availableCards,
  onCardPlayed,
}) => {
  // Component implementation
};
```

##### Inventory
```typescript
interface InventoryProps {
  cards: Card[];
  onCardSelected: (card: Card) => void;
}

const Inventory: React.FC<InventoryProps> = ({ cards, onCardSelected }) => {
  // Component implementation
};
```

### Implementation Status
<span style="color: green">

In version 1.0, we implemented:
* Basic card display component (CardComponent.tsx) with:
  - Card image display
  - Card stats and effects
  - Playable state management
* Simple story display interface in MainPlayerView.tsx
* Core battle interface in BossFightPage.tsx with:
  - Health tracking
  - Card playing mechanics
  - Turn-based combat
* Basic inventory management using localStorage
* Essential layout components including:
  - ProtectedRoute for authentication
  - GameLayout for consistent styling
  - Navigation components

</span>

### Layout Components

#### GameLayout
```typescript
interface GameLayoutProps {
  children: React.ReactNode;
  showInventory?: boolean;
  showStats?: boolean;
}

const GameLayout: React.FC<GameLayoutProps> = ({
  children,
  showInventory,
  showStats,
}) => {
  // Component implementation
};
```

### Pages

#### HomePage
```typescript
const HomePage: React.FC = () => {
  // Implementation for landing page
};
```

#### GamePage
```typescript
const GamePage: React.FC = () => {
  // Main game implementation
};
```

#### BattlePage
```typescript
const BattlePage: React.FC = () => {
  // Battle system implementation
};
```

#### InventoryPage
```typescript
const InventoryPage: React.FC = () => {
  // Card collection and management implementation
};
```

#### AuthPages
```typescript
const LoginPage: React.FC = () => {
  // Login implementation
};

const RegisterPage: React.FC = () => {
  // Registration implementation
};
```

## Security Design

### Authentication & Authorization

#### OAuth 2.0 Flow with Third-Party Providers
- **Chosen Providers:** Google, Microsoft, and Apple
- **Implementation Flow:**
  1. User selects Provider
  2. Authorization Request
  3. OAuth Consent Screen
  4. Token Exchange
  5. Validation & Token Issuance
  6. Frontend Stores Access Token

### Implementation Status
<span style="color: green">

In version 1.0, we implemented:
* Basic user authentication using JWT tokens and bcrypt password hashing:
  ```go
  func hashAndSalt(password string) (string, error) {
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    if err != nil {
      return "", err
    }
    return string(hashedPassword), nil
  }
  ```
* Simple session management using localStorage and JWT tokens
* Password encryption using bcrypt
* Basic authorization system with middleware:
  ```go
  func KeyAuth(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
      // Token validation logic
    })
  }
  ```

</span>

The following were not implemented:
* OAuth integration
* Third-party authentication
* Advanced token management
* 2FA system

#### Token-Based Authentication with JWT
- **Token Structure:**
  - Access Token: ~15 minutes
  - Refresh Token: ~7 days
- **Rotation & Revocation:**
  - Refresh Token Rotation
  - Server-Side Revocation List

#### Two-Factor Authentication (2FA)
- Optional for high-value accounts
- Implementation: Time-Based One-Time Password (TOTP)
- Flow:
  1. User scans QR code for enrollment
  2. User provides 6-digit TOTP on login
  3. Server verifies code before issuing tokens

### Data Protection & Privacy

#### Encryption of Sensitive Data at Rest
- Key Management: Secure vault (e.g., HashiCorp Vault, AWS KMS)
- Algorithm: AES-256 in GCM mode

#### Data in Transit
- TLS 1.3 for HTTPS connections
- Prevents eavesdropping and MITM attacks

### Implementation Status
<span style="color: green">

In version 1.0, we implemented:
* Basic data encryption for passwords using bcrypt
* HTTPS for data transmission
* Simple data protection measures including:
  - Input validation
  - SQL injection prevention
  - Basic XSS protection
  - Simple rate limiting

</span>

The following were not implemented:
* Advanced encryption systems
* Secure vault integration
* Comprehensive data anonymization
* Full GDPR/CCPA compliance

### Payment Security (Stripe Integration)
1. PCI-DSS Compliance via Stripe
2. Stripe Radar for fraud detection
3. Implementation Flow:
   - Frontend: Stripe Elements or Payment Intents
   - Backend: Stripe Go library for charge creation

### Implementation Status
<span style="color: green">

In version 1.0, we implemented:
* None - payment system was deferred to future versions

</span>

### Attack Prevention

#### DDoS Protection
- Rate Limiting & Throttling
- Traffic Monitoring & IP Filtering
- CDN & Load Balancing

#### SQL Injection & Input Validation
- Parameterized Queries & ORM
- Strict Input Validation

#### XSS and CSRF Protection
- Content Security Policy (CSP)
- CSRF Tokens

### Implementation Status
<span style="color: green">

In version 1.0, we implemented:
* Basic input validation
* Simple SQL injection prevention
* Core XSS protection
* Basic rate limiting

</span>

The following were not implemented:
* Advanced DDoS protection
* Comprehensive CSRF protection
* Advanced security monitoring
* Full-scale attack prevention systems

### Multiplayer Security
- Server-Side Game Logic Validation
- Cheat Detection Algorithms
- Secure WebSocket Connections

### Implementation Status
<span style="color: green">

In version 1.0, we implemented:
* Basic multiplayer functionality with:
  - WebSocket connections
  - Simple game state validation
  - Core multiplayer security measures

</span>

The following were not implemented:
* Advanced cheat detection
* Comprehensive multiplayer security
* Full-scale anti-cheat systems

### Disaster Recovery
- Automated Backups
- Incident Detection & Alerts
- Post-Incident Audits

### Implementation Status
<span style="color: green">

In version 1.0, we implemented:
* Basic data backup system
* Simple error logging
* Core incident tracking

</span>

The following were not implemented:
* Automated backup system
* Advanced incident detection
* Comprehensive audit system 