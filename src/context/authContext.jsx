import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "/src/firebaseConfig"; // Adjust path if needed
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // No need to return the result here, the onAuthStateChanged listener will update the 'user' state
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw the error for component handling
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // No need to return the result here, the onAuthStateChanged listener will update the 'user' state
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw the error for component handling
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      await signOut(auth);
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw the error for component handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

export default AuthContext;

