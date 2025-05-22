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

  // Improved and more reliable hair styling system
  // Calculate more precise values to keep hair contained within the avatar circle
  const hairTopOffset = {
    'short': -size * 0.15,      // Less negative to stay more inside the circle
    'medium': -size * 0.18,     // More contained
    'long': -size * 0.2,        // Reduced negative value
    'curly': -size * 0.16,      // More contained
    'wavy': -size * 0.17,       // More contained
    'bald': 0                   // No hair, no offset
  }[hairStyle] || -size * 0.15; // Safer default

  const hairHeight = {
    'short': size * 0.35,       // Shorter hair
    'medium': size * 0.5,       // Medium height
    'long': size * 0.65,        // Long but more contained
    'curly': size * 0.45,       // Slightly shorter than before
    'wavy': size * 0.5,         // Medium height
    'bald': 0                   // No hair
  }[hairStyle] || size * 0.4;   // Safer default

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

      {/* Improved hair styling system with better containment */}
      {hairStyle !== 'bald' && (
        <>
          {/* Base hair layer */}
          <Box
            sx={{
              position: 'absolute',
              top: hairTopOffset,
              left: -size * 0.05,  // Extend slightly outside for better blending
              right: -size * 0.05, // Extend slightly outside for better blending
              width: size * 1.1,   // Slightly wider than head
              height: hairHeight,
              backgroundColor: hairColor,
              borderRadius: '50% 50% 0 0', // Rounded top, flat bottom
              zIndex: 1,
              // Ensure the hair sits properly within the circle
              clipPath: hairStyle === 'bald' ? 'none' : 'ellipse(50% 80% at 50% 0%)'
            }}
          />
          
          {/* Hair style-specific overlays */}
          {hairStyle === 'curly' && (
            <Box
              sx={{
                position: 'absolute',
                top: hairTopOffset, 
                left: -size * 0.02,
                right: -size * 0.02,
                height: hairHeight * 0.7,
                background: `radial-gradient(circle at center, ${hairColor} 30%, transparent 70%)`,
                borderRadius: '50% 50% 45% 45%',
                zIndex: 2,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: size * 0.1,
                  right: size * 0.1,
                  height: size * 0.15,
                  background: hairColor,
                  borderRadius: '40% 40% 45% 45%'
                }
              }}
            />
          )}
          
          {hairStyle === 'wavy' && (
            <Box
              sx={{
                position: 'absolute',
                top: hairTopOffset,
                left: 0,
                right: 0,
                height: hairHeight * 0.8,
                background: `linear-gradient(to bottom, ${hairColor} 60%, transparent 100%)`,
                borderRadius: '30% 30% 60% 60%',
                zIndex: 2,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -size * 0.05,
                  left: size * 0.15,
                  right: size * 0.15,
                  height: size * 0.1,
                  background: `linear-gradient(to bottom, ${hairColor}, transparent)`,
                  borderRadius: '0 0 40% 40%'
                }
              }}
            />
          )}
          
          {hairStyle === 'long' && (
            <Box
              sx={{
                position: 'absolute',
                top: hairTopOffset,
                left: 0,
                right: 0,
                height: hairHeight,
                background: `linear-gradient(to bottom, ${hairColor} 70%, ${hairColor}BB 85%, ${hairColor}99 100%)`,
                borderRadius: '40% 40% 30% 30%',
                zIndex: 2
              }}
            />
          )}
          
          {hairStyle === 'medium' && (
            <Box
              sx={{
                position: 'absolute',
                top: hairTopOffset,
                left: size * 0.05,
                right: size * 0.05,
                height: hairHeight * 0.8,
                backgroundColor: hairColor,
                borderRadius: '45% 45% 40% 40%',
                zIndex: 2
              }}
            />
          )}
          
          {hairStyle === 'short' && (
            <Box
              sx={{
                position: 'absolute',
                top: hairTopOffset,
                left: size * 0.1,
                right: size * 0.1,
                height: hairHeight,
                backgroundColor: hairColor,
                borderRadius: '40% 40% 50% 50%',
                zIndex: 2
              }}
            />
          )}
        </>
      )}
      
      {/* Face/Expression - better positioned relative to hair */}
      <Box sx={{ 
        marginTop: hairStyle === 'bald' ? 0 : size * 0.12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10 /* Higher z-index to ensure it appears on top of all hair styles */
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
            zIndex: 15 /* Increased to ensure visibility */
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
            zIndex: 15 /* Increased to ensure visibility */
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
            zIndex: 15 /* Increased to ensure visibility */
          }} />
        </>
      )}
      {accessory === 'hat' && (
        <>
          {/* Hat base */}
          <Box sx={{ 
            position: 'absolute', 
            top: -size * 0.12, 
            left: -size * 0.05, 
            right: -size * 0.05, 
            height: size * 0.25, 
            backgroundColor: '#ff5722', 
            borderTopLeftRadius: size * 0.2, 
            borderTopRightRadius: size * 0.2,
            boxShadow: `0 -${size*0.03}px ${size*0.05}px rgba(0,0,0,0.1)`,
            zIndex: 20 /* Higher z-index to appear above hair */
          }} />
          {/* Hat brim */}
          <Box sx={{ 
            position: 'absolute', 
            top: size * 0.1, 
            left: -size * 0.1, 
            right: -size * 0.1, 
            height: size * 0.05, 
            backgroundColor: '#e64a19', /* Darker shade for the brim */
            borderRadius: '3px',
            zIndex: 21 /* Above the hat base */
          }} />
        </>
      )}
      {accessory === 'earrings' && (
        <>
          {/* Left earring */}
          <Box sx={{ 
            position: 'absolute', 
            top: size * 0.45, 
            left: -size * 0.08, /* Positioned more outward */
            width: size * 0.15, 
            height: size * 0.15, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 15 /* Increased z-index */
          }}>
            <Box sx={{
              width: size * 0.08,
              height: size * 0.08,
              backgroundColor: '#ffeb3b',
              borderRadius: '50%',
              boxShadow: `0 0 ${size*0.04}px #ffd700`,
              border: '1px solid #ffd700' /* Added border for better definition */
            }} />
          </Box>
          {/* Right earring */}
          <Box sx={{ 
            position: 'absolute', 
            top: size * 0.45, 
            right: -size * 0.08, /* Positioned more outward */
            width: size * 0.15, 
            height: size * 0.15, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 15 /* Increased z-index */
          }}>
            <Box sx={{
              width: size * 0.08,
              height: size * 0.08,
              backgroundColor: '#ffeb3b',
              borderRadius: '50%',
              boxShadow: `0 0 ${size*0.04}px #ffd700`,
              border: '1px solid #ffd700' /* Added border for better definition */
            }} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default CustomAvatar;
