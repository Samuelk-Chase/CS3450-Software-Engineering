import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/v1/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log("did this work")

      if (response.ok) {
        alert("Signup successful! Logging you in...");
        // navigate("/login");

        
          const loginResponse = await fetch("http://localhost:8080/v1/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

      
          if (loginResponse.ok) {
            console.log("response is ok")
            const data = await loginResponse.json();
            console.log("Login successful:", data);
            
            if (!data.user_id) {
              throw new Error("User ID missing in response!");
            }
      
            // Store user ID in local storage
            localStorage.setItem("userId", String(data.user_id));
            localStorage.setItem("isLoggedIn", "true"); // Mark the user as logged in
            
            alert("Login successful!");
            navigate("/character-account"); // Redirect to character selection
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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup} style={{ display: "inline-block" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px" }}
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;