import { auth } from "../../config/firebase"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react"
import { useNavigate } from 'react-router-dom'

const auth = getAuth();
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });