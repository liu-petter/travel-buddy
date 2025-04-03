import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const SignupModal = ({ onClose, showLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("Password doesn't meet requirements");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPassword(password);
    setPasswordStrength(getPasswordStrength(password));
  };

  const getPasswordStrength = (password) => {
    if (password.length < 8) return 'weak';
    if (password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)) return 'strong';
    return 'medium';
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </span>
        <div className="signup-form">
          <h2>Create Your Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={handlePasswordChange}
                required 
              />
              <div className="password-hint">
                Password must be at least 8 characters long, and include at
                least one uppercase letter, one lowercase letter, one
                number, and one special character.
              </div>
              <div className="password-strength">
                <div className={`password-strength-bar ${passwordStrength}`}></div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" className="form-submit-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
            <div className="form-footer">
              Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); showLogin(); }}>Log In</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;