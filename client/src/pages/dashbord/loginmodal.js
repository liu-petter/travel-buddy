import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import './log.css';

const LoginModal = ({ onClose, showSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log('Forgot password clicked');
    alert('Password reset functionality coming soon!');
  };

  return (
    <div id="id01" className="modal">
      <div className="modal-content animate">
        <span 
          onClick={onClose}
          className="close" 
          title="Close Modal"
        >
          &times;
        </span>

        <div className="imgcontainer">
          <img src="img_avatar2.png" alt="Avatar" className="avatar" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="container">
            {error && <div className="error-message">{error}</div>}
            
            <label htmlFor="uname"><b>Email</b></label>
            <input 
              type="text" 
              placeholder="Enter Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />

            <label htmlFor="psw"><b>Password</b></label>
            <input 
              type="password" 
              placeholder="Enter Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <label>
              <input 
                type="checkbox" 
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                name="remember"
              /> Remember me
            </label>
          </div>

          <div className="container" style={{backgroundColor: '#f1f1f1'}}>
            <button 
              type="button" 
              onClick={onClose} 
              className="cancelbtn"
            >
              Cancel
            </button>
            <span className="psw">
              Forgot <button 
                type="button" 
                onClick={handleForgotPassword}
                className="forgot-password-btn"
              >
                password?
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;