// src/components/SignUpSection.tsx
import React from 'react';
import { Button } from 'primereact/button';

const SignUpSection: React.FC = () => {
  const handleGoogleSignUp = () => {
    console.log('Google sign up clicked');
    // Add your Google OAuth logic or redirect here
  };

  const handleAppleSignUp = () => {
    console.log('Apple sign up clicked');
    // Add your Apple OAuth logic or redirect here
  };

  const handleGithubSignUp = () => {
    console.log('GitHub sign up clicked');
    // Add your GitHub OAuth logic or redirect here
  };

  return (
    <div style={{ marginTop: '1rem', width: '300px' }}>
      <Button 
        label="Sign up with Google" 
        icon="pi pi-google" 
        className="p-button-success p-mb-2" 
        style={{ width: '100%' }}
        onClick={handleGoogleSignUp}
      />
      <Button 
        label="Sign up with Apple" 
        icon="pi pi-apple" 
        className="p-button-secondary p-mb-2" 
        style={{ width: '100%' }}
        onClick={handleAppleSignUp}
      />
      <Button 
        label="Sign up with GitHub" 
        icon="pi pi-github" 
        className="p-button-info" 
        style={{ width: '100%' }}
        onClick={handleGithubSignUp}
      />
    </div>
  );
};

export default SignUpSection;