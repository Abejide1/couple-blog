import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/Layout';
import Activities from './pages/Activities';
import Books from './pages/Books';
import Movies from './pages/Movies';
import Blog from './pages/Blog';
import CodeEntry from './pages/CodeEntry';
import { CoupleProvider } from './contexts/CoupleContext';
import RequireCode from './components/RequireCode';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CoupleProvider>
          <Routes>
            <Route path="/code" element={<CodeEntry />} />
            <Route
              path="/*"
              element={
                <RequireCode>
                  <Layout>
                    <Routes>
                      <Route path="/activities" element={<Activities />} />
                      <Route path="/books" element={<Books />} />
                      <Route path="/movies" element={<Movies />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/" element={<Navigate to="/activities" replace />} />
                    </Routes>
                  </Layout>
                </RequireCode>
              }
            />
          </Routes>
        </CoupleProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
