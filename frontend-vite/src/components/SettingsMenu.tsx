import React, { useState } from 'react';
import { Menu, MenuItem, Box, Typography, IconButton, Divider, Button } from '@mui/material';
import { FaCog, FaPalette, FaIcons, FaMagic } from 'react-icons/fa';
import { CirclePicker } from 'react-color';

const pastelColors = [
  '#FFD6E8', '#B388FF', '#7AF5FF', '#FF7EB9', '#FFD36E', '#B5FFFC', '#FFB6B9', '#C9FFD6', '#FFF6FB', '#E0BBE4'
];

const floatingIconOptions = [
  { label: 'Hearts', value: 'hearts', icon: '💖' },
  { label: 'Stars', value: 'stars', icon: '⭐' },
  { label: 'Emojis', value: 'emojis', icon: '😊' },
  { label: 'Mixed', value: 'mixed', icon: '✨' },
  { label: 'None', value: 'none', icon: '🚫' },
];

const iconStyleOptions = [
  { label: 'Bubbly', value: 'bubbly', icon: <FaMagic color="#FF7EB9" /> },
  { label: 'Minimal', value: 'minimal', icon: <FaIcons color="#B388FF" /> },
  { label: 'Classic', value: 'classic', icon: <FaIcons color="#FFD36E" /> },
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
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  anchorEl, open, onClose, background, setBackground, floatingIcons, setFloatingIcons, iconStyle, setIconStyle
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{ sx: { borderRadius: 4, minWidth: 270, p: 2 } }}
    >
      <Typography variant="h6" sx={{ fontWeight: 900, color: '#B388FF', mb: 1 }}>
        <FaCog style={{ marginRight: 8 }} /> Settings
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FF7EB9', mb: 0.5 }}>Background Color</Typography>
      <CirclePicker
        colors={pastelColors}
        color={background}
        onChange={color => setBackground(color.hex)}
        circleSize={28}
        circleSpacing={10}
      />
      <Divider sx={{ my: 1 }} />
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FF7EB9', mb: 0.5 }}>Floating Icons</Typography>
      <Box display="flex" gap={1} mb={1}>
        {floatingIconOptions.map(opt => (
          <Button
            key={opt.value}
            variant={floatingIcons === opt.value ? 'contained' : 'outlined'}
            color={floatingIcons === opt.value ? 'primary' : 'secondary'}
            sx={{ borderRadius: 6, fontWeight: 700, minWidth: 0, px: 1 }}
            onClick={() => setFloatingIcons(opt.value)}
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
            onClick={() => setIconStyle(opt.value)}
          >
            {opt.icon}
          </Button>
        ))}
      </Box>
    </Menu>
  );
};

export default SettingsMenu;
