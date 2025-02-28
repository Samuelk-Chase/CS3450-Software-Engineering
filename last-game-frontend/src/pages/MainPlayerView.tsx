import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import '../css/MainPlayerView.css';
import characterImage from '../images/Bruce-Wayne-the-Batman-Elden-Ring-Character-Face.jpg';

const MainPlayerView: React.FC = () => {
  const { character } = useContext(GameContext);
  const navigate = useNavigate();
  const [decision, setDecision] = useState('');

  const handleOpenChest = () => {
    alert('Chest opened! You found some loot.');
  };

  const handleViewDeck = () => {
    navigate('/deck');
  };

  const handleEnterBossFight = () => {
    navigate('/boss');
  };

  const handleDecisionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDecision(e.target.value);
  };

  const handleSubmitDecision = () => {
    alert(`Decision submitted: ${decision}`);
    setDecision('');
  };

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <h1>BEAN BOYS - The Last Game (Level 5)</h1>
      </div>

      {/* Main Container: Two Columns */}
      <div className="main-container">
        {/* LEFT PANEL: Player Stats & Actions */}
        <div className="left-panel">
          <div className="player-info">
            <img src={characterImage} alt="Warmonger Warrior" />
            <div className="player-details">
              <strong>{character?.name ?? 'Warmonger'}: Warrior</strong>
              <div className="health-mana-bars">
                <div className="bar-container">
                  <div className="bar-fill health-bar-fill"></div>
                </div>
                <div className="bar-container">
                  <div className="bar-fill mana-bar-fill"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Deck, Chest, and Boss Fight Buttons */}
          <button className="view-deck-button" onClick={handleViewDeck}>View Deck</button>
          <button className="action-button" onClick={handleOpenChest}>Open Chest</button>
          <button className="action-button" onClick={handleEnterBossFight}>Enter Boss Fight</button>
        </div>

        {/* RIGHT PANEL: Enlarged Story Section */}
        <div className="right-panel">
          <div className="story-container large-story">
            <h2>The Shadow of Eldoria</h2>
            <p><strong>[00:00] Game Start</strong></p>
            <p><em>AI:</em> The sun dips below the jagged peaks of the Ashen Mountains, casting eerie shadows over the ruins of Eldoria...</p>

            <p><strong>[00:05] Player Actions Begin</strong></p>
            <p><strong>Alice (Warrior):</strong> "Alright team, we move as one. Bob, take the left flank. Charlie, keep your spells ready."</p>
            <p><strong>Bob (Ranger):</strong> "Got it. I'll stay ahead, checking for traps."</p>

            <p><strong>[00:10] AI-Generated Event</strong></p>
            <p><em>AI:</em> A deep rumbling shakes the ruins. The ancient archway groans as fragments of stone crumble...</p>

            <p><strong>[00:18] AI-Generated Gameplay - Entering the Ruins</strong></p>
            <p><em>AI:</em> The heavy doors creak open, revealing a grand hall bathed in ghostly blue light...</p>

            <p><strong>[00:22] Player Decision</strong></p>
            <p><strong>Alice (Warrior):</strong> "Do we take the sword? Could be cursed."</p>
            <p><strong>Charlie (Mage):</strong> "Or it could be our best weapon against whatever's lurking here."</p>

            <p><strong>[00:24] AI-Generated Consequence</strong></p>
            <p><em>AI:</em> As Alice grips the sword's hilt, a cold sensation rushes through her veins...</p>

            <p><strong>[00:30] AI-Generated Combat Encounter - The Wraiths Attack</strong></p>
            <p><em>AI:</em> The statues lining the hall tremble. From the cracks in the stone, spectral figures emerge...</p>

            <p><strong>Alice (Warrior):</strong> "Weapons up! We fight!"</p>
            <p><strong>Charlie (Mage):</strong> "Time for a little firepower."</p>

            <p><strong>[00:40] AI-Generated Battle Outcome</strong></p>
            <p><em>AI:</em> The wraiths fall one by one. The last one hisses as it dissipates...</p>

            <p><strong>[00:50] AI-Generated Major Event - Breaking the Seal</strong></p>
            <p><em>AI:</em> The sigil shatters with a deafening crack. The floor beneath them gives way...</p>

            <p><strong>[01:00] AI-Generated Gameplay - The Abyss Below</strong></p>
            <p><em>AI:</em> The adventurers land hard on damp stone...</p>

            <p><strong>[01:10] AI-Generated Boss Encounter - The Shadow Keeper</strong></p>
            <p><em>AI:</em> The mist parts, revealing a monstrous figure—The Shadow Keeper...</p>

            <p><strong>[01:22] Player Decision - The Final Blow</strong></p>
            <p><strong>Alice (Warrior):</strong> "Charlie, amplify the sword’s power!"</p>
            <p><strong>Charlie (Mage):</strong> "On it!"</p>

            <p><strong>[01:30] AI-Generated Conclusion</strong></p>
            <p><em>AI:</em> The ruins fall silent. The darkness recedes, revealing a stairway leading to the surface...</p>

            <p><strong>[01:35] Game Session Ends</strong></p>
            <p><strong>Alice (Warrior):</strong> "We survived. Barely."</p>
            <p><strong>Charlie (Mage):</strong> "The legend of Eldoria just got a new chapter."</p>
          </div>

          {/* Decision Input */}
          <div className="action-row">
            <input type="text" placeholder="Enter decision here" value={decision} onChange={handleDecisionChange} />
            <button className="action-button" onClick={handleSubmitDecision}>Submit</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPlayerView;