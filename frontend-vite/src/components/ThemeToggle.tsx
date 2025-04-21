import React from 'react';
import { IconButton, Tooltip, Box, Menu, MenuItem, Typography } from '@mui/material';
import { Brightness4, Brightness7, Palette } from '@mui/icons-material';
import { useThemeMode } from '../contexts/ThemeContext';

const accentColors = [
  '#2196f3', '#f50057', '#43a047', '#ff9800', '#9c27b0', '#e91e63', '#607d8b', '#ffd600'
];

export default function ThemeToggle() {
  const { mode, toggleTheme, accent, setAccent } = useThemeMode();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handlePaletteClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePaletteClose = () => setAnchorEl(null);

  return (
    <Box position="fixed" bottom={24} right={24} zIndex={2000}>
      <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
        <IconButton onClick={toggleTheme} color="inherit" size="large" sx={{ bgcolor: 'background.paper', boxShadow: 3, mr: 1 }}>
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Pick Accent Color">
        <IconButton onClick={handlePaletteClick} color="inherit" size="large" sx={{ bgcolor: 'background.paper', boxShadow: 3 }}>
          <Palette />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handlePaletteClose}>
        <Typography px={2} pt={1} variant="subtitle2">Accent Color</Typography>
        <Box display="flex" flexWrap="wrap" p={2} gap={2}>
          {accentColors.map((color) => (
            <Box
              key={color}
              onClick={() => { setAccent(color); handlePaletteClose(); }}
              sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: color, cursor: 'pointer', border: accent === color ? '2px solid #333' : '2px solid transparent' }}
            />
          ))}
        </Box>
      </Menu>
    </Box>
  );
}
