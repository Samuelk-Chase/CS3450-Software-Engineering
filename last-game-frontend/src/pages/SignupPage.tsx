"use client";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import backgroundImage from "../images/Login background.jpg";

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://lastgame-api.chirality.app' // Production URL
      : 'http://localhost:8080'; // Development URL   const baseUrl = 

    try {
      const response = await fetch(`${baseUrl}/v1/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log("did this work");

      if (response.ok) {
        alert("Signup successful! Logging you in...");

        const loginResponse = await fetch(`${baseUrl}/v1/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (loginResponse.ok) {
          console.log("response is ok");
          const data = await loginResponse.json();
          console.log("Login successful:", data);

          if (!data.user_id) {
            throw new Error("User ID missing in response!");
          }

          // Store user ID in local storage
          localStorage.setItem("userId", String(data.user_id));
          localStorage.setItem("isLoggedIn", "true");

          alert("Login successful!");
          navigate("/character-account");
        } else {
          throw new Error("Invalid credentials");
        }
      } else {
        throw new Error("Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed. Try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <Card
        style={{
          width: "700px",
          backgroundColor: "#2d2d2d",
          borderRadius: "18px",
          boxShadow: "0 0 40px #20683F",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "3.5rem", color: "#E3C9CE" }}>BEAN BOYS</h1>
          <p style={{ fontSize: "1.8rem", color: "#E3C9CE" }}>The Last Game</p>
        </div>
        <form onSubmit={handleSignup} style={{ width: "100%" }}>
          <div
            style={{
              width: "100%",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            <InputText
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-inputtext-lg"
              style={{
                width: "500px",
                height: "60px",
                fontSize: "1.8rem",
                backgroundColor: "#444444",
                color: "#E3C9CE",
                padding: "10px",
                borderRadius: "10px",
                textAlign: "center",
                border: "2px solid #20683F",
              }}
            />
          </div>
          <div
            style={{
              width: "100%",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            <InputText
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-inputtext-lg"
              style={{
                width: "500px",
                height: "60px",
                fontSize: "1.8rem",
                backgroundColor: "#444444",
                color: "#E3C9CE",
                padding: "10px",
                borderRadius: "10px",
                textAlign: "center",
                border: "2px solid #20683F",
              }}
            />
          </div>
          <Button
            type="submit"
            label="SIGN UP"
            className="p-button p-button-rounded p-button-success p-shadow-3"
            style={{
              width: "500px",
              height: "60px",
              fontSize: "1.8rem",
              background: "linear-gradient(180deg, #27ae60 0%, #1e8449 100%)",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              padding: "10px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          />
        </form>
        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            fontSize: "1.4rem",
          }}
        >
          <span style={{ color: "#E3C9CE" }}>
            Already have an account?{" "}
          </span>
          <Link
            to="/login"
            style={{
              color: "#27ae60",
              textDecoration: "underline",
              fontWeight: "bold",
            }}
          >
            Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SignupPage;
