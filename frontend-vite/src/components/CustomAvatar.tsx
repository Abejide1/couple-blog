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

  // Further refined hair styling system with more precise positioning
  // Values adjusted for better containment within the avatar circle
  const hairTopOffset = {
    'short': -size * 0.05,      // Barely extends above the circle
    'medium': -size * 0.08,     // Small extension above the circle
    'long': -size * 0.1,        // Minimal extension above
    'curly': -size * 0.07,      // Barely extends above
    'wavy': -size * 0.08,       // Small extension above
    'bald': 0                   // No hair, no offset
  }[hairStyle] || -size * 0.05; // Very conservative default

  const hairHeight = {
    'short': size * 0.3,        // Very short
    'medium': size * 0.4,       // Medium but contained
    'long': size * 0.55,        // Long but still within bounds
    'curly': size * 0.35,       // Shorter for better containment
    'wavy': size * 0.4,         // Medium but contained
    'bald': 0                   // No hair
  }[hairStyle] || size * 0.3;   // Conservative default

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
          {/* Base hair layer - improved positioning */}
          <Box
            sx={{
              position: 'absolute',
              top: hairTopOffset,
              left: 0,              // Aligned with the head edges
              right: 0,             // Aligned with the head edges
              width: size,          // Same width as head
              height: hairHeight,
              backgroundColor: hairColor,
              borderRadius: '50% 50% 0 0', // Rounded top, flat bottom
              zIndex: 1,
              overflow: 'hidden',  // Ensure content stays within the boundaries
              // Ensures hair stays within the avatar circle
              clipPath: 'ellipse(50% 60% at 50% 0%)'
            }}
          />
          
          {/* Hair style-specific overlays */}
          {hairStyle === 'curly' && (
            <Box
              sx={{
                position: 'absolute',
                top: hairTopOffset + size * 0.02, // Adjusted to sit lower
                left: size * 0.1,    // Inset from edges
                right: size * 0.1,   // Inset from edges
                width: size * 0.8,   // 80% of head width
                height: size * 0.25, // Shorter height
                backgroundColor: hairColor,
                borderRadius: '40% 40% 30% 30%',
                zIndex: 2,
                // Curly texture effect using multiple radial gradients
                backgroundImage: `
                  radial-gradient(circle at 30% 20%, ${hairColor}AA 10%, transparent 20%),
                  radial-gradient(circle at 70% 20%, ${hairColor}AA 10%, transparent 20%),
                  radial-gradient(circle at 50% 40%, ${hairColor}AA 10%, transparent 20%),
                  radial-gradient(circle at 20% 60%, ${hairColor}AA 10%, transparent 20%),
                  radial-gradient(circle at 80% 60%, ${hairColor}AA 10%, transparent 20%)
                `,
                // Ensure it stays within bounds
                overflow: 'hidden'
              }}
            />
          )}
          
          {hairStyle === 'wavy' && (
            <Box
              sx={{
                position: 'absolute',
                top: hairTopOffset + size * 0.02, // Adjusted position
                left: size * 0.05, // Inset from edges
                right: size * 0.05, // Inset from edges
                height: hairHeight * 0.75, // Slightly shorter
                background: hairColor,
                borderRadius: '40% 40% 35% 35%',
                zIndex: 2,
                // Wavy effect using a wavy border and box-shadow
                borderBottom: `${size * 0.05}px solid ${hairColor}`,
                borderBottomLeftRadius: '40%',
                borderBottomRightRadius: '40%',
                boxShadow: `
                  0 ${size * 0.05}px 0 -${size * 0.02}px ${hairColor},
                  0 ${size * 0.1}px 0 -${size * 0.04}px ${hairColor}
                `,
                // Contain everything within bounds
                clipPath: 'ellipse(50% 60% at 50% 40%)'
              }}
            />
          )}
          
          {hairStyle === 'long' && (
            <Box
              sx={{
                position: 'absolute',
                top: hairTopOffset + size * 0.01, // Slightly adjusted position
                left: size * 0.05, // Inset from edges
                right: size * 0.05, // Inset from edges
                height: size * 0.5, // Consistent height regardless of size
                background: hairColor,
                borderRadius: '40% 40% 5% 5%', // Flatter bottom for longer appearance
                zIndex: 2,
                // Long flowing hair effect using gradients
                backgroundImage: `linear-gradient(to bottom, ${hairColor} 75%, ${hairColor}DD 100%)`,
                // Keep hair within bounds 
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 90%, 50% 100%, 0% 90%)'
              }}
            />
          )}
          
          {hairStyle === 'medium' && (
            <Box
              sx={{
                position: 'absolute',
                top: hairTopOffset + size * 0.02, // Adjusted position 
                left: size * 0.1,  // More inset from edges
                right: size * 0.1, // More inset from edges
                height: size * 0.3, // Fixed height proportion
                backgroundColor: hairColor,
                borderRadius: '50% 50% 40% 40%', // More rounded top
                zIndex: 2,
                // Add subtle texture
                backgroundImage: `linear-gradient(to bottom, ${hairColor} 90%, ${hairColor}EE 100%)`,
                // Ensure clean edges
                boxShadow: `0 ${size * 0.02}px 0 ${hairColor}`
              }}
            />
          )}
          
          {hairStyle === 'short' && (
            <Box
              sx={{
                position: 'absolute',
                top: hairTopOffset + size * 0.03, // Positioned lower on head
                left: size * 0.15,  // More inset for shorter appearance
                right: size * 0.15, // More inset for shorter appearance
                height: size * 0.2,  // Very short fixed height
                backgroundColor: hairColor,
                borderRadius: '60% 60% 40% 40%', // Very rounded top
                zIndex: 2,
                // Subtle shadow to create depth
                boxShadow: `inset 0 ${size * 0.02}px ${size * 0.01}px rgba(0,0,0,0.1)`
              }}
            />
          )}
        </>
      )}
      
      {/* Face/Expression - precisely positioned */}
      <Box sx={{ 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -40%)', // Slightly above center
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10 /* Higher z-index to ensure it appears on top of all hair styles */
      }}>
        {getExpressionIcon()}
      </Box>
      
      {/* Accessories - improved styling with better positioning */}
      {accessory === 'glasses' && (
        <>
          {/* Left Lens - repositioned */}
          <Box sx={{ 
            position: 'absolute', 
            top: size * 0.36, 
            left: size * 0.18, 
            width: size * 0.24, 
            height: size * 0.22, 
            border: `${size * 0.02}px solid #333`,
            borderRadius: '45%',
            opacity: 0.8,
            zIndex: 15 /* Increased to ensure visibility */
          }} />
          {/* Right Lens - repositioned */}
          <Box sx={{ 
            position: 'absolute', 
            top: size * 0.36, 
            right: size * 0.18, 
            width: size * 0.24, 
            height: size * 0.22, 
            border: `${size * 0.02}px solid #333`,
            borderRadius: '45%',
            opacity: 0.8,
            zIndex: 15 /* Increased to ensure visibility */
          }} />
          {/* Bridge - repositioned */}
          <Box sx={{ 
            position: 'absolute', 
            top: size * 0.44, 
            left: size * 0.4, 
            right: size * 0.4, 
            height: size * 0.02, 
            backgroundColor: '#333',
            opacity: 0.8,
            zIndex: 15 /* Increased to ensure visibility */
          }} />
          {/* Arms (temple pieces) */}
          <Box sx={{ 
            position: 'absolute', 
            top: size * 0.42, 
            left: size * 0.08, 
            width: size * 0.12, 
            height: size * 0.02, 
            backgroundColor: '#333',
            opacity: 0.8,
            transform: 'rotate(15deg)',
            zIndex: 15
          }} />
          <Box sx={{ 
            position: 'absolute', 
            top: size * 0.42, 
            right: size * 0.08, 
            width: size * 0.12, 
            height: size * 0.02, 
            backgroundColor: '#333',
            opacity: 0.8,
            transform: 'rotate(-15deg)',
            zIndex: 15
          }} />
        </>
      )}
      {accessory === 'hat' && (
        <>
          {/* Hat base - repositioned */}
          <Box sx={{ 
            position: 'absolute', 
            top: -size * 0.05, 
            left: -size * 0.02, 
            right: -size * 0.02, 
            height: size * 0.2, 
            backgroundColor: '#ff5722', 
            borderTopLeftRadius: size * 0.2, 
            borderTopRightRadius: size * 0.2,
            boxShadow: `0 -${size*0.01}px ${size*0.03}px rgba(0,0,0,0.1)`,
            zIndex: 20 /* Higher z-index to appear above hair */
          }} />
          {/* Hat brim - repositioned */}
          <Box sx={{ 
            position: 'absolute', 
            top: size * 0.13, 
            left: -size * 0.05, 
            right: -size * 0.05, 
            height: size * 0.04, 
            backgroundColor: '#e64a19', /* Darker shade for the brim */
            borderRadius: '3px',
            zIndex: 21 /* Above the hat base */
          }} />
        </>
      )}
      {accessory === 'earrings' && (
        <>
          {/* Left earring - repositioned */}
          <Box sx={{ 
            position: 'absolute', 
            top: size * 0.45, 
            left: -size * 0.05, /* Positioned more inward */
            width: size * 0.12, 
            height: size * 0.12, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 15 /* Increased z-index */
          }}>
            <Box sx={{
              width: size * 0.07,
              height: size * 0.07,
              backgroundColor: '#ffeb3b',
              borderRadius: '50%',
              boxShadow: `0 0 ${size*0.03}px #ffd700`,
              border: '1px solid #ffd700' /* Added border for better definition */
            }} />
          </Box>
          {/* Right earring - repositioned */}
          <Box sx={{ 
            position: 'absolute', 
            top: size * 0.45, 
            right: -size * 0.05, /* Positioned more inward */
            width: size * 0.12, 
            height: size * 0.12, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 15 /* Increased z-index */
          }}>
            <Box sx={{
              width: size * 0.07,
              height: size * 0.07,
              backgroundColor: '#ffeb3b',
              borderRadius: '50%',
              boxShadow: `0 0 ${size*0.03}px #ffd700`,
              border: '1px solid #ffd700' /* Added border for better definition */
            }} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default CustomAvatar;
