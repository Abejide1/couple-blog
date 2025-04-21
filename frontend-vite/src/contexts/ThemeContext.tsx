import React, { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const ThemeContext = createContext({
  mode: 'light',
  toggleTheme: () => {},
  accent: '#2196f3',
  setAccent: (color: string) => {}
});

export const useThemeMode = () => useContext(ThemeContext);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('themeMode') as 'light' | 'dark') || 'light';
  });
  const [accent, setAccent] = useState<string>(() => {
    return localStorage.getItem('accentColor') || '#2196f3';
  });

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  };

  const handleSetAccent = (color: string) => {
    setAccent(color);
    localStorage.setItem('accentColor', color);
  };

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: accent },
      secondary: { main: '#f50057' },
    },
    shape: { borderRadius: 12 },
    typography: { fontFamily: 'Nunito, Roboto, Arial, sans-serif' }
  }), [mode, accent]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, accent, setAccent: handleSetAccent }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
