import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlusCircle, faSlidersH, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ onLoginClick, onSignupClick }) => {
  return (
    <nav>
      <div className="nav-logo">Travel<span>Buddy</span></div>
      <div className="nav-links">
        <Link to="/"><FontAwesomeIcon icon={faHome} /> Home</Link>
        <Link to="/create-plan"><FontAwesomeIcon icon={faPlusCircle} /> Create Plan</Link>
        <Link to="/preferences"><FontAwesomeIcon icon={faSlidersH} /> Preferences</Link>
        <div className="auth-buttons">
          <button className="auth-btn login-btn" onClick={onLoginClick}>
            <FontAwesomeIcon icon={faSignInAlt} /> Login
          </button>
          <button className="auth-btn signup-btn" onClick={onSignupClick}>
            <FontAwesomeIcon icon={faUserPlus} /> Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;