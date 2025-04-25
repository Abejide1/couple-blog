import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CustomThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import Layout from './components/Layout';
import Activities from './pages/Activities';
import Books from './pages/Books';
import Movies from './pages/Movies';
import Blog from './pages/Blog';
import Compatibility from './pages/Compatibility';
import Calendar from './pages/Calendar';
import Challenges from './pages/Challenges';
import Goals from './pages/Goals';
import CodeEntry from './pages/CodeEntry';
import { CoupleProvider } from './contexts/CoupleContext';
import RequireCode from './components/RequireCode';



function App() {
  return (
    <BrowserRouter>
      <CustomThemeProvider>

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
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/challenges" element={<Challenges />} />
                      <Route path="/goals" element={<Goals />} />
                      <Route path="/compatibility" element={<Compatibility />} />
                      <Route path="/" element={<Navigate to="/activities" replace />} />
                    </Routes>
                  </Layout>
                </RequireCode>
              }
            />
          </Routes>
        </CoupleProvider>
      </CustomThemeProvider>
    </BrowserRouter>
  );
}

export default App;
