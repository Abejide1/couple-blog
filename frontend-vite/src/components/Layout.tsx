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
import { 
    Menu as MenuIcon,
    LocalActivity,
    Book,
    Movie,
    Create,
    Share,
    ContentCopy
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCouple } from '../contexts/CoupleContext';

const DRAWER_WIDTH = 240;

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const { coupleCode, clearCode } = useCouple();
    const navigate = useNavigate();

    const menuItems = [
        { text: 'Activities', icon: <LocalActivity />, path: '/activities' },
        { text: 'Books', icon: <Book />, path: '/books' },
        { text: 'Movies', icon: <Movie />, path: '/movies' },
        { text: 'Blog', icon: <Create />, path: '/blog' },
        { text: 'Calendar', icon: <Share />, path: '/calendar' }, // Using 'Share' as a calendar icon alternative
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

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Couple Activities Blog
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Tooltip title="Copy couple code">
                            <Button
                                color="inherit"
                                startIcon={<ContentCopy />}
                                onClick={() => {
                                    if (coupleCode) {
                                        navigator.clipboard.writeText(coupleCode);
                                        setSnackbarOpen(true);
                                    }
                                }}
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
