// src/theme.jsx
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Blue
    },
    secondary: {
      main: '#dc004e', // Pink
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
    },
    h2: {
      fontSize: '2rem',
    },
    h3: {
      fontSize: '1.5rem',
    },
  },
});

export default theme;
