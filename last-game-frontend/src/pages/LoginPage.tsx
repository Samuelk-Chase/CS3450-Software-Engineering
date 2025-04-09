"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import backgroundImage from '../images/Login background.jpg';

import type { Provider } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGitlab, faBitbucket } from "@fortawesome/free-brands-svg-icons";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPDF, setShowPDF] = useState(false); // <-- Added state

  const navigate = useNavigate();
  const baseUrl = window.location.hostname.includes('localhost')
    ? 'https://lastgame-api.chirality.app'
    : 'http://localhost:8080';

  const insertOrFetchOAuthUser = async (oauthUser: any) => {
    console.log("OAuth user object after sign-in:", oauthUser);
    if (!oauthUser.email) {
      const msg = "OAuth user has no email. Ensure the provider returns an email.";
      console.error(msg);
      setErrorMsg(msg);
      return;
    }

    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('email', oauthUser.email)
      .maybeSingle();

    if (selectError) {
      const msg = "Error checking user in 'users' table: " + JSON.stringify(selectError);
      console.error(msg);
      setErrorMsg(msg);
      return;
    }

    if (!existingUser) {
      const { data: insertedUser, error: insertError } = await supabase
        .from('users')
        .insert([{ email: oauthUser.email, password_hash: null }])
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
      console.log("User already exists:", existingUser);
      localStorage.setItem("userId", existingUser.user_id);
    }
  };

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
      window.location.replace(data.url);
    } else {
      throw new Error("No redirect URL returned from Supabase.");
    }
  };

  const oauthProviders = [
    { icon: faGithub, provider: 'github' as Provider, label: 'GitHub' },
    { icon: faGitlab, provider: 'gitlab' as Provider, label: 'GitLab' },
    { icon: faBitbucket, provider: 'bitbucket' as Provider, label: 'Bitbucket' }
  ];

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
    <>
      {/* Modal PDF Viewer */}
      {showPDF && (
        <div style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100vw", height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            width: "80%",
            height: "80%",
            backgroundColor: "#fff",
            borderRadius: "10px",
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 0 20px rgba(0,0,0,0.5)"
          }}>
            <button
  onClick={() => setShowPDF(false)}
  style={{
    position: "absolute",
    top: "10px",
    right: "15px",
    zIndex: 10000, // <== Ensures it’s above the iframe
    background: "rgba(255, 255, 255, 0.8)",
    border: "none",
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)"
  }}
>
  &times;
</button>

            <iframe
              src="/gameManual.pdf"
              title="PDF Viewer"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          </div>
        </div>
      )}

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
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '3.5rem' }}>BEAN BOYS</h1>
            <p style={{ fontSize: '1.8rem' }}>The Last Game</p>
          </div>

          {errorMsg && (
            <div style={{ marginBottom: '1rem', color: 'red', fontSize: '1.2rem' }}>
              {errorMsg}
            </div>
          )}

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

          {/* PDF Button */}
          <Button
            label="View Game Manual (PDF)"
            onClick={() => setShowPDF(true)}
            style={{
              marginTop: "2rem",
              backgroundColor: "#20683F",
              borderRadius: "10px",
              fontWeight: "bold",
            }}
          />

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

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.4rem' }}>
            <span>Don't have an account? </span>
            <Link to="/signup" style={{ color: '#27ae60', textDecoration: 'underline', fontWeight: 'bold' }}>
              Click here
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
