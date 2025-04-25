import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import '/fonts/grotesco.css';

import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Grotesco, Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '2.7rem', letterSpacing: '0.02em' },
    h2: { fontWeight: 700, fontSize: '2.2rem', letterSpacing: '0.02em' },
    h3: { fontWeight: 700, fontSize: '1.7rem', letterSpacing: '0.01em' },
    h4: { fontWeight: 700, fontSize: '1.4rem', letterSpacing: '0.01em' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 700, fontSize: '1.1rem', textTransform: 'none', letterSpacing: '0.02em' }
  },
  palette: {
    primary: {
      main: '#FF7EB9', // Bubblegum pink
    },
    secondary: {
      main: '#7AF5FF', // Aqua blue
    },
    background: {
      default: '#FFF6FB', // Very light pink
      paper: '#FFFFFF',
    },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          fontWeight: 700,
          padding: '12px 28px',
          fontSize: '1.1rem',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 22,
          boxShadow: '0 4px 16px 0 #FFD6E8',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 18,
        }
      }
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
