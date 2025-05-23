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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SimpleAvatarDisplay from './SimpleAvatarDisplay';
import MobileNavBar from './MobileNavBar';
import { useAuth } from '../contexts/AuthContext';
import SettingsMenu from './SettingsMenu';
import { BsFillCalendarHeartFill, BsFillBookmarkHeartFill } from 'react-icons/bs';
import {
  FaRegSmileBeam,
  FaBlog,
  FaFilm,
  FaTasks,
  FaCog,
} from 'react-icons/fa';
import { MdMenu, MdContentCopy } from 'react-icons/md';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';
import { useCouple } from '../contexts/CoupleContext';
import { isNativeMobile, isIOS } from '../utils/mobileUtils';

const DRAWER_WIDTH = 320;
const defaultAppBarColor = '#FF7EB9';

const menuItems = [
  { text: 'Dashboard', path: '/dashboard', icon: <span style={{ fontSize: 34, color: '#DC0073', filter: 'drop-shadow(0 0 8px #FFD6E8)' }}>🎉</span>, gradient: 'linear-gradient(90deg,#FF7EB9 0%,#B388FF 100%)' },
  { text: 'Timeline', path: '/timeline', icon: <span role="img" aria-label="timeline" style={{ fontSize: 28, filter: 'drop-shadow(0 0 4px rgba(179, 136, 255, 0.5))' }}>✨</span>, gradient: 'linear-gradient(90deg,#B388FF 0%,#7AF5FF 100%)' },
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

  const { mode, toggleTheme } = useThemeMode();
  // Ensure mode is correctly typed as 'light' | 'dark'
  const themeMode = mode as 'light' | 'dark';
  const { coupleCode } = useCouple();
  const navigate = useNavigate();
  const location = useLocation();
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

  // Auto-close sidebar on any navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Menu handlers
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);
  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => setSettingsAnchor(event.currentTarget);
  const handleSettingsClose = () => setSettingsAnchor(null);

  // Drawer content
  const drawer = (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 900, color: '#B388FF', mb: 2, textAlign: 'center' }}>
        Couple Activities
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={RouterLink}
            to={item.path}
            onClick={() => { if (isMobile) setMobileOpen(false); }}
            sx={{
              borderRadius: 4,
              mb: 1,
              bgcolor: location.pathname === item.path ? '#FFD6E8' : 'transparent',
              color: location.pathname === item.path ? '#DC0073' : '#B388FF',
              fontWeight: 700,
              transition: 'background 0.3s',
              '&:hover': {
                bgcolor: '#FFF6FB',
                color: '#DC0073',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}

        {/* Login and Register buttons when user is not logged in */}
        {!user && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#B388FF', mb: 1, pl: 2 }}>
              Account
            </Typography>
            <ListItem
              component={RouterLink}
              to="/login"
              onClick={() => { if (isMobile) setMobileOpen(false); }}
              sx={{
                borderRadius: 4,
                mb: 1,
                bgcolor: location.pathname === '/login' ? '#FFD6E8' : 'transparent',
                color: location.pathname === '/login' ? '#DC0073' : '#B388FF',
                fontWeight: 700,
                transition: 'background 0.3s',
                '&:hover': {
                  bgcolor: '#FFF6FB',
                  color: '#DC0073',
                },
              }}
            >
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem
              component={RouterLink}
              to="/register"
              onClick={() => { if (isMobile) setMobileOpen(false); }}
              sx={{
                borderRadius: 4,
                mb: 1,
                bgcolor: location.pathname === '/register' ? '#FFD6E8' : 'transparent',
                color: location.pathname === '/register' ? '#DC0073' : '#B388FF',
                fontWeight: 700,
                transition: 'background 0.3s',
                '&:hover': {
                  bgcolor: '#FFF6FB',
                  color: '#DC0073',
                },
              }}
            >
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  // Determine if we should show mobile UI elements
  const isiOSDevice = isIOS();
  const usesMobileLayout = isNativeMobile() || isMobile;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: background }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${mobileOpen ? DRAWER_WIDTH : 0}px)` },
          ml: { sm: `${mobileOpen ? DRAWER_WIDTH : 0}px` },
          background: appBarColor,
          boxShadow: 'none',
          height: isiOSDevice ? 'calc(80px + var(--safe-area-inset-top))' : 80,
          paddingTop: isiOSDevice ? 'var(--safe-area-inset-top)' : 0,
          display: 'flex',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          zIndex: theme.zIndex.drawer + 1,
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

          {/* Couple code button */}
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
                {coupleCode}
              </Button>
            </Tooltip>
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
                <SimpleAvatarDisplay
                  size={36}
                  displayText={user.display_name || user.email}
                />
                
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
                <MenuItem onClick={() => { handleUserMenuClose(); navigate('/profile'); }} sx={{ fontWeight: 700, color: '#B388FF', borderRadius: 2 }}>Profile</MenuItem>
                <MenuItem onClick={() => { handleUserMenuClose(); logout(); }} sx={{ fontWeight: 700, color: '#FF7EB9', borderRadius: 2 }}>Logout</MenuItem>
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
            mode={themeMode}
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
          // Add padding for mobile nav bar on iOS devices
          paddingBottom: isiOSDevice ? 'calc(64px + var(--safe-area-inset-bottom))' : 0,
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
      
      {/* Mobile Navigation Bar for iOS */}
      {isiOSDevice && <MobileNavBar />}

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