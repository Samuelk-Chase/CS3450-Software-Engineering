"use client";

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import backgroundImage from '../images/Login background.jpg';
// Supabase and OAuth imports
import type { Provider } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGitlab, faBitbucket, faApple } from "@fortawesome/free-brands-svg-icons";

const LoginPage: React.FC = () => {
  // State for email/password login
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
        
        if (!data.user_id) {
          throw new Error("User ID missing in response!");
        }
  
        // Store user ID in local storage
        localStorage.setItem("userId", String(data.user_id));
        localStorage.setItem("isLoggedIn", "true"); // Mark the user as logged in
        
        
        navigate("/character-account"); // Redirect to character selection
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };


  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`, // Ensure correct path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem'
      }}
    >
      <Card 
        style={{
          width: '700px',
          backgroundColor: '#2d2d2d',
          borderRadius: '18px',
          boxShadow: '0 0 40px #20683F',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem'
        }}
      >
        {/* Title and Subtitle */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '3.5rem' }}>BEAN BOYS</h1>
          <p style={{ fontSize: '1.8rem' }}>The Last Game</p>
        </div>

        {/* Email/Password Login Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ width: '100%', marginBottom: '2rem', textAlign: 'center' }}>
            <InputText 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="p-inputtext-lg"
              style={{
                width: '500px',
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

          <div style={{ width: '100%', marginBottom: '2rem', textAlign: 'center' }}>
            <InputText 
              placeholder="Password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="p-inputtext-lg"
              style={{
                width: '500px',
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

          <Button 
            type="submit" 
            label="LOGIN" 
            className="p-button p-button-rounded p-button-success p-shadow-3" 
            style={{
              width: '500px',
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

        {/* OAuth Login Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center', marginTop: '2rem' }}>
          {[{ icon: faGithub, name: 'GitHub' }, { icon: faGitlab, name: 'GitLab' }, { icon: faBitbucket, name: 'Bitbucket' }, { icon: faApple, name: 'Apple' }].map((item, index) => (
            <div 
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                width: '250px',
                height: '60px',
                padding: '0.5rem',
                border: '2px solid #28a745',
                borderRadius: '8px',
                backgroundColor: '#333',
                cursor: 'pointer'
              }}
            >
              <FontAwesomeIcon icon={item.icon} style={{ height: '24px', color: '#28a745' }} />
              <span style={{ fontSize: '1.8rem', color: '#28a745', marginLeft: '10px' }}>{item.name}</span>
            </div>
          ))}
        </div>

        {/* Signup Link */}
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