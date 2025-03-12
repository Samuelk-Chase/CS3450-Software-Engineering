import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:8080/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        alert("Login successful!");
  
        // Store authentication state (optional, replace with JWT handling later)
        localStorage.setItem("userEmail", email);
  
        // Navigate to character account page
        navigate("/character-account");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundColor: '#333333',
        color: '#E3C9CE',
        display: 'flex',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
      }}
    >
      {/* Login Card */}
      <Card 
        style={{
          width: '700px', // Slightly larger to accommodate 500px input fields
          backgroundColor: '#2d2d2d',
          borderRadius: '18px',
          boxShadow: '0 0 40px #20683F',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '3rem'
        }}
      >
        {/* Title */}
        <h1 style={{ marginBottom: '2rem', fontSize: '3.5rem' }}>BEAN BOYS</h1>
        <p style={{ marginBottom: '2rem', fontSize: '1.8rem' }}>The Last Game</p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* Email Field */}
          <div style={{ width: '100%', marginBottom: '2rem', textAlign: 'center' }}>
            <InputText 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="p-inputtext-lg"
              style={{
                width: '500px', // Fixed 500px width
                height: '60px',
                fontSize: '1.8rem',
                backgroundColor: '#444444',
                color: '#E3C9CE',
                padding: '10px',
                borderRadius: '10px',
                textAlign: 'center',
                border: '2px solid #20683F'
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ width: '100%', marginBottom: '2rem', textAlign: 'center' }}>
            <InputText 
              placeholder="Password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="p-inputtext-lg"
              style={{
                width: '500px', // Fixed 500px width
                height: '60px',
                fontSize: '1.8rem',
                backgroundColor: '#444444',
                color: '#E3C9CE',
                padding: '10px',
                borderRadius: '10px',
                textAlign: 'center',
                border: '2px solid #20683F'
              }}
            />
          </div>

          {/* Login Button */}
          <Button 
            type="submit" 
            label="LOGIN" 
            className="p-button p-button-rounded p-button-success p-shadow-3" 
            style={{
              width: '500px', // Match input field width
              height: '60px',
              fontSize: '1.8rem',
              background: 'linear-gradient(180deg, #27ae60 0%, #1e8449 100%)',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              padding: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          />
        </form>

        {/* "Don't Have an Account?" Section */}
        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.4rem' }}>
          <span>Don't have an account? </span>
          <Link to="/signup" style={{ color: '#27ae60', textDecoration: 'underline', fontWeight: 'bold' }}>
            Click here
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;