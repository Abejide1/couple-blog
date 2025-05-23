import React from 'react';
import { Box, IconButton, Typography, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdHome, MdTimeline, MdLocalActivity, MdPerson } from 'react-icons/md';
import SimpleAvatarDisplay from './SimpleAvatarDisplay';
import { useAuth } from '../contexts/AuthContext';

/**
 * Mobile-specific navigation bar that appears at the bottom of the screen on iOS
 * Uses avatar display instead of profile photos, maintaining the app's preference
 */
const MobileNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Define navigation items with their routes and icons
  const navItems = [
    { route: '/dashboard', icon: <MdHome size={24} />, label: 'Home' },
    { route: '/timeline', icon: <MdTimeline size={24} />, label: 'Timeline' },
    { route: '/activities', icon: <MdLocalActivity size={24} />, label: 'Activities' },
    { route: '/profile', icon: user ? 
      <SimpleAvatarDisplay size={32} displayText={user?.display_name || 'U'} /> : 
      <MdPerson size={24} />, 
      label: 'Profile' }
  ];
  
  return (
    <Paper 
      elevation={3}
      sx={{
        display: { xs: 'flex', md: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        paddingBottom: 'var(--safe-area-inset-bottom)',
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.route;
        return (
          <Box
            key={item.route}
            onClick={() => navigate(item.route)}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 1,
              color: isActive ? '#FF7EB9' : '#999',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              '&:hover': {
                color: '#FF7EB9',
              }
            }}
          >
            <IconButton 
              sx={{ 
                color: 'inherit',
                transform: isActive ? 'translateY(-8px)' : 'none',
                background: isActive ? 'linear-gradient(135deg, #FFD6E8 0%, #FFF6FB 100%)' : 'transparent',
                boxShadow: isActive ? '0 4px 8px rgba(255, 126, 185, 0.25)' : 'none',
              }}
            >
              {item.icon}
            </IconButton>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '0.7rem',
                mt: 0.5,
                opacity: isActive ? 1 : 0.7
              }}
            >
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Paper>
  );
};

export default MobileNavBar;
