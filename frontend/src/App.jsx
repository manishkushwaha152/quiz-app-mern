import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Quiz from './pages/Quiz';
import Dashboard from './pages/admin/Dashboard';
import QuizEditor from './pages/admin/QuizEditor';

// Theme
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/quiz/:id" element={<Quiz />} />

            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/quiz/:id"
              element={
                <ProtectedRoute roles={['admin']}>
                  <QuizEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/quiz/new"
              element={
                <ProtectedRoute roles={['admin']}>
                  <QuizEditor />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
