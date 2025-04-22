import React, { useState } from "react"
import { FaHome, FaPlusCircle, FaSlidersH, FaSignInAlt, FaUserPlus } from "react-icons/fa"
import { auth } from "../../config/firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import "./index.css"

const Navbar = () => {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    loginEmail: '',
    loginPassword: '',
    remember: false
  });
  const [passwordStrength, setPasswordStrength] = useState('');
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: ''
  });
  const [messages, setMessages] = useState({
    signup: '',
    login: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'password') {
      updatePasswordStrength(value);
    }
  };

  const updatePasswordStrength = (password) => {
    if (password.length < 8) {
      setPasswordStrength('weak');
    } else if (password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)) {
      setPasswordStrength('strong');
    } else {
      setPasswordStrength('medium');
    }
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { password: '', confirmPassword: '' };

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password does not meet the requirements.';
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match!';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      try {
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        setMessages({ ...messages, signup: 'Sign up successful!' });
        setTimeout(() => {
          setShowSignupModal(false);
          setMessages({ ...messages, signup: '' });
        }, 2000);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, formData.loginEmail, formData.loginPassword);
      setMessages({ ...messages, login: 'Login successful!' });
      setTimeout(() => {
        setShowLoginModal(false);
        setMessages({ ...messages, login: '' });
      }, 2000);
    } catch (err) {
      setMessages({ ...messages, login: 'Login unsuccessful' });
      setTimeout(() => {
        setMessages({ ...messages, login: '' });
      }, 2000);
      console.log(err);
    }
  };

  const switchToLogin = (e) => {
    e.preventDefault();
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const switchToSignup = (e) => {
    e.preventDefault();
    setShowLoginModal(false);
    setShowSignupModal(true);
  };
  return (
    <div>
      <nav>
        <div className="nav-logo">Travel<span>Buddy</span></div>
        <div className="nav-links">
          <a href="/"><FaHome /> Home</a>
          <a href="/create-plan"><FaPlusCircle /> Create Plan</a>
          <div className="auth-buttons">
            <button className="auth-btn login-btn" onClick={() => setShowLoginModal(true)}>
              <FaSignInAlt /> Login
            </button>
            <button className="auth-btn signup-btn" onClick={() => setShowSignupModal(true)}>
              <FaUserPlus /> Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="modal" onClick={() => setShowSignupModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setShowSignupModal(false)}>&times;</span>
            <div className="signup-form">
              <h2>Create Your Account</h2>
              <form onSubmit={handleSignupSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => document.getElementById('passwordHint').style.display = 'block'}
                    onBlur={() => document.getElementById('passwordHint').style.display = 'none'}
                    required 
                  />
                  <div className="password-hint" id="passwordHint">
                    Password must be at least 8 characters long, and include at
                    least one uppercase letter, one lowercase letter, one
                    number, and one special character.
                  </div>
                  <span className="error">{errors.password}</span>
                  <div className="password-strength">
                    <div className={`password-strength-bar ${passwordStrength}`}></div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required 
                  />
                  <span className="error">{errors.confirmPassword}</span>
                </div>
                <button type="submit" className="form-submit-btn">Sign Up</button>
                <div className="form-footer">
                  Already have an account? <a href="#" onClick={switchToLogin}>Log In</a>
                </div>
              </form>
              {messages.signup && <p style={{ color: 'green', textAlign: 'center' }}>{messages.signup}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content animate" onClick={e => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setShowLoginModal(false)}>&times;</span>
            <form className="login-form" onSubmit={handleLoginSubmit}>
              <div className="container">
                <div className="form-group">
                  <label htmlFor="loginEmail"><b>Email</b></label>
                  <input 
                    type="text" 
                    placeholder="Enter Email" 
                    id="loginEmail" 
                    name="loginEmail" 
                    value={formData.loginEmail}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="loginPassword"><b>Password</b></label>
                  <input 
                    type="password" 
                    placeholder="Enter Password" 
                    id="loginPassword" 
                    name="loginPassword" 
                    value={formData.loginPassword}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="remember">
                  <input 
                    type="checkbox" 
                    checked={formData.remember} 
                    name="remember" 
                    id="remember" 
                    onChange={handleInputChange}
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <button type="submit" className="form-submit-btn">Login</button>
              </div>
              <div className="bottom-container">
                <button type="button" className="cancelbtn" onClick={() => setShowLoginModal(false)}>Cancel</button>
                <span className="psw">Forgot <a href="#">password?</a></span>
              </div>
              <div className="form-footer">
                Don't have an account? <a href="#" onClick={switchToSignup}>Sign Up</a>
              </div>
            </form>
            {messages.login && <p id="loginMessage" style={{ color: 'green', textAlign: 'center', margin: '1rem 0' }}>{messages.login}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;