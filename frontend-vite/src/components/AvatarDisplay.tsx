import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Avatar from 'avataaars';
import { AvataaarsOptions } from './AdvancedAvatarCreator';

interface AvatarDisplayProps {
  size?: number;
  displayText?: string;
  style?: React.CSSProperties;
}

// Default avatar configuration in case no saved one exists
const defaultAvatarOptions: AvataaarsOptions = {
  topType: 'ShortHairShortRound',
  accessoriesType: 'Blank',
  hairColor: 'BrownDark',
  facialHairType: 'Blank',
  facialHairColor: 'BrownDark',
  clotheType: 'GraphicShirt',
  clotheColor: 'Blue03',
  eyeType: 'Default',
  eyebrowType: 'Default',
  mouthType: 'Smile',
  skinColor: 'Light'
};

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ 
  size = 40, 
  displayText,
  style
}) => {
  const [avatarOptions, setAvatarOptions] = useState<AvataaarsOptions>(defaultAvatarOptions);
  const [loading, setLoading] = useState(true);

  // Try to load avatar options from localStorage
  useEffect(() => {
    try {
      const savedAvatar = localStorage.getItem('userAvatarOptions');
      if (savedAvatar) {
        setAvatarOptions(JSON.parse(savedAvatar));
      }
    } catch (err) {
      console.error('Error loading avatar data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // If we're still loading or no avatar data, show a fallback
  if (loading) {
    return (
      <Box 
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />
    );
  }

  // If displayText is provided and no avatar data, show fallback
  if (displayText && !avatarOptions) {
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
          ...style
        }}
      >
        {displayText.charAt(0).toUpperCase()}
      </Box>
    );
  }
  
  return (
    <Box 
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        ...style
      }}
    >
      <Avatar
        style={{ width: '100%', height: '100%' }}
        avatarStyle='Circle'
        topType={avatarOptions.topType}
        accessoriesType={avatarOptions.accessoriesType}
        hairColor={avatarOptions.hairColor}
        facialHairType={avatarOptions.facialHairType}
        facialHairColor={avatarOptions.facialHairColor}
        clotheType={avatarOptions.clotheType}
        clotheColor={avatarOptions.clotheColor}
        eyeType={avatarOptions.eyeType}
        eyebrowType={avatarOptions.eyebrowType}
        mouthType={avatarOptions.mouthType}
        skinColor={avatarOptions.skinColor}
      />
    </Box>
  );
};

export default AvatarDisplay;
