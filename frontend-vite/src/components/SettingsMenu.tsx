import React from 'react';
import { Menu, Divider, Box, Typography, Button, Switch } from '@mui/material';
import { FaCog, FaIcons, FaMagic, FaGamepad, FaPalette } from 'react-icons/fa';
import { CirclePicker } from 'react-color';

// Expanded color palette: pastels, masculine, ombre/ambient
const colorOptions = [
  // Pastel
  '#FFD6E8', '#B388FF', '#7AF5FF', '#FF7EB9', '#FFD36E', '#B5FFFC', '#FFB6B9', '#C9FFD6', '#FFF6FB', '#E0BBE4',
  // Masculine
  '#232946', '#1E2746', '#3A506B', '#5BC0EB', '#1CA9C9', '#283845', '#212121', '#4B6584',
  // Ombre/Ambient (gradient triggers)
  'linear-gradient(135deg, #232946 0%, #B388FF 100%)',
  'linear-gradient(135deg, #283845 0%, #FFD6E8 100%)',
  'linear-gradient(135deg, #7AF5FF 0%, #FFD36E 100%)',
  'linear-gradient(135deg, #1E2746 0%, #FF7EB9 100%)',
];

// Floating icon options
const floatingIconOptions = [
  { label: 'Hearts', value: 'hearts', icon: '💖' },
  { label: 'Stars', value: 'stars', icon: '⭐' },
  { label: 'Emojis', value: 'emojis', icon: '😊' },
  { label: 'Controllers', value: 'controllers', icon: <FaGamepad color="#5BC0EB" /> },
  { label: 'Mixed', value: 'mixed', icon: '✨' },
  { label: 'None', value: 'none', icon: '🚫' },
];

// Icon style options
const iconStyleOptions = [
  { label: 'Bubbly', value: 'bubbly', icon: <FaMagic color="#FF7EB9" /> },
  { label: 'Minimal', value: 'minimal', icon: <FaIcons color="#B388FF" /> },
  { label: 'Classic', value: 'classic', icon: <FaIcons color="#FFD36E" /> },
  { label: 'Neutral', value: 'neutral', icon: <FaIcons color="#232946" /> },
];

export interface SettingsMenuProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
  background: string;
  setBackground: (color: string) => void;
  floatingIcons: string;
  setFloatingIcons: (type: string) => void;
  iconStyle: string;
  setIconStyle: (style: string) => void;
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  accent: string;
  setAccent: (color: string) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  anchorEl, open, onClose, background, setBackground, floatingIcons, setFloatingIcons, iconStyle, setIconStyle, mode, toggleTheme, accent, setAccent
}) => {
  // Helper: render color swatches (supports gradients)
  const renderColorSwatch = (color: string, selected: boolean, onClick: () => void) => (
    <Box
      key={color}
      onClick={onClick}
      sx={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: color.startsWith('linear-gradient') ? color : undefined,
        bgcolor: !color.startsWith('linear-gradient') ? color : undefined,
        border: selected ? '3px solid #FF7EB9' : '2px solid #FFF',
        boxShadow: selected ? '0 0 8px #FF7EB9' : '0 2px 6px #DDD',
        cursor: 'pointer',
        display: 'inline-block',
        m: 0.5,
      }}
    />
  );

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{ sx: { borderRadius: 4, minWidth: 300, p: 2 } }}
    >
      <Typography variant="h6" sx={{ fontWeight: 900, color: '#B388FF', mb: 1 }}>
        <FaCog style={{ marginRight: 8 }} /> Settings
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <Box mb={2}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FF7EB9', mb: 0.5 }}>Dark Mode</Typography>
        <Switch checked={mode === 'dark'} onChange={toggleTheme} color="primary" />
      </Box>
      <Divider sx={{ mb: 1 }} />
      <Box mb={2}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FF7EB9', mb: 0.5 }}>Accent Color</Typography>
        <Box display="flex" flexWrap="wrap" gap={0.5}>
          {colorOptions.slice(0, 12).map(color => renderColorSwatch(color, accent === color, () => setAccent(color)))}
        </Box>
      </Box>
      <Divider sx={{ mb: 1 }} />
      <Box mb={2}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FF7EB9', mb: 0.5 }}>Background</Typography>
        <Box display="flex" flexWrap="wrap" gap={0.5}>
          {colorOptions.map(color => renderColorSwatch(color, background === color, () => setBackground(color)))}
        </Box>
        <Typography variant="caption" sx={{ color: '#B388FF' }}>
          Includes ombre, ambient, and masculine options
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FF7EB9', mb: 0.5 }}>Floating Icons</Typography>
      <Box display="flex" gap={1} mb={1}>
        {floatingIconOptions.map(opt => (
          <Button
            key={opt.value}
            variant={floatingIcons === opt.value ? 'contained' : 'outlined'}
            color={floatingIcons === opt.value ? 'primary' : 'secondary'}
            sx={{ borderRadius: 6, fontWeight: 700, minWidth: 0, px: 1 }}
            onClick={() => {
              setFloatingIcons(opt.value);
              // Optionally trigger a global event or update a context for visual effect
              window.dispatchEvent(new CustomEvent('floatingIconsChanged', { detail: opt.value }));
            }}
          >
            <span style={{ fontSize: 22 }}>{opt.icon}</span>
          </Button>
        ))}
      </Box>
      <Divider sx={{ my: 1 }} />
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FF7EB9', mb: 0.5 }}>Icon Style</Typography>
      <Box display="flex" gap={1}>
        {iconStyleOptions.map(opt => (
          <Button
            key={opt.value}
            variant={iconStyle === opt.value ? 'contained' : 'outlined'}
            color={iconStyle === opt.value ? 'primary' : 'secondary'}
            sx={{ borderRadius: 6, fontWeight: 700, minWidth: 0, px: 1 }}
            onClick={() => {
              setIconStyle(opt.value);
              window.dispatchEvent(new CustomEvent('iconStyleChanged', { detail: opt.value }));
            }}
          >
            {opt.icon}
          </Button>
        ))}
      </Box>
    </Menu>
  );
};

export default SettingsMenu;
