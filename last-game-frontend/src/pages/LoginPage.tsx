import React, { useState} from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email:', email, 'Password:', password);
  };

  return (
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
      {/* Outer box - Increased to 600px width */}
      <div
        style={{
          backgroundColor: '#2d2d2d',
          padding: '4rem', // More padding for a bigger feel
          borderRadius: '12px',
          boxShadow: '0 0 30px #20683F',
          width: '600px', // Wider
          maxWidth: '90%'
        }}
      >
        {/* Headings */}
        <h1 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2.5rem' }}>BEAN BOYS</h1>
        <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.4rem' }}>The Last Game</p>
        
        {/* Centered form */}
        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div style={{ marginBottom: '2rem', width: '100%', textAlign: 'center' }}>
            <InputText
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '90%', 
                height: '55px',
                fontSize: '1.4rem',
                backgroundColor: '#444444',
                color: '#E3C9CE',
                padding: '15px',
                borderRadius: '10px'
              }}
            />
          </div>
          <div style={{ marginBottom: '2rem', width: '100%', textAlign: 'center' }}>
            <InputText
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '90%',
                height: '55px',
                fontSize: '1.4rem',
                backgroundColor: '#444444',
                color: '#E3C9CE',
                padding: '15px',
                borderRadius: '10px'
              }}
            />
          </div>
          <Button
            type="submit"
            label="LOGIN"
            style={{
              width: '95%', 
              height: '60px',
              fontSize: '1.5rem',
              backgroundColor: '#20683F',
              borderColor: '#20683F',
              marginBottom: '2rem',
              fontWeight: 'bold',
              borderRadius: '12px'
            }}
          />
        </form>

        {/* Social Sign-Up Buttons - Even Bigger */}
        <Button
          label="Sign up with Apple"
          icon="pi pi-apple"
          iconPos="right"
          style={{
            width: '95%',
            height: '55px',
            fontSize: '1.4rem',
            backgroundColor: '#20683F',
            borderColor: '#20683F',
            marginBottom: '1.2rem',
            fontWeight: 'bold',
            borderRadius: '12px'
          }}
        />
        <Button
          label="Sign up with Google"
          icon="pi pi-google"
          iconPos="right"
          style={{
            width: '95%',
            height: '55px',
            fontSize: '1.4rem',
            backgroundColor: '#20683F',
            borderColor: '#20683F',
            marginBottom: '1.2rem',
            fontWeight: 'bold',
            borderRadius: '12px'
          }}
        />
        <Button
          label="Sign up with Microsoft"
          icon="pi pi-microsoft"
          iconPos="right"
          style={{
            width: '95%',
            height: '55px',
            fontSize: '1.4rem',
            backgroundColor: '#20683F',
            borderColor: '#20683F',
            fontWeight: 'bold',
            borderRadius: '12px'
          }}
        />

        {/* "Already have an account?" text */}
        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.2rem' }}>
          <span>Already have an account? </span>
          <Link to="/signin" style={{ color: '#20683F', textDecoration: 'underline', fontWeight: 'bold' }}>
            Click here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;