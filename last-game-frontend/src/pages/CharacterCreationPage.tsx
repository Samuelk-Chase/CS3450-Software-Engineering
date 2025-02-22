// src/pages/CharacterCreationPage.tsx
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import characterImage from '../images/Bruce-Wayne-the-Batman-Elden-Ring-Character-Face.jpg';

// Custom ModeToggle Component using dark selectors with green highlight
interface ModeToggleProps {
  value: 'hard' | 'soft';
  onChange: (value: 'hard' | 'soft') => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ value, onChange }) => {
  return (
    <div
      style={{
        display: 'flex',
        border: '1px solid #20683F',
        borderRadius: '4px',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '300px',
        margin: '0 auto'
      }}
    >
      <div
        onClick={() => onChange('hard')}
        style={{
          flex: 1,
          padding: '0.75rem',
          textAlign: 'center',
          backgroundColor: value === 'hard' ? '#20683F' : '#2d2d2d',
          cursor: 'pointer'
        }}
      >
        <i className="pi pi-shield" style={{ marginRight: '0.5rem' }} />
        Hard Beans
      </div>
      <div
        onClick={() => onChange('soft')}
        style={{
          flex: 1,
          padding: '0.75rem',
          textAlign: 'center',
          backgroundColor: value === 'soft' ? '#20683F' : '#2d2d2d',
          cursor: 'pointer'
        }}
      >
        <i className="pi pi-heart" style={{ marginRight: '0.5rem' }} />
        Soft Beans
      </div>
    </div>
  );
};

const CharacterCreationPage: React.FC = () => {
  const [storyDescription, setStoryDescription] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const [mode, setMode] = useState<'hard' | 'soft'>('hard');

  const handlePlay = () => {
    console.log('Selected Mode:', mode);
    console.log('Story:', storyDescription);
    console.log('Character:', characterDescription);
    // TODO: Navigate or handle your next logic here
  };

  return (
    <div
      style={{
        backgroundColor: '#333333',
        minHeight: '100vh',
        padding: '2rem',
        color: '#E3C9CE',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          backgroundColor: '#2d2d2d',
          borderRadius: '8px',
          boxShadow: '0 0 20px #20683F',
          padding: '1rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ marginLeft: '1rem' }}>
          <h2 style={{ margin: 0 }}>BEAN BOYS</h2>
          <p style={{ margin: 0 }}>The Last Game</p>
          <p style={{ margin: 0 }}>Level 1</p>
        </div>
        <h2 style={{ marginRight: '2rem', marginBottom: 0 }}>Character Creation</h2>
      </div>

      {/* Main Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          backgroundColor: '#2d2d2d',
          borderRadius: '8px',
          boxShadow: '0 0 20px #20683F',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        {/* Left Column: Game Play Text, Mode Descriptions, Mode Toggle, Textareas, Play Button */}
        <div style={{ flex: 1, marginRight: '1rem' }}>
          <h3 style={{ marginTop: 0, textAlign: 'center' }}>GAME PLAY</h3>
          
          {/* Mode Description Blocks */}
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: '0.5rem 0' }}>Hard Beans</h4>
            <p style={{ margin: '0.5rem 0' }}>
              In hard beans, players will play as if they are experiencing the story in real life.
              Players get one life and realistic health and stamina.
            </p>
          </div>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: '0.5rem 0' }}>Soft Beans</h4>
            <p style={{ margin: '0.5rem 0' }}>
              In soft beans, players will have merciful experiences. Games will be fun and challenging;
              if you die, you will simply go back to the last successful save.
            </p>
          </div>

          {/* Custom Mode Toggle */}
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <p style={{ marginBottom: '0.5rem' }}>Select Game Mode:</p>
            <ModeToggle value={mode} onChange={setMode} />
          </div>

          {/* Story & Character Descriptions */}
          <div style={{ marginTop: '2rem' }}>
            <p style={{ marginBottom: '0.5rem' }}>Enter in your story Description</p>
            <InputTextarea
              value={storyDescription}
              onChange={(e) => setStoryDescription(e.target.value)}
              rows={4}
              placeholder="Enter your story description"
              style={{
                width: '100%',
                backgroundColor: '#444444',
                color: '#E3C9CE'
              }}
            />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <p style={{ marginBottom: '0.5rem' }}>Enter character description</p>
            <InputTextarea
              value={characterDescription}
              onChange={(e) => setCharacterDescription(e.target.value)}
              rows={4}
              placeholder="Enter character description"
              style={{
                width: '100%',
                backgroundColor: '#444444',
                color: '#E3C9CE'
              }}
            />
          </div>

          {/* Play Button */}
          <div style={{ marginTop: '2rem' }}>
            <Button
              label="PLAY"
              onClick={handlePlay}
              style={{
                backgroundColor: '#20683F',
                borderColor: '#20683F',
                width: '100%',
                height: '3rem',
                fontSize: '1.2rem'
              }}
            />
          </div>
        </div>

        {/* Right Column: Circular Image */}
        <div
          style={{
            flex: 1,
            marginLeft: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '4px solid #20683F'
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