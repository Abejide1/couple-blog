import React from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Container, 
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Button,
    Tooltip,
    Snackbar,
    Divider,
    useMediaQuery,
    useTheme,
    Menu,
    MenuItem,
    Avatar
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import SettingsMenu from './SettingsMenu';
import { BsFillCalendarHeartFill, BsFillBookmarkHeartFill } from 'react-icons/bs';
import { FaRegSmileBeam, FaBlog, FaTrophy, FaFilm, FaTasks, FaPalette, FaMoon, FaSun, FaCog } from 'react-icons/fa';
import { MdMenu, MdContentCopy } from 'react-icons/md';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useThemeMode } from '../contexts/ThemeContext';
import { Popover, Box as MuiBox } from '@mui/material';
import { CirclePicker } from 'react-color';
import { useCouple } from '../contexts/CoupleContext';

const DRAWER_WIDTH = 320;

interface LayoutProps {
    children: React.ReactNode;
}

const defaultAppBarColor = '#FF7EB9';
const paletteColors = [
  '#FF7EB9', '#7AF5FF', '#FFD36E', '#B388FF', '#C3F6C7', '#FFB86B', '#FFEBF7', '#FFF6FB', '#FFB6B9', '#B5EAD7', '#FFDAC1', '#E2F0CB', '#C7CEEA', '#F6A6B2', '#B5B2C2'
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [appBarColor, setAppBarColor] = useState(() => localStorage.getItem('appBarColor') || defaultAppBarColor);
    const [paletteAnchor, setPaletteAnchor] = useState<null | HTMLElement>(null);
    const { mode, toggleTheme, setAccent } = useThemeMode();
    const { coupleCode, clearCode } = useCouple();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const menuItems = [
        { text: 'Compatibility', path: '/compatibility', icon: <span role="img" aria-label="compatibility">💞</span> },
        { text: 'Activities', icon: <FaRegSmileBeam size={36} color="#FF7EB9" />, path: '/activities' },
        { text: 'Books', icon: <BsFillBookmarkHeartFill size={34} color="#7AF5FF" />, path: '/books' },
        { text: 'Movies', icon: <FaFilm size={34} color="#FFD36E" />, path: '/movies' },
        { text: 'Blog', icon: <FaBlog size={34} color="#B388FF" />, path: '/blog' },
        { text: 'Calendar', icon: <BsFillCalendarHeartFill size={36} color="#FF7EB9" />, path: '/calendar' },
        { text: 'Goals', icon: <FaTasks size={36} color="#FFB86B" />, path: '/goals' },
    ];

    // Auth menu for sidebar footer (only show Login/Register if not logged in)
    const authMenu = !user ? [
        { text: 'Login', path: '/login', icon: <span role="img" aria-label="login">🔑</span> },
        { text: 'Register', path: '/register', icon: <span role="img" aria-label="register">📝</span> }
    ] : [];

    // AppBar user dropdown state
    const [userMenuAnchor, setUserMenuAnchor] = React.useState<null | HTMLElement>(null);
    const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setUserMenuAnchor(event.currentTarget);
    };
    const handleUserMenuClose = () => {
        setUserMenuAnchor(null);
    };
    const handleProfile = () => {
        navigate('/profile');
        handleUserMenuClose();
    };
    const handleLogout = () => {
        logout();
        navigate('/login');
        handleUserMenuClose();
    };

    // Settings dropdown state
    const [settingsAnchor, setSettingsAnchor] = React.useState<null | HTMLElement>(null);
    const handleSettingsClick = (e: React.MouseEvent<HTMLElement>) => setSettingsAnchor(e.currentTarget);
    const handleSettingsClose = () => setSettingsAnchor(null);
    // Customization state
    const [background, setBackground] = React.useState<string>(localStorage.getItem('bgColor') || '#FFF6FB');
    const [floatingIcons, setFloatingIcons] = React.useState<string>(localStorage.getItem('floatingIcons') || 'hearts');
    const [iconStyle, setIconStyle] = React.useState<string>(localStorage.getItem('iconStyle') || 'bubbly');
    React.useEffect(() => { localStorage.setItem('bgColor', background); }, [background]);
    React.useEffect(() => { localStorage.setItem('floatingIcons', floatingIcons); }, [floatingIcons]);
    React.useEffect(() => { localStorage.setItem('iconStyle', iconStyle); }, [iconStyle]);
    // Apply background color live
    React.useEffect(() => {
        document.body.style.background = background;
    }, [background]);

    const drawer = (
        <Box>
            <Toolbar />
            <Divider />
            <List>
                {menuItems.map((item, idx) => (
                    <ListItem button key={item.text} onClick={() => navigate(item.path)}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ mt: 2 }} />
            <List sx={{ mt: 1 }}>
                {authMenu.map((item, idx) => (
                    <ListItem button key={item.text} onClick={() => navigate(item.path)}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    // Persist color to localStorage
    useEffect(() => {
      localStorage.setItem('appBarColor', appBarColor);
    }, [appBarColor]);

    const handlePaletteClick = (event: React.MouseEvent<HTMLElement>) => {
      setPaletteAnchor(event.currentTarget);
    };
    const handlePaletteClose = () => setPaletteAnchor(null);
    const handleColorChange = (color: any) => {
      setAppBarColor(color.hex);
      setAccent(color.hex); // update global accent color
      setPaletteAnchor(null);
    };
    const handleDarkModeToggle = () => toggleTheme();

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: appBarColor, boxShadow: '0 2px 16px #FFD6E8', transition: 'background 0.3s' }}>
                <Toolbar sx={{ minHeight: 80, px: 3, position: 'relative' }}>
                    {/* Dark mode toggle at top right */}
                    <IconButton
                        onClick={handleDarkModeToggle}
                        sx={{ position: 'absolute', top: 18, right: 20, zIndex: 2, background: 'rgba(255,255,255,0.25)', '&:hover': { background: 'rgba(255,255,255,0.5)' }, boxShadow: '0 2px 8px #FFD6E8' }}
                        size="large"
                        aria-label="toggle dark mode"
                    >
                        {mode === 'dark' ? <FaSun size={22} color="#FFD36E" /> : <FaMoon size={22} color="#B388FF" />}
                    </IconButton>

                    {/* Palette icon at bottom center of AppBar */}
                    <MuiBox sx={{ position: 'absolute', left: '50%', bottom: -26, transform: 'translateX(-50%)', zIndex: 2 }}>
                        <IconButton
                            onClick={handlePaletteClick}
                            sx={{ background: '#fff', borderRadius: '50%', boxShadow: '0 2px 8px #FFD6E8', width: 52, height: 52, border: '2px solid #FF7EB9', '&:hover': { background: '#FFEBF7' } }}
                            aria-label="Choose color palette"
                        >
                            <FaPalette size={28} color={appBarColor} />
                        </IconButton>
                    </MuiBox>
                    <Popover
                        open={Boolean(paletteAnchor)}
                        anchorEl={paletteAnchor}
                        onClose={handlePaletteClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                        PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 2px 16px #FFD6E8', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 } }}
                    >
                        {/* Custom vertical color picker with extra bottom margin */}
                        <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2, mb: 2 }}>
                            {paletteColors.map((color) => (
                                <IconButton
                                    key={color}
                                    onClick={() => handleColorChange({ hex: color })}
                                    sx={{ background: color, border: appBarColor === color ? '3px solid #444' : '2px solid #fff', mb: 0.5, width: 36, height: 36, boxShadow: appBarColor === color ? '0 0 8px #FFD6E8' : undefined }}
                                />
                            ))}
                        </MuiBox>
                    </Popover>
                    <IconButton
                        color="primary"
                        aria-label="open drawer"
                        edge="start"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        sx={{ mr: 3, display: { sm: 'none' }, fontSize: 36 }}
                    >
                        <MdMenu size={36} />
                    </IconButton>
                    <Typography variant="h4" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700, color: '#fff', letterSpacing: '0.05em', fontFamily: 'Grotesco, Arial, sans-serif' }}>
                        Couple Activities Blog
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Button
                            color="secondary"
                            startIcon={<FaTrophy size={32} />}
                            component={RouterLink}
                            to="/challenges"
                            sx={{ fontWeight: 'bold', fontSize: '1.2rem', px: 3, py: 1.5, borderRadius: 8, boxShadow: '0 2px 8px #FFD6E8', background: '#fff', color: '#FF7EB9', '&:hover': { background: '#FF7EB9', color: '#fff' } }}
                        >
                            Challenges
                        </Button>
                        <Tooltip title="Copy couple code">
                            <Button
                                color="inherit"
                                startIcon={<MdContentCopy size={26} />}
                                onClick={() => {
                                    if (coupleCode) {
                                        navigator.clipboard.writeText(coupleCode);
                                        setSnackbarOpen(true);
                                    }
                                }}
                                sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', background: 'rgba(255,255,255,0.15)', borderRadius: 6, '&:hover': { background: '#FFEBF7', color: '#FF7EB9', boxShadow: '0 8px 24px #FFD6E8', transform: 'scale(1.07)' }, transition: 'all 0.18s cubic-bezier(.4,2,.6,1)' }}
                            >
                                {coupleCode}
                            </Button>
                        </Tooltip>
                        <Button
                            color="inherit"
                            onClick={() => {
                                clearCode();
                                navigate('/code');
                            }}
                            sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', borderRadius: 6, '&:hover': { background: '#FFEBF7', color: '#FF7EB9', boxShadow: '0 8px 24px #FFD6E8', transform: 'scale(1.07)' }, transition: 'all 0.18s cubic-bezier(.4,2,.6,1)' }}
                        >
                            Change Code
                        </Button>
                    </Box>
                    {/* User avatar/profile/logout dropdown */}
                    {user && (
                        <Box ml={2}>
                            <Button
                                onClick={handleUserMenuOpen}
                                sx={{
                                    borderRadius: 8,
                                    p: 0.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    bgcolor: '#FFF6FB',
                                    boxShadow: '0 2px 8px #FFD6E8',
                                    '&:hover': { bgcolor: '#FFD6E8' },
                                    minWidth: 0
                                }}
                            >
                                <Avatar
                                    src={user.profile_pic ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/${user.profile_pic}` : undefined}
                                    sx={{ width: 36, height: 36, bgcolor: '#FFD6E8', fontWeight: 900, mr: 1 }}
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
                        </Box>
                    )}
                    {/* Settings gear icon and dropdown */}
                    <Tooltip title="Settings">
                        <IconButton color="inherit" onClick={handleSettingsClick} sx={{ ml: 1 }}>
                            <FaCog size={28} />
                        </IconButton>
                    </Tooltip>
                    <SettingsMenu
                        anchorEl={settingsAnchor}
                        open={Boolean(settingsAnchor)}
                        onClose={handleSettingsClose}
                        background={background}
                        setBackground={setBackground}
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
            <Box
                component="main"
};
const handlePaletteClose = () => setPaletteAnchor(null);
const handleColorChange = (color: any) => {
  setAppBarColor(color.hex);
  setAccent(color.hex); // update global accent color
  setPaletteAnchor(null);
};
const handleDarkModeToggle = () => toggleTheme();
const handleProfile = () => navigate('/profile');
const handleLogout = () => logout();

return (
  <Box sx={{ display: 'flex' }}>
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: appBarColor, boxShadow: '0 2px 16px #FFD6E8', transition: 'background 0.3s' }}>
      <Toolbar sx={{ minHeight: 80, px: 3, position: 'relative' }}>
        {/* Dark mode toggle at top right */}
        <IconButton
          onClick={handleDarkModeToggle}
          sx={{ position: 'absolute', top: 18, right: 20, zIndex: 2, background: 'rgba(255,255,255,0.25)', '&:hover': { background: 'rgba(255,255,255,0.5)' }, boxShadow: '0 2px 8px #FFD6E8' }}
          size="large"
          aria-label="toggle dark mode"
        >
          {mode === 'dark' ? <FaSun size={22} color="#FFD36E" /> : <FaMoon size={22} color="#B388FF" />}
        </IconButton>

        {/* Palette icon at bottom center of AppBar */}
        <MuiBox sx={{ position: 'absolute', left: '50%', bottom: -26, transform: 'translateX(-50%)', zIndex: 2 }}>
          <IconButton
            onClick={handlePaletteClick}
            sx={{ background: '#fff', borderRadius: '50%', boxShadow: '0 2px 8px #FFD6E8', width: 52, height: 52, border: '2px solid #FF7EB9', '&:hover': { background: '#FFEBF7' } }}
            aria-label="Choose color palette"
          >
            <FaPalette size={28} color={appBarColor} />
          </IconButton>
        </MuiBox>
        <Popover
          open={Boolean(paletteAnchor)}
          anchorEl={paletteAnchor}
          onClose={handlePaletteClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 2px 16px #FFD6E8', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 } }}
        >
          {/* Custom vertical color picker with extra bottom margin */}
          <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2, mb: 2 }}>
            {paletteColors.map((color) => (
              <IconButton
                key={color}
                onClick={() => handleColorChange({ hex: color })}
                sx={{ background: color, border: appBarColor === color ? '3px solid #444' : '2px solid #fff', mb: 0.5, width: 36, height: 36, boxShadow: appBarColor === color ? '0 0 8px #FFD6E8' : undefined }}
              />
            ))}
          </MuiBox>
        </Popover>
        <IconButton
          color="primary"
          aria-label="open drawer"
          edge="start"
          onClick={() => setMobileOpen(!mobileOpen)}
          sx={{ mr: 3, display: { sm: 'none' }, fontSize: 36 }}
        >
          <MdMenu size={36} />
        </IconButton>
        <Typography variant="h4" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700, color: '#fff', letterSpacing: '0.05em', fontFamily: 'Grotesco, Arial, sans-serif' }}>
          Couple Activities Blog
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Button
            color="secondary"
            startIcon={<FaTrophy size={32} />}
            component={RouterLink}
            to="/challenges"
            sx={{ fontWeight: 'bold', fontSize: '1.2rem', px: 3, py: 1.5, borderRadius: 8, boxShadow: '0 2px 8px #FFD6E8', background: '#fff', color: '#FF7EB9', '&:hover': { background: '#FF7EB9', color: '#fff' } }}
          >
            Challenges
          </Button>
          <Tooltip title="Copy couple code">
            <Button
              color="inherit"
              startIcon={<MdContentCopy size={26} />}
              onClick={() => {
                if (coupleCode) {
                  navigator.clipboard.writeText(coupleCode);
                  setSnackbarOpen(true);
                }
              }}
              sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', background: 'rgba(255,255,255,0.15)', borderRadius: 6, '&:hover': { background: '#FFEBF7', color: '#FF7EB9', boxShadow: '0 8px 24px #FFD6E8', transform: 'scale(1.07)' }, transition: 'all 0.18s cubic-bezier(.4,2,.6,1)' }}
            >
              {coupleCode}
            </Button>
          </Tooltip>
          <Button
            color="inherit"
            onClick={() => {
              clearCode();
              navigate('/code');
            }}
            sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', borderRadius: 6, '&:hover': { background: '#FFEBF7', color: '#FF7EB9', boxShadow: '0 8px 24px #FFD6E8', transform: 'scale(1.07)' }, transition: 'all 0.18s cubic-bezier(.4,2,.6,1)' }}
          >
            Change Code
          </Button>
        </Box>
        {/* User avatar/profile/logout dropdown */}
        {user && (
          <Box ml={2}>
            <Button
              onClick={handleUserMenuOpen}
              sx={{
                borderRadius: 8,
                p: 0.5,
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#FFF6FB',
                boxShadow: '0 2px 8px #FFD6E8',
                '&:hover': { bgcolor: '#FFD6E8' },
                minWidth: 0
              }}
            >
              <Avatar
                src={user.profile_pic ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/${user.profile_pic}` : undefined}
                sx={{ width: 36, height: 36, bgcolor: '#FFD6E8', fontWeight: 900, mr: 1 }}
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
          </Box>
        )}
        {/* Settings gear icon and dropdown */}
        <Tooltip title="Settings">
          <IconButton color="inherit" onClick={handleSettingsClick} sx={{ ml: 1 }}>
            <FaCog size={28} />
          </IconButton>
        </Tooltip>
        <SettingsMenu
          anchorEl={settingsAnchor}
          open={Boolean(settingsAnchor)}
          onClose={handleSettingsClose}
          background={background}
          setBackground={setBackground}
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
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        marginLeft: { sm: `${DRAWER_WIDTH}px` },
      }}
    >
      <Toolbar />
      <Container maxWidth="lg">
        {children}
      </Container>
    </Box>
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={2000}
      onClose={() => setSnackbarOpen(false)}
      message="Couple code copied to clipboard"
    />
  </Box>
);

export default Layout;
