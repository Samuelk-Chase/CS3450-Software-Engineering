// src/pages/LoginPage.tsx
import React, { useState} from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom'; // if you're using react-router for navigation

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Email:', email, 'Password:', password);
  };

  return (
    <div>
      <div 
      className="global-text-color"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#333333',
        color: '#E3C9CE'
      }}
    >
      {/* Outer box */}
      <div
        style={{
          backgroundColor: '#2d2d2d',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 0 20px #20683F',
          width: '450px'
        }}
      >
        {/* Headings */}
        <h2 style={{ textAlign: 'left', marginBottom: '0.5rem' }}>BEAN BOYS</h2>
        <p style={{ textAlign: 'center', marginBottom: '1rem' }}>The Last Game</p>
        
        {/* Centered form */}
        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div style={{ marginBottom: '1rem', width: '100%', textAlign: 'center' }}>
            <InputText
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '80%',
                backgroundColor: '#444444',
                color: '#E3C9CE'
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem', width: '100%', textAlign: 'center' }}>
            <InputText
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '80%',
                backgroundColor: '#444444',
                color: '#E3C9CE'
              }}
            />
          </div>
          <Button
            type="submit"
            label="Submit"
            style={{
              width: '100%',
              backgroundColor: '#20683F',
              borderColor: '#20683F',
              marginBottom: '1rem'
            }}
          />
        </form>

        {/* Social Sign-Up Buttons */}
        <Button
          label="Sign up with Apple"
          icon="pi pi-apple"
          iconPos="right"
          style={{
            width: '100%',
            backgroundColor: '#20683F',
            borderColor: '#20683F',
            marginBottom: '0.5rem'
          }}
        />
        <Button
          label="Sign up with Google"
          icon="pi pi-google"
          iconPos="right"
          style={{
            width: '100%',
            backgroundColor: '#20683F',
            borderColor: '#20683F',
            marginBottom: '0.5rem'
          }}
        />
        <Button
          label="Sign up with Microsoft"
          icon="pi pi-microsoft"
          iconPos="right"
          style={{
            width: '100%',
            backgroundColor: '#20683F',
            borderColor: '#20683F'
          }}
        />

        {/* "Already have an account?" text */}
        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
          <span>Already have an account? </span>
          {/* Using Link from react-router-dom */}
          <Link to="/signin" style={{ color: '#20683F', textDecoration: 'underline' }}>
            Click here
          </Link>
        </div>
      </div>
    </div>

    </div>
    

  );
    
  
};

export default LoginPage;