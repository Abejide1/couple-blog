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
    Snackbar
} from '@mui/material';
import { BsFillCalendarHeartFill, BsFillBookmarkHeartFill } from 'react-icons/bs';
import { FaRegSmileBeam, FaBlog, FaTrophy, FaFilm, FaTasks, FaPalette, FaMoon, FaSun } from 'react-icons/fa';
import { MdMenu, MdContentCopy } from 'react-icons/md';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
    const [darkMode, setDarkMode] = useState(false);
    const { coupleCode, clearCode } = useCouple();
    const navigate = useNavigate();

    const menuItems = [
        { text: 'Activities', icon: <FaRegSmileBeam size={36} color="#FF7EB9" />, path: '/activities' },
        { text: 'Books', icon: <BsFillBookmarkHeartFill size={34} color="#7AF5FF" />, path: '/books' },
        { text: 'Movies', icon: <FaFilm size={34} color="#FFD36E" />, path: '/movies' },
        { text: 'Blog', icon: <FaBlog size={34} color="#B388FF" />, path: '/blog' },
        { text: 'Calendar', icon: <BsFillCalendarHeartFill size={36} color="#FF7EB9" />, path: '/calendar' },
        { text: 'Goals', icon: <FaTasks size={36} color="#FFB86B" />, path: '/goals' },
    ];

    const drawer = (
        <Box>
            <Toolbar />
            <List>
                {menuItems.map((item) => (
                    <ListItem 
                        key={item.text}
                        disablePadding
                    >
                        <ListItemButton
                            component={RouterLink}
                            to={item.path}
                            onClick={() => setMobileOpen(false)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    // Persist color to localStorage
    useEffect(() => {
      localStorage.setItem('appBarColor', appBarColor);
    }, [appBarColor]);

    // Palette icon click handler
    const handlePaletteClick = (event: React.MouseEvent<HTMLElement>) => {
      setPaletteAnchor(event.currentTarget);
    };
    const handlePaletteClose = () => setPaletteAnchor(null);
    const handleColorChange = (color: any) => {
      setAppBarColor(color.hex);
      setPaletteAnchor(null);
    };

    // Dark mode toggle handler (move to top right, visible)
    const handleDarkModeToggle = () => setDarkMode((d) => !d);

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
                        {darkMode ? <FaSun size={22} color="#FFD36E" /> : <FaMoon size={22} color="#B388FF" />}
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
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 2px 16px #FFD6E8', p: 2 } }}
                    >
                        <CirclePicker
                            colors={paletteColors}
                            color={appBarColor}
                            onChange={handleColorChange}
                        />
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
                                sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', background: 'rgba(255,255,255,0.15)', borderRadius: 6 }}
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
                            sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', borderRadius: 6 }}
                        >
                            Change Code
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { 
                            boxSizing: 'border-box', 
                            width: DRAWER_WIDTH 
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { 
                            boxSizing: 'border-box', 
                            width: DRAWER_WIDTH 
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

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
};

export default Layout;
