import React from 'react';
import { Box } from '@mui/material';
import { AvatarData } from './AvatarCreator';

interface SimpleAvatarProps {
  size?: number;
  avatarData?: AvatarData;
  displayText?: string;
}

// Default avatar configuration
const defaultAvatar: AvatarData = {
  shape: 'circle',
  bgColor: '#FFD6E8',
  fgColor: '#FF7EB9',
  topType: 'shortHair',
  accessory: 'none',
  facialFeature: 'smile'
};

const SimpleAvatar: React.FC<SimpleAvatarProps> = ({ 
  size = 40, 
  avatarData: initialData, 
  displayText 
}) => {
  // Try to get avatar data from localStorage if not provided
  let avatarData = initialData || defaultAvatar;
  
  if (!initialData) {
    try {
      const savedAvatar = localStorage.getItem('userAvatar');
      if (savedAvatar) {
        avatarData = JSON.parse(savedAvatar);
      }
    } catch (err) {
      console.error('Error loading avatar data:', err);
    }
  }
  
  // Determine border radius based on shape
  const getBorderRadius = () => {
    switch (avatarData.shape) {
      case 'circle': return '50%';
      case 'rounded': return '20px';
      case 'square': return '5px';
      default: return '50%';
    }
  };
  
  // Get top element (hair or hat)
  const getTopElement = () => {
    switch (avatarData.topType) {
      case 'shortHair':
        return (
          <Box sx={{
            position: 'absolute',
            top: '-5%',
            left: '10%',
            right: '10%',
            height: '35%',
            backgroundColor: avatarData.fgColor,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            zIndex: 1
          }} />
        );
      case 'longHair':
        return (
          <Box sx={{
            position: 'absolute',
            top: '-10%',
            left: '5%',
            right: '5%',
            height: '50%',
            backgroundColor: avatarData.fgColor,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            zIndex: 1
          }} />
        );
      case 'hat':
        return (
          <Box sx={{
            position: 'absolute',
            top: '-15%',
            left: '-5%',
            right: '-5%',
            height: '40%',
            backgroundColor: avatarData.fgColor,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            zIndex: 3,
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '0',
              left: '-10%',
              right: '-10%',
              height: '25%',
              backgroundColor: avatarData.fgColor,
              borderRadius: '5px',
              zIndex: 4
            }
          }} />
        );
      case 'beanie':
        return (
          <Box sx={{
            position: 'absolute',
            top: '-15%',
            left: '0%',
            right: '0%',
            height: '30%',
            backgroundColor: avatarData.fgColor,
            borderTopLeftRadius: '40%',
            borderTopRightRadius: '40%',
            zIndex: 3
          }} />
        );
      default:
        return null;
    }
  };
  
  // Get facial feature
  const getFacialFeature = () => {
    const featureStyle = {
      position: 'absolute',
      bottom: '30%',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 2,
      fontSize: `${size * 0.3}px`,
      color: avatarData.fgColor
    };
    
    switch (avatarData.facialFeature) {
      case 'smile':
        return <Box sx={featureStyle as any}>◡</Box>;
      case 'laugh':
        return <Box sx={featureStyle as any}>◠</Box>;
      case 'surprised':
        return <Box sx={featureStyle as any}>○</Box>;
      case 'serious':
        return <Box sx={featureStyle as any}>―</Box>;
      case 'wink':
        return <Box sx={featureStyle as any}>◡⌣</Box>;
      default:
        return <Box sx={featureStyle as any}>◡</Box>;
    }
  };
  
  // Get accessory element
  const getAccessory = () => {
    switch (avatarData.accessory) {
      case 'glasses':
        return (
          <Box sx={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '70%',
            height: '20%',
            zIndex: 2,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '40%',
              left: '15%',
              width: '30%',
              height: '30%',
              border: `2px solid ${avatarData.fgColor}`,
              borderRadius: '50%'
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '40%',
              right: '15%',
              width: '30%',
              height: '30%',
              border: `2px solid ${avatarData.fgColor}`,
              borderRadius: '50%'
            }
          }} />
        );
      case 'sunglasses':
        return (
          <Box sx={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '20%',
            zIndex: 2,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '40%',
              left: '10%',
              width: '35%',
              height: '30%',
              backgroundColor: avatarData.fgColor,
              borderRadius: '10px'
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '40%',
              right: '10%',
              width: '35%',
              height: '30%',
              backgroundColor: avatarData.fgColor,
              borderRadius: '10px'
            }
          }} />
        );
      case 'earrings':
        return (
          <>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '5%',
              width: '8%',
              height: '8%',
              backgroundColor: avatarData.fgColor,
              borderRadius: '50%',
              zIndex: 2
            }} />
            <Box sx={{
              position: 'absolute',
              top: '50%',
              right: '5%',
              width: '8%',
              height: '8%',
              backgroundColor: avatarData.fgColor,
              borderRadius: '50%',
              zIndex: 2
            }} />
          </>
        );
      default:
        return null;
    }
  };
  
  // Eyes are always present
  const Eyes = () => (
    <>
      <Box sx={{
        position: 'absolute',
        top: '40%',
        left: '30%',
        width: '10%',
        height: '10%',
        backgroundColor: avatarData.fgColor,
        borderRadius: '50%',
        zIndex: 2
      }} />
      <Box sx={{
        position: 'absolute',
        top: '40%',
        right: '30%',
        width: '10%',
        height: '10%',
        backgroundColor: avatarData.fgColor,
        borderRadius: '50%',
        zIndex: 2
      }} />
    </>
  );

  // If displayText is provided and no avatar data, show fallback
  if (displayText && !avatarData) {
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
          fontSize: size * 0.5
        }}
      >
        {displayText.charAt(0).toUpperCase()}
      </Box>
    );
  }
  
  return (
    <Box sx={{
      position: 'relative',
      width: size,
      height: size,
      backgroundColor: avatarData.bgColor,
      borderRadius: getBorderRadius(),
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {getTopElement()}
      <Eyes />
      {getFacialFeature()}
      {getAccessory()}
    </Box>
  );
};

export default SimpleAvatar;
