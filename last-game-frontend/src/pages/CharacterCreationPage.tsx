import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import characterImage from '../images/Bruce-Wayne-the-Batman-Elden-Ring-Character-Face.jpg';

const CharacterCreationPage: React.FC = () => {
  const [characterDescription, setCharacterDescription] = useState('');
  const [mode, setMode] = useState<'hard' | 'soft'>('hard');
  const navigate = useNavigate(); // React Router navigation hook

  const handlePlay = () => {
    console.log('Selected Mode:', mode);
    console.log('Character:', characterDescription);
    navigate('/main'); // Redirect to MainPlayerView
  };

  return (
    <div
      style={{
        backgroundColor: '#333333',
        minHeight: '100vh',
        padding: '4rem',
        color: '#E3C9CE',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          width: '90%',
          backgroundColor: '#2d2d2d',
          borderRadius: '8px',
          boxShadow: '0 0 20px #20683F',
          padding: '2rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '18px'
        }}
      >
        <div style={{ marginLeft: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '2rem' }}>BEAN BOYS</h2>
          <p style={{ margin: 0, fontSize: '1.5rem' }}>The Last Game</p>
          <p style={{ margin: 0, fontSize: '1.5rem' }}>Level 1</p>
        </div>
        <h2 style={{ marginRight: '1.5rem', fontSize: '2rem' }}>Character Creation</h2>
      </div>

      {/* Main Container */}
      <div
        style={{
          width: '90%',
          backgroundColor: '#2d2d2d',
          borderRadius: '8px',
          boxShadow: '0 0 20px #20683F',
          padding: '3rem',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        {/* Left Column */}
        <div style={{ flex: 1.5, marginRight: '2rem' }}>
          <h3 style={{ textAlign: 'center', fontSize: '1.8rem' }}>GAME PLAY</h3>

          {/* Hard Beans Description + Button */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>Hard Beans</h4>
            <p style={{ fontSize: '1.2rem' }}>
              In hard beans, players will play as if they are experiencing the story in real life.
              Players get one life and realistic health and stamina.
            </p>
            <Button
              label="Select Hard Beans"
              className="p-button p-button-rounded p-shadow-3"
              onClick={() => setMode('hard')}
              style={{
                width: '50%',
                height: '60px', // Smaller button height
                fontSize: '1.3rem', // Smaller font size
                fontWeight: 'bold',
                background: mode === 'hard' 
                  ? 'linear-gradient(180deg, #27ae60 0%, #1e8449 100%)' 
                  : 'rgba(32, 104, 63, 0.5)',
                border: '3px solid #20683F',
                borderRadius: '15px',
                transition: '0.3s ease',
                color: mode === 'hard' ? '#FFFFFF' : '#E3C9CE'
              }}
            />
          </div>

          {/* Soft Beans Description + Button */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>Soft Beans</h4>
            <p style={{ fontSize: '1.2rem' }}>
              In soft beans, players will have merciful experiences. Games will be fun and challenging;
              if you die, you will simply go back to the last successful save.
            </p>
            <Button
              label="Select Soft Beans"
              className="p-button p-button-rounded p-shadow-3"
              onClick={() => setMode('soft')}
              style={{
                width: '50%',
                height: '60px', // Smaller button height
                fontSize: '1.3rem', // Smaller font size
                fontWeight: 'bold',
                background: mode === 'soft' 
                  ? 'linear-gradient(180deg, #27ae60 0%, #1e8449 100%)' 
                  : 'rgba(32, 104, 63, 0.5)',
                border: '3px solid #20683F',
                borderRadius: '15px',
                transition: '0.3s ease',
                color: mode === 'soft' ? '#FFFFFF' : '#E3C9CE'
              }}
            />
          </div>

          {/* Character Description */}
          <div style={{ marginTop: '2rem' }}>
            <p style={{ fontSize: '1.4rem' }}>Enter character description</p>
            <InputTextarea
              value={characterDescription}
              onChange={(e) => setCharacterDescription(e.target.value)}
              rows={8}
              style={{
                width: '100%',
                fontSize: '1.4rem',
                backgroundColor: '#444444',
                color: '#E3C9CE'
              }}
            />
          </div>

          {/* Play Button (Navigates to /main) */}
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Button
              label="PLAY"
              className="p-button p-button-rounded p-shadow-3"
              style={{
                width: '100%',
                height: '100px',
                fontSize: '2rem',
                fontWeight: 'bold',
                background: 'linear-gradient(180deg, #27ae60 0%, #1e8449 100%)',
                border: 'none',
                borderRadius: '18px',
                letterSpacing: '2px',
                padding: '1.7rem'
              }}
              onClick={handlePlay} // Redirects to /main
            />
          </div>
        </div>

        {/* Right Column: Character Image */}
        <div
          style={{
            flex: 1,
            marginLeft: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              width: '550px', // Increased size
              height: '550px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '6px solid #20683F'
            }}
          >
            <img
              src={characterImage}
              alt="Character"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreationPage;