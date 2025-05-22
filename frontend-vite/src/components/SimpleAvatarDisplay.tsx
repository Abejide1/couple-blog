import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { AvatarOptions } from './CustomizableAvatar';

interface SimpleAvatarDisplayProps {
  size?: number;
  displayText?: string;
  style?: React.CSSProperties;
}

// Default avatar configuration in case no saved one exists
const defaultAvatarOptions: AvatarOptions = {
  topType: 'ShortHairFlat',
  accessoriesType: 'None',
  hairColor: 'BrownDark',
  facialHairType: 'None',
  facialHairColor: 'BrownDark',
  clotheType: 'GraphicShirt',
  clotheColor: 'Blue03',
  eyeType: 'Default',
  eyebrowType: 'Default',
  mouthType: 'Smile',
  skinColor: 'Light'
};

const getHairColorHex = (color: string) => {
  const colors: Record<string, string> = {
    'Auburn': '#A52A2A',
    'Black': '#000000',
    'Blonde': '#FFFF99',
    'BlondeGolden': '#FFD700',
    'Brown': '#A52A2A',
    'BrownDark': '#663300',
    'PastelPink': '#FFB6C1',
    'Platinum': '#CCCCCC',
    'Red': '#FF0000',
    'SilverGray': '#C0C0C0'
  };
  return colors[color] || '#000000';
};

const getSkinColorHex = (color: string) => {
  const colors: Record<string, string> = {
    'Tanned': '#D2B48C',
    'Yellow': '#FFE0BD',
    'Pale': '#F5DEB3',
    'Light': '#F5DDAD',
    'Brown': '#C68642',
    'DarkBrown': '#8D5524',
    'Black': '#633A34'
  };
  return colors[color] || '#F5DEB3';
};

const getClothesColorHex = (color: string) => {
  const colors: Record<string, string> = {
    'Black': '#000000',
    'Blue01': '#0000FF',
    'Blue02': '#0066CC',
    'Blue03': '#6699FF',
    'Gray01': '#666666',
    'Gray02': '#999999',
    'Heather': '#9999FF',
    'PastelBlue': '#99CCFF',
    'PastelGreen': '#99FF99',
    'PastelOrange': '#FFCC99',
    'PastelRed': '#FF9999',
    'PastelYellow': '#FFFF99',
    'Pink': '#FF99CC',
    'Red': '#FF0000',
    'White': '#FFFFFF'
  };
  return colors[color] || '#0066CC';
};

const SimpleAvatarDisplay: React.FC<SimpleAvatarDisplayProps> = ({ 
  size = 40, 
  displayText,
  style
}) => {
  const [avatarOptions, setAvatarOptions] = useState<AvatarOptions>(defaultAvatarOptions);
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

  // If we're still loading, show a skeleton
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
  
  const skinColor = getSkinColorHex(avatarOptions.skinColor);
  const hairColor = getHairColorHex(avatarOptions.hairColor);
  const clothesColor = getClothesColorHex(avatarOptions.clotheColor);
  
  return (
    <Box 
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        ...style
      }}
    >
      {/* Head/Face */}
      <Box sx={{
        position: 'absolute',
        top: '15%',
        left: '15%',
        width: '70%',
        height: '70%',
        borderRadius: '50%',
        backgroundColor: skinColor,
        zIndex: 1
      }} />
      
      {/* Hair */}
      {avatarOptions.topType.includes('Hair') && (
        <Box sx={{
          position: 'absolute',
          top: avatarOptions.topType.includes('Long') ? '10%' : '5%',
          left: '10%',
          width: '80%',
          height: avatarOptions.topType.includes('Long') ? '60%' : '40%',
          borderTopLeftRadius: '50%',
          borderTopRightRadius: '50%',
          backgroundColor: hairColor,
          zIndex: 2
        }} />
      )}
      
      {/* Hat */}
      {avatarOptions.topType.includes('Hat') && (
        <Box sx={{
          position: 'absolute',
          top: '0%',
          left: '10%',
          width: '80%',
          height: '30%',
          borderTopLeftRadius: '50%',
          borderTopRightRadius: '50%',
          backgroundColor: clothesColor,
          zIndex: 2
        }} />
      )}
      
      {/* Eyes */}
      <Box sx={{
        position: 'absolute',
        top: '40%',
        left: '30%',
        width: '10%',
        height: '10%',
        borderRadius: '50%',
        backgroundColor: '#000',
        zIndex: 3
      }} />
      <Box sx={{
        position: 'absolute',
        top: '40%',
        right: '30%',
        width: '10%',
        height: '10%',
        borderRadius: '50%',
        backgroundColor: '#000',
        zIndex: 3
      }} />
      
      {/* Mouth */}
      <Box sx={{
        position: 'absolute',
        bottom: '25%',
        left: '35%',
        width: '30%',
        height: '5%',
        backgroundColor: avatarOptions.mouthType === 'Smile' ? 'transparent' : '#000',
        borderBottomLeftRadius: '50%',
        borderBottomRightRadius: '50%',
        borderBottom: avatarOptions.mouthType === 'Smile' ? '2px solid #000' : 'none',
        zIndex: 3
      }} />
      
      {/* Accessories - Glasses */}
      {avatarOptions.accessoriesType.includes('glass') && (
        <>
          <Box sx={{
            position: 'absolute',
            top: '38%',
            left: '25%',
            width: '15%',
            height: '15%',
            border: '2px solid #000',
            borderRadius: '50%',
            zIndex: 4
          }} />
          <Box sx={{
            position: 'absolute',
            top: '38%',
            right: '25%',
            width: '15%',
            height: '15%',
            border: '2px solid #000',
            borderRadius: '50%',
            zIndex: 4
          }} />
          <Box sx={{
            position: 'absolute',
            top: '45%',
            left: '40%',
            width: '20%',
            height: '1%',
            backgroundColor: '#000',
            zIndex: 4
          }} />
        </>
      )}
      
      {/* Facial Hair */}
      {avatarOptions.facialHairType !== 'None' && (
        <Box sx={{
          position: 'absolute',
          bottom: '20%',
          left: '25%',
          width: '50%',
          height: avatarOptions.facialHairType.includes('Beard') ? '15%' : '5%',
          backgroundColor: getHairColorHex(avatarOptions.facialHairColor),
          borderBottomLeftRadius: '50%',
          borderBottomRightRadius: '50%',
          zIndex: 3
        }} />
      )}
      
      {/* Clothes */}
      <Box sx={{
        position: 'absolute',
        bottom: '-10%',
        left: '0%',
        width: '100%',
        height: '30%',
        backgroundColor: clothesColor,
        zIndex: 0
      }} />
    </Box>
  );
};

export default SimpleAvatarDisplay;
