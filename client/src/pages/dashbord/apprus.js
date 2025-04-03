import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import LoginModal from './components/modals/LoginModal';
import SignupModal from './components/modals/SignupModal';
import Preferences from './components/Preferences';
import CreatePlan from './components/CreatePlan';
import './App.css';

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar 
            onLoginClick={() => setShowLoginModal(true)}
            onSignupClick={() => setShowSignupModal(true)}
          />
          
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/preferences" element={<Preferences />} />
            <Route path="/create-plan" element={<CreatePlan />} />
          </Routes>

          {showLoginModal && (
            <LoginModal 
              onClose={() => setShowLoginModal(false)}
              showSignup={() => {
                setShowLoginModal(false);
                setShowSignupModal(true);
              }}
            />
          )}

          {showSignupModal && (
            <SignupModal 
              onClose={() => setShowSignupModal(false)}
              showLogin={() => {
                setShowSignupModal(false);
                setShowLoginModal(true);
              }}
            />
          )}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;