import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './navbar';
import Dashboard from './dashboard';
import LoginModal from './loginmodal';
import SignupModal from './signup';
//import '../../../App.css';  
//import '../../App.css';
//import './App.css';

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  return (
   
      <Router>
        <div className="App">
          <Navbar 
            onLoginClick={() => setShowLoginModal(true)}
            onSignupClick={() => setShowSignupModal(true)}
          />
          
          <Routes>    
            <Route path="/" element={<Dashboard />} />
            {/*<Route path="/preferences" element={<Preferences />} /> 
            <Route path="/create-plan" element={<CreatePlan />} />*/}
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
  
  );
}

export default App;