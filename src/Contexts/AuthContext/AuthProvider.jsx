import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth } from '../../firebase/firebase.init';

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Get JWT from backend and store in localStorage
  const getJwtAndStore = async (email) => {
    try {
      const res = await fetch('http://localhost:5000/jwt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data?.token) {
        localStorage.setItem('access-token', data.token);
      }
    } catch (error) {
      console.error('Error fetching JWT:', error);
    }
  };

  // ✅ Register user
  const createUser = async (email, password) => {
    setLoading(true);
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await getJwtAndStore(email);
    return result;
  };

  // ✅ Login user
  const signIn = async (email, password) => {
    setLoading(true);
    const result = await signInWithEmailAndPassword(auth, email, password);
    await getJwtAndStore(email);
    return result;
  };

  // ✅ Google login
  const signInWithGoogle = async () => {
    setLoading(true);
    const result = await signInWithPopup(auth, googleProvider);
    const email = result.user.email;
    await getJwtAndStore(email);
    return result;
  };

  // ✅ Logout user
  const logout = async () => {
    setLoading(true);
    localStorage.removeItem('access-token');
    return signOut(auth);
  };

  // ✅ Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
