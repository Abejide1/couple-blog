import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';

// Interface for component props
interface SimpleAvatarDisplayProps {
  size?: number;
  displayText?: string;
  style?: React.CSSProperties;
}

// Interface for avatar data
interface AvatarOptions {
  topType: string;
  accessoriesType: string;
  hairColor: string;
  facialHairType: string;
  facialHairColor: string;
  clotheType: string;
  clotheColor: string;
  eyeType: string;
  eyebrowType: string;
  mouthType: string;
  skinColor: string;
}

/**
 * SimpleAvatarDisplay Component
 * 
 * Displays a user avatar in a simple circular format.
 * Follows the app's avatar-based approach rather than photo uploads.
 */
const SimpleAvatarDisplay: React.FC<SimpleAvatarDisplayProps> = ({ 
  size = 40, 
  displayText = '?',
  style
}) => {
  const [avatarOptions, setAvatarOptions] = useState<AvatarOptions | null>(null);
  const [loading, setLoading] = useState(true);

  // Load avatar options from localStorage on mount
  useEffect(() => {
    const loadAvatar = async () => {
      try {
        // Try to get avatar from localStorage
        const savedAvatar = localStorage.getItem('userAvatarOptions');
        if (savedAvatar) {
          setAvatarOptions(JSON.parse(savedAvatar));
        } else {
          // If no avatar found, use text-based display instead
          setAvatarOptions(null);
        }
      } catch (error) {
        console.error('Error loading avatar options:', error);
        setAvatarOptions(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadAvatar();
  }, []);

  // If still loading, show a loading indicator
  if (loading) {
    return (
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: '#FFE6F3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={size/2} sx={{ color: '#FF7EB9' }} />
      </Box>
    );
  }

  // For avatar-based approach: If we have avatar options, render a simplified avatar
  // Otherwise fall back to text-based representation
  if (avatarOptions) {
    // Simple avatar with facial features (following avatar-based approach)
    return (
      <Box 
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: '#FFE6F3',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
          ...style
        }}
      >
        {/* Simple face representation - for iOS performance */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {/* Hair */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '40%',
              backgroundColor: '#FF7EB9',
              opacity: 0.7,
            }}
          />
          
          {/* Eyes */}
          <Box
            sx={{
              position: 'absolute',
              top: '40%',
              left: '25%',
              width: '15%',
              height: '15%',
              backgroundColor: '#333',
              borderRadius: '50%',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '40%',
              right: '25%',
              width: '15%',
              height: '15%',
              backgroundColor: '#333',
              borderRadius: '50%',
            }}
          />
          
          {/* Mouth */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '25%',
              left: '35%',
              width: '30%',
              height: '5%',
              borderBottom: '2px solid #333',
              borderRadius: '50%',
            }}
          />
        </Box>
      </Box>
    );
  }
  
  // Text-based avatar (used when no avatar options exist)
  return (
    <Box 
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#FFD6E8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FF7EB9',
        fontWeight: 'bold',
        fontSize: size * 0.5,
        // iOS optimizations
        minWidth: size < 40 ? 40 : size,
        touchAction: 'manipulation',
        ...style
      }}
    >
      {displayText.charAt(0).toUpperCase()}
    </Box>
  );
};

export default SimpleAvatarDisplay;
