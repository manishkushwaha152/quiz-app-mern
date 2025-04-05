import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const navigate = useNavigate();

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      localStorage.removeItem('token');
    }
  };

  const loadUser = async () => {
    if (!token) return;
    try {
      setAuthToken(token);
      const decoded = jwtDecode(token);
      console.log("Decoded token →", decoded);
      setUser(decoded.user || decoded); // Support both structures
    } catch (err) {
      console.error("Failed to decode token:", err);
      logout();
    }
  };

  const register = async (formData) => {
    try {
      const res = await axios.post('/api/auth/register', formData);
      const newToken = res.data.token;
      setToken(newToken);
      setAuthToken(newToken);
      await loadUser();
      navigate('/');
    } catch (err) {
      throw err.response?.data || { msg: "Registration failed." };
    }
  };

  const login = async (formData) => {
    try {
      const res = await axios.post('/api/auth/login', formData);
      const newToken = res.data.token;
      setToken(newToken);
      setAuthToken(newToken);
      await loadUser(); // 🚀 This updates user immediately
      navigate('/');
    } catch (err) {
      throw err.response?.data || { msg: "Invalid credentials" };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    navigate('/login');
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
