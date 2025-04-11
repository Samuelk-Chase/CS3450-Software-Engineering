"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import backgroundImage from '../images/Login background.jpg';

// Supabase and OAuth imports
import type { Provider } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGitlab, faBitbucket } from "@fortawesome/free-brands-svg-icons";

const LoginPage: React.FC = () => {
  // State for email/password login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State for printing errors on screen
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  //const baseUrl = window.location.hostname.includes('localhost')
  //  ? 'https://lastgame-api.chirality.app' // Production URL
   // : 'http://localhost:8080'; // Development URL
const baseUrl = 'http://localhost:8080';
  /**
   * Insert or fetch the OAuth user in your "users" table.
   * Only run this after the user has completed the OAuth flow.
   */
  const insertOrFetchOAuthUser = async (oauthUser: any) => {
    console.log("OAuth user object after sign-in:", oauthUser);
    if (!oauthUser.email) {
      const msg = "OAuth user has no email. Ensure the provider returns an email.";
      console.error(msg);
      setErrorMsg(msg);
      return;
    }

    // 1. Check if the user exists in "users"
    const { data: existingUser, error: selectError } = await supabase
      .from('users') // Ensure your table is exactly named "users" (all lowercase)
      .select('*')
      .eq('email', oauthUser.email)
      .maybeSingle();

    if (selectError) {
      const msg = "Error checking user in 'users' table: " + JSON.stringify(selectError);
      console.error(msg);
      setErrorMsg(msg);
      return;
    }

    // 2. If no user exists, insert a new row
    if (!existingUser) {
      const { data: insertedUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            email: oauthUser.email,
            password_hash: null, // For OAuth users, no password is stored.
          }
        ])
        .select('*')
        .single();

      if (insertError) {
        const msg = "Error inserting new user into 'users': " + JSON.stringify(insertError);
        console.error(msg);
        setErrorMsg(msg);
      } else {
        console.log("Inserted new user:", insertedUser);
        if (insertedUser) {
          localStorage.setItem("userId", insertedUser.user_id);
        }
      }
    } else {
      // 3. If user already exists, just set their user_id
      console.log("User already exists:", existingUser);
      localStorage.setItem("userId", existingUser.user_id);
    }
  };

  /**
   * Listen for auth state changes.
   * We only trigger our user check/insertion once the OAuth flow finishes
   * and the user is signed in.
   */
  useEffect(() => {
    const { data: authSubscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change event:", event);
        console.log("Session object:", session);
  
        if (event === "SIGNED_IN" && session?.user) {
          console.log("User after SIGNED_IN:", session.user);
          await insertOrFetchOAuthUser(session.user);
          navigate("/character-account");
        }
      }
    );
  
    return () => {
      authSubscription?.subscription.unsubscribe();
    };
  }, [navigate]);

  /**
   * OAuth Login Handler.
   * Initiates the OAuth flow. After sign in, the auth listener will handle user insertion.
   */
  const handleOAuthLogin = async (provider: Provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/oauth-callback`,
      },
    });
    if (error) {
      const msg = "OAuth login error: " + JSON.stringify(error);
      console.error(msg);
      setErrorMsg(msg);
    } else if (data?.url) {
      window.location.replace(data.url)
    } else {
      throw new Error("No redirect URL returned from Supabase.");
    }
  };

  // OAuth Providers Configuration
  const oauthProviders = [
    { icon: faGithub, provider: 'github' as Provider, label: 'GitHub' },
    { icon: faGitlab, provider: 'gitlab' as Provider, label: 'GitLab' },
    { icon: faBitbucket, provider: 'bitbucket' as Provider, label: 'Bitbucket' }
  ];

  /**
   * Email/Password Login Handler.
   * Uses your custom API endpoint for authentication.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/v1/login`, {
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
        localStorage.setItem("userId", String(data.user_id));
        localStorage.setItem("isLoggedIn", "true");

        navigate("/character-account");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      const msg = "Login error: " + error;
      console.error(msg);
      setErrorMsg(msg);
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
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
          border: '3px solid#20683F',
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

        {/* Display error message if any */}
        {errorMsg && (
          <div style={{ marginBottom: '1rem', color: 'red', fontSize: '1.2rem' }}>
            {errorMsg}
          </div>
        )}

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
          {oauthProviders.map((item, index) => (
            <div 
              key={index}
              onClick={() => handleOAuthLogin(item.provider)}
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
              <span style={{ fontSize: '1.8rem', color: '#28a745', marginLeft: '10px' }}>{item.label}</span>
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
