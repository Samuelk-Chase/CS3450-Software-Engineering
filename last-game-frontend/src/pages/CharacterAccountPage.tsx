import React from 'react';
import { useNavigate } from 'react-router-dom';

// Sample character data (Replace with real data from backend)
const characters = [
  { id: 1, name: "Shadow Knight", level: 10, image: "src/images/shadowKnight.jpg" },
  { id: 2, name: "Elder Mage", level: 7, image: "src/images/eldermage.jpg" },
  { id: 3, name: "Crimson Archer", level: 5, image: "src/images/crimpsonmage.jpg" }
];

const CharacterAccountPage: React.FC = () => {
  const navigate = useNavigate();

  // Navigate to /main when a character is selected
  const handleCharacterSelect = (characterId: number) => {
    console.log(`Selected character ID: ${characterId}`);
    navigate('/main'); // Redirects to the MainPlayerView
  };

  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#222222',
        color: '#E3C9CE',
        textAlign: 'center'
      }}
    >
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Select Your Character</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Choose a character to enter the game.</p>

      {/* Character Selection Grid */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          maxWidth: '800px'
        }}
      >
        {characters.map((char) => (
          <div 
            key={char.id} 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => handleCharacterSelect(char.id)}
          >
            <img 
              src={char.image} 
              alt={char.name}
              style={{
                width: '250px',
                height: '250px',
                borderRadius: '12px',
                objectFit: 'cover',
                border: '3px solid #20683F',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
                marginBottom: '10px'
              }}
            />
            <p style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{char.name}</p>
            <p style={{ fontSize: '1.1rem', color: '#AAAAAA' }}>Level {char.level}</p>
          </div>
        ))}

        {/* Add New Character Option */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/character-creation')} // Redirects to Character Creation Page
        >
          <div 
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '12px',
              backgroundColor: '#444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: '#E3C9CE',
              border: '3px dashed #20683F'
            }}
          >
            +
          </div>
          <p style={{ fontSize: '1.3rem', fontWeight: 'bold', marginTop: '10px' }}>Add Character</p>
        </div>
      </div>
    </div>
  );
};

export default CharacterAccountPage;