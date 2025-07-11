import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

export default function AuthenticationPage() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setShowRegister(false)} disabled={!showRegister}>
          Connexion
        </button>
        <button onClick={() => setShowRegister(true)} disabled={showRegister}>
          Inscription
        </button>
      </div>
      {showRegister ? <RegisterForm /> : <LoginForm />}
    </div>
  );
}