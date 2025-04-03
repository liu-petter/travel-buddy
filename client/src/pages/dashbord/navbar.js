import React from 'react';
import { Link } from 'react-router-dom';
import './nav.css';

const Navbar = ({ onLoginClick, onSignupClick }) => {
  return (
    <nav>
      <div className="nav-logo">Travel<span>Buddy</span></div>
      <div className="nav-links">
        <Link to="/"><i className="fas fa-home"></i> Home</Link>
        <Link to="/create-plan"><i className="fas fa-plus-circle"></i> Create Plan</Link>
        <Link to="/preferences"><i className="fas fa-sliders-h"></i> Preferences</Link>
        <div className="auth-buttons">
          <button className="auth-btn login-btn" onClick={onLoginClick}>
            <i className="fas fa-sign-in-alt"></i> Login
          </button>
          <button className="auth-btn signup-btn" onClick={onSignupClick}>
            <i className="fas fa-user-plus"></i> Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;