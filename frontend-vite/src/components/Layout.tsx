import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
  Tooltip,
  Snackbar,
  Divider,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import SettingsMenu from './SettingsMenu';
import { BsFillCalendarHeartFill, BsFillBookmarkHeartFill } from 'react-icons/bs';
import {
  FaRegSmileBeam,
  FaBlog,
  FaFilm,
  FaTasks,
  FaPalette,
  FaMoon,
  FaSun,
  FaCog,
} from 'react-icons/fa';
import { MdMenu, MdContentCopy } from 'react-icons/md';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';
import { useCouple } from '../contexts/CoupleContext';

const DRAWER_WIDTH = 320;

const defaultAppBarColor = '#FF7EB9';

const menuItems = [
  { text: 'Dashboard', path: '/dashboard', icon: <span style={{ fontSize: 34, color: '#DC0073', filter: 'drop-shadow(0 0 8px #FFD6E8)' }}>🎉</span>, gradient: 'linear-gradient(90deg,#FF7EB9 0%,#B388FF 100%)' },
  { text: 'Compatibility', path: '/compatibility', icon: <span role="img" aria-label="compatibility">💞</span> },
  { text: 'Activities', icon: <FaRegSmileBeam size={36} color="#FF7EB9" />, path: '/activities' },
  { text: 'Books', icon: <BsFillBookmarkHeartFill size={34} color="#7AF5FF" />, path: '/books' },
  { text: 'Movies', icon: <FaFilm size={34} color="#FFD36E" />, path: '/movies' },
  { text: 'Blog', icon: <FaBlog size={34} color="#B388FF" />, path: '/blog' },
  { text: 'Calendar', icon: <BsFillCalendarHeartFill size={36} color="#FF7EB9" />, path: '/calendar' },
  { text: 'Goals', icon: <FaTasks size={36} color="#FFB86B" />, path: '/goals' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [appBarColor, setAppBarColor] = useState(() => localStorage.getItem('appBarColor') || defaultAppBarColor);
  const [settingsAnchor, setSettingsAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [paletteAnchor, setPaletteAnchor] = useState<null | HTMLElement>(null);

  const { mode, toggleTheme, setAccent } = useThemeMode();
  const { coupleCode, clearCode } = useCouple();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Settings for background and floating icons
  const [background, setBackground] = useState<string>(localStorage.getItem('bgColor') || '#FFF6FB');
  const [sidebarColor, setSidebarColor] = useState<string>(localStorage.getItem('sidebarColor') || '#FFF6FB');
  const [floatingIcons, setFloatingIcons] = useState<string>(localStorage.getItem('floatingIcons') || 'hearts');
  const [iconStyle, setIconStyle] = useState<string>(localStorage.getItem('iconStyle') || 'bubbly');

  useEffect(() => { localStorage.setItem('bgColor', background); }, [background]);
  useEffect(() => { localStorage.setItem('sidebarColor', sidebarColor); }, [sidebarColor]);
  useEffect(() => { localStorage.setItem('floatingIcons', floatingIcons); }, [floatingIcons]);
  useEffect(() => { localStorage.setItem('iconStyle', iconStyle); }, [iconStyle]);
  useEffect(() => { localStorage.setItem('appBarColor', appBarColor); }, [appBarColor]);
  useEffect(() => { document.body.style.background = background; }, [background]);

  // User menu handlers
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);

  // Settings menu handlers
  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => setSettingsAnchor(event.currentTarget);
  const handleSettingsClose = () => setSettingsAnchor(null);

  // Color palette handlers
  const handlePaletteClick = (event: React.MouseEvent<HTMLElement>) => setPaletteAnchor(event.currentTarget);
  const handlePaletteClose = () => setPaletteAnchor(null);
  const handleColorChange = (color: any) => {
    setAppBarColor(color.hex);
    setAccent(color.hex);
    setPaletteAnchor(null);
  };

  // Theme toggle
  const handleDarkModeToggle = () => toggleTheme();

  // Profile and logout
  const handleProfile = () => {
    navigate('/profile');
    handleUserMenuClose();
  };
  const handleLogout = () => {
    logout();
    navigate('/login');
    handleUserMenuClose();
  };

  // Drawer content
  const drawer = (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      pt: 2,
      background: 'transparent',
    }}>
      <Toolbar />
      <Divider sx={{ width: '80%', mb: 2 }} />
      <List sx={{ width: '100%', px: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={{ justifyContent: 'center', mb: 2 }}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2.5,
                py: 1.2,
                borderRadius: 99,
                background: '#FFF6FB',
                boxShadow: '0 2px 10px #FFD6E8',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#FF7EB9',
                fontFamily: '"Swanky and Moo Moo", cursive',
                cursor: 'pointer',
                transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                '&:hover': {
                  background: '#DC0073',
                  color: '#fff',
                  boxShadow: '0 4px 24px #DC0073',
                  transform: 'scale(1.07)'
                },
                gap: 2,
                minWidth: 170,
                justifyContent: 'flex-start',
              }}
            >
              <Box sx={{ mr: 1 }}>{item.icon}</Box>
              <span>{item.text}</span>
            </Box>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ width: '80%', my: 2 }} />
      <List sx={{ width: '100%', px: 1 }}>
        {!user && [
          <ListItem key="Login" disablePadding sx={{ justifyContent: 'center', mb: 1 }} onClick={() => { navigate('/login'); setMobileOpen(false); }}>
            <Box sx={{ px: 2.5, py: 1.2, borderRadius: 99, background: '#FFF6FB', boxShadow: '0 2px 10px #FFD6E8', fontWeight: 700, fontFamily: '"Swanky and Moo Moo", cursive', color: '#B388FF', cursor: 'pointer', '&:hover': { background: '#FFEBF7', color: '#fff', boxShadow: '0 4px 24px #FFD6E8', transform: 'scale(1.07)' } }}>
              <span role="img" aria-label="login">🔑</span> Login
            </Box>
          </ListItem>,
          <ListItem key="Register" disablePadding sx={{ justifyContent: 'center', mb: 1 }} onClick={() => { navigate('/register'); setMobileOpen(false); }}>
            <Box sx={{ px: 2.5, py: 1.2, borderRadius: 99, background: '#FFF6FB', boxShadow: '0 2px 10px #FFD6E8', fontWeight: 700, fontFamily: '"Swanky and Moo Moo", cursive', color: '#B388FF', cursor: 'pointer', '&:hover': { background: '#FFEBF7', color: '#fff', boxShadow: '0 4px 24px #FFD6E8', transform: 'scale(1.07)' } }}>
              <span role="img" aria-label="register">📝</span> Register
            </Box>
          </ListItem>,
        ]}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', fontFamily: '"Swanky and Moo Moo", cursive', width: '100%' }}>

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: appBarColor,
          boxShadow: '0 2px 16px #FFD6E8',
          transition: 'background 0.3s',
        }}
      >
        <Toolbar sx={{ minHeight: 80, px: 3, position: 'relative' }}>
          {/* Mobile menu icon */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setMobileOpen((open) => !open)}
            sx={{ mr: 2, display: { sm: 'block' } }}
          >
            <MdMenu size={32} />
          </IconButton>

          {/* App title */}
          <Typography
            variant="h5"
            noWrap
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '0.05em',
              fontFamily: '"Swanky and Moo Moo", cursive',
            }}
          >
            Couple Activities App
          </Typography>

          {/* Challenges button */}
          <Button
            color="secondary"
            startIcon={<FaTasks size={28} />}
            component={RouterLink}
            to="/challenges"
            sx={{
              fontWeight: 'bold',
              fontSize: '1.1rem',
              px: 3,
              py: 1.2,
              borderRadius: 8,
              boxShadow: '0 2px 8px #FFD6E8',
              background: '#fff',
              color: '#FF7EB9',
              ml: 2,
              '&:hover': {
                background: '#FF7EB9',
                color: '#fff'
              }
            }}
          >
            Challenges
          </Button>

          {/* Couple code buttons */}
          {coupleCode && (
            <Tooltip title="Copy couple code">
              <Button
                color="inherit"
                startIcon={<MdContentCopy size={22} />}
                onClick={() => {
                  navigator.clipboard.writeText(coupleCode);
                  setSnackbarOpen(true);
                }}
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: '#fff',
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: 6,
                  mx: 2,
                  '&:hover': {
                    background: '#FFEBF7',
                    color: '#FF7EB9',
                    boxShadow: '0 8px 24px #FFD6E8',
                    transform: 'scale(1.07)',
                  },
                  transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                }}
              >
                {coupleCode}
              </Button>
            </Tooltip>
          )}
          {coupleCode && (
            <Button
              color="inherit"
              onClick={() => {
                clearCode();
                navigate('/code');
              }}
              sx={{
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#fff',
                borderRadius: 6,
                '&:hover': {
                  background: '#FFEBF7',
                  color: '#FF7EB9',
                  boxShadow: '0 8px 24px #FFD6E8',
                  transform: 'scale(1.07)',
                },
                transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                ml: 1,
              }}
            >
              Change Code
            </Button>
          )}

          {/* Settings */}
          <Tooltip title="Settings">
            <IconButton color="inherit" onClick={handleSettingsClick} sx={{ ml: 1 }}>
              <FaCog size={24} />
            </IconButton>
          </Tooltip>

          {/* User avatar/menu */}
          {user && (
            <>
              <Button
                onClick={handleUserMenuOpen}
                sx={{
                  borderRadius: 8,
                  p: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: '#FFF6FB',
                  boxShadow: '0 2px 8px #FFD6E8',
                  minWidth: 0,
                  ml: 2,
                }}
              >
                <Avatar
                  src={user.profile_pic ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/${user.profile_pic}` : undefined}
                  sx={{ bgcolor: '#B388FF', width: 36, height: 36, fontWeight: 700, mr: 1 }}
                >
                  {user.display_name?.charAt(0) || user.email.charAt(0)}
                </Avatar>
                <Typography sx={{ fontWeight: 700, color: '#B388FF', mr: 1, display: { xs: 'none', md: 'block' } }}>
                  {user.display_name || user.email}
                </Typography>
                <span style={{ color: '#B388FF', fontSize: 18, marginLeft: 2 }}>▼</span>
              </Button>
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{ sx: { borderRadius: 4, minWidth: 180, p: 1 } }}
              >
                <MenuItem onClick={handleProfile} sx={{ fontWeight: 700, color: '#B388FF', borderRadius: 2 }}>Profile</MenuItem>
                <MenuItem onClick={handleLogout} sx={{ fontWeight: 700, color: '#FF7EB9', borderRadius: 2 }}>Logout</MenuItem>
              </Menu>
            </>
          )}

          {/* Settings Menu */}
          <SettingsMenu
            anchorEl={settingsAnchor}
            open={Boolean(settingsAnchor)}
            onClose={handleSettingsClose}
            background={background}
            setBackground={setBackground}
            sidebarColor={sidebarColor}
            setSidebarColor={setSidebarColor}
            floatingIcons={floatingIcons}
            setFloatingIcons={setFloatingIcons}
            iconStyle={iconStyle}
            setIconStyle={setIconStyle}
            mode={mode}
            toggleTheme={toggleTheme}
            accent={appBarColor}
            setAccent={setAppBarColor}
          />
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
        aria-label="sidebar"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              background: sidebarColor,
              borderRadius: '32px',
              boxShadow: '0 8px 32px 0 rgba(255, 126, 185, 0.12)',
              backdropFilter: 'blur(12px)',
              border: 'none',
              margin: 2,
              transition: 'background 0.4s',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: background,
        }}
      >
        <Toolbar />
        <Container maxWidth="md" sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          fontFamily: '"Swanky and Moo Moo", cursive',
          mx: 'auto',
          px: { xs: 0, sm: 2 },
        }}>
          {children}
        </Container>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Couple code copied to clipboard"
      />
    </Box>
  );
};

export default Layout;