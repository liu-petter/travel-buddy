import { auth } from "../../config/firebase"
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import React, { useState } from "react"
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in to: " + auth.currentUser.email);

      // bring to new page
      navigate("/preferences");
    } catch (err) {
      alert("Invalid login");
      console.log(err);
    }
  }

  const logOut = async () => {
    try {
      await signOut(auth, email, password);
    } catch (err) {
      console.log(err);
    }
  }

  // sign in form is temporary, switch to new form
  return (
    <div>
      <input
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Enter password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signIn}>
        Sign In
      </button>
      <button onClick={logOut}>
        Log Out
      </button>
    </div>
  );
};

export default LoginPage;