import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/mobile.css'; // Import iOS-optimized styles
import FloatingShapes from './components/FloatingShapes';
import { applyIOSUIAdjustments, isNativeMobile } from './utils/mobileUtils';

// Add global gradient background
const gradientStyle = document.createElement('style');
gradientStyle.innerHTML = `
  body {
    background: linear-gradient(135deg, #FFF6FB 0%, #FFEBF7 40%, #B5EAD7 100%);
    min-height: 100vh;
    overflow-x: hidden;
    /* iOS viewport height fix */
    min-height: -webkit-fill-available;
  }
  
  html {
    height: -webkit-fill-available;
  }
`;
document.head.appendChild(gradientStyle);

// Apply iOS-specific adjustments
document.addEventListener('DOMContentLoaded', () => {
  applyIOSUIAdjustments();
});



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

// Create a wrapper component to handle mobile-specific logic
const AppWrapper = () => {
  useEffect(() => {
    // Initialize mobile-specific features
    if (isNativeMobile()) {
      // Add iOS status bar height adjustment
      document.documentElement.style.setProperty(
        '--safe-area-inset-top',
        'env(safe-area-inset-top)'
      );
      
      // Add bottom safe area for iPhone home indicator
      document.documentElement.style.setProperty(
        '--safe-area-inset-bottom',
        'env(safe-area-inset-bottom)'
      );
      
      // Add mobile class to body
      document.body.classList.add('mobile-device');
    }
  }, []);
  
  return (
    <>
      <FloatingShapes />
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
