import React from 'react';
import { Box, Typography } from '@mui/material';
import { FaSmile, FaMeh, FaLaugh, FaSadTear, FaAngry, FaHeart } from 'react-icons/fa';

interface AvatarData {
  faceColor: string;
  hairStyle: string;
  hairColor: string;
  expression: string;
  accessory: string;
}

interface CustomAvatarProps {
  size?: number;
  displayText?: string; // Fallback text if no avatar data is available
}

// Use default pastel colors if nothing is saved yet
const defaultAvatar: AvatarData = {
  faceColor: '#FFD6E8',
  hairStyle: 'short',
  hairColor: '#6D4C41',
  expression: 'smile',
  accessory: 'none'
};

const CustomAvatar: React.FC<CustomAvatarProps> = ({ size = 40, displayText }) => {
  // Try to get avatar data from localStorage
  let avatarData = defaultAvatar;
  try {
    // First check if there's a temporary preview avatar (for the creator)
    const tempPreview = localStorage.getItem('tempAvatarPreview');
    // Otherwise use the saved user avatar
    const savedData = localStorage.getItem('userAvatar');
    
    if (tempPreview) {
      // Use temp preview if it exists (for avatar creator preview)
      avatarData = { ...defaultAvatar, ...JSON.parse(tempPreview) };
    } else if (savedData) {
      // Use saved avatar for normal display
      avatarData = { ...defaultAvatar, ...JSON.parse(savedData) };
    }
  } catch (err) {
    console.error('Error loading avatar data:', err);
  }

  const { faceColor, hairStyle, hairColor, expression, accessory } = avatarData;

  // Helper function to get expression icon
  const getExpressionIcon = () => {
    const iconSize = size * 0.35;
    switch(expression) {
      case 'smile': return <FaSmile color="#333" size={iconSize} />;
      case 'laugh': return <FaLaugh color="#333" size={iconSize} />;
      case 'meh': return <FaMeh color="#333" size={iconSize} />;
      case 'sad': return <FaSadTear color="#333" size={iconSize} />;
      case 'angry': return <FaAngry color="#333" size={iconSize} />;
      case 'love': return <FaHeart color="#333" size={iconSize} />;
      default: return <FaSmile color="#333" size={iconSize} />;
    }
  };

  // If no avatar data and no display text, show empty avatar
  if (!avatarData && !displayText) {
    return (
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          bgcolor: '#B388FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: size * 0.5
        }}
      >
        ?
      </Box>
    );
  }

  // Get scaling factors based on avatar size with simplified values for better rendering
  // Adjust hair position based on size to ensure it looks good at any scale
  const hairTopOffset = {
    'short': -size * 0.25,
    'medium': -size * 0.3,
    'long': -size * 0.4,
    'curly': -size * 0.3,
    'wavy': -size * 0.35,
    'bald': 0
  }[hairStyle] || -size * 0.3;

  const hairHeight = {
    'long': size * 0.9,
    'medium': size * 0.7,
    'short': size * 0.5,
    'curly': size * 0.6,
    'wavy': size * 0.7,
    'bald': 0
  }[hairStyle] || size * 0.5;

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: faceColor,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}
    >
      {/* Fallback text if needed */}
      {!avatarData && displayText && (
        <Typography variant="body1" fontWeight="bold" color="#fff">
          {displayText.charAt(0)}
        </Typography>
      )}

      {/* Hair - with simplified, more reliable styling */}
      {hairStyle !== 'bald' && (
        <Box
          sx={{
            position: 'absolute',
            top: hairTopOffset,
            left: 0,
            right: 0,
            height: hairHeight,
            backgroundColor: hairColor,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            ...(hairStyle === 'curly' && {
              transform: 'scaleX(1.2)',
              borderTopLeftRadius: '60%',
              borderTopRightRadius: '60%',
              boxShadow: `0 -${size*0.03}px ${size*0.05}px ${hairColor}`
            }),
            ...(hairStyle === 'wavy' && {
              borderTopLeftRadius: '40%',
              borderTopRightRadius: '40%',
              boxShadow: `0 -${size*0.03}px ${size*0.05}px ${hairColor}`
            }),
            ...(hairStyle === 'long' && {
              height: hairHeight,
              boxShadow: `0 -${size*0.03}px ${size*0.05}px ${hairColor}`
            }),
            ...(hairStyle === 'medium' && {
              borderTopLeftRadius: '45%',
              borderTopRightRadius: '45%',
            }),
            ...(hairStyle === 'short' && {
              borderTopLeftRadius: '40%',
              borderTopRightRadius: '40%',
            })
          }}
        />
      )}
      
      {/* Face/Expression - adjusted positioning */}
      <Box sx={{ 
        marginTop: hairStyle === 'bald' ? 0 : size * 0.1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 5 /* Ensure expressions show on top */
      }}>
        {getExpressionIcon()}
      </Box>
      
      {/* Accessories - improved styling with better positioning */}
      {accessory === 'glasses' && (
        <>
          {/* Left Lens */}
          <Box sx={{ 
            position: 'absolute', 
            top: size * 0.38, 
            left: size * 0.15, 
            width: size * 0.25, 
            height: size * 0.25, 
            border: `${size * 0.03}px solid #333`,
            borderRadius: '50%',
            opacity: 0.85,
            zIndex: 10
          }} />
          {/* Right Lens */}
          <Box sx={{ 
            position: 'absolute', 
            top: size * 0.38, 
            right: size * 0.15, 
            width: size * 0.25, 
            height: size * 0.25, 
            border: `${size * 0.03}px solid #333`,
            borderRadius: '50%',
            opacity: 0.85,
            zIndex: 10
          }} />
          {/* Bridge */}
          <Box sx={{ 
            position: 'absolute', 
            top: size * 0.45, 
            left: size * 0.38, 
            right: size * 0.38, 
            height: size * 0.03, 
            backgroundColor: '#333',
            opacity: 0.85,
            zIndex: 10
          }} />
        </>
      )}
      {accessory === 'hat' && (
        <Box sx={{ 
          position: 'absolute', 
          top: -size * 0.15, 
          left: -size * 0.05, 
          right: -size * 0.05, 
          height: size * 0.25, 
          backgroundColor: '#ff5722', 
          borderTopLeftRadius: size * 0.1, 
          borderTopRightRadius: size * 0.1,
          boxShadow: `0 -${size*0.03}px ${size*0.05}px rgba(0,0,0,0.1)`,
          zIndex: 15
        }} />
      )}
      {accessory === 'earrings' && (
        <>
          <Box sx={{ 
            position: 'absolute', 
            top: size * 0.45, 
            left: -size * 0.05,
            width: size * 0.15, 
            height: size * 0.15, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}>
            <Box sx={{
              width: size * 0.08,
              height: size * 0.08,
              backgroundColor: '#ffeb3b',
              borderRadius: '50%',
              boxShadow: `0 0 ${size*0.03}px #ffd700`
            }} />
          </Box>
          <Box sx={{ 
            position: 'absolute', 
            top: size * 0.45, 
            right: -size * 0.05,
            width: size * 0.15, 
            height: size * 0.15, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}>
            <Box sx={{
              width: size * 0.08,
              height: size * 0.08,
              backgroundColor: '#ffeb3b',
              borderRadius: '50%',
              boxShadow: `0 0 ${size*0.03}px #ffd700`
            }} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default CustomAvatar;
