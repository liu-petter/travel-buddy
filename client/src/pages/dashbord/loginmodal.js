import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

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

  return (
    <div className="modal">
      <div className="modal-content animate">
        <span className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </span>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="container">
            <div className="form-group">
              <label htmlFor="loginEmail"><b>Email</b></label>
              <input 
                type="email" 
                placeholder="Enter Email" 
                id="loginEmail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="loginPassword"><b>Password</b></label>
              <input 
                type="password" 
                placeholder="Enter Password" 
                id="loginPassword" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <div className="remember">
              <input 
                type="checkbox" 
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                name="remember" 
                id="remember" 
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" className="form-submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
          <div className="bottom-container">
            <button type="button" className="cancelbtn" onClick={onClose}>Cancel</button>
            <span className="psw">Forgot <a href="#">password?</a></span>
          </div>
          <div className="form-footer">
            Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); showSignup(); }}>Sign Up</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;