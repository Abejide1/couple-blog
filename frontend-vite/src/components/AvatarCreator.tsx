import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

// Define avatar data structure
export interface AvatarData {
  shape: string;
  bgColor: string;
  fgColor: string;
  topType: string;
  accessory: string;
  facialFeature: string;
}

interface AvatarCreatorProps {
  initialData?: AvatarData;
  onSave: (data: AvatarData) => void;
  onCancel?: () => void;
  size?: number;
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

// Styled components for selectable items
const ColorOption = styled(Box)({
  width: 30,
  height: 30,
  borderRadius: '50%',
  cursor: 'pointer',
  margin: '0 4px',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: '0 0 8px rgba(0,0,0,0.3)'
  }
});

const OptionButton = styled(Button)({
  minWidth: 'auto',
  margin: '0 4px',
  borderRadius: 20,
  textTransform: 'none',
  padding: '4px 12px',
  fontSize: '0.85rem'
});

// Avatar options
const bgColors = [
  '#FFD6E8', // Pink
  '#D4F0F0', // Light Teal
  '#FFF2CC', // Light Yellow
  '#FFE4C4', // Bisque
  '#E6E6FA', // Lavender
  '#98FB98', // Pale Green
  '#ADD8E6', // Light Blue
  '#FFC0CB', // Pink
  '#DCDCDC', // Gainsboro
  '#FFFACD'  // Lemon Chiffon
];

const fgColors = [
  '#FF7EB9', // Pink
  '#2E86C1', // Blue
  '#F39C12', // Orange
  '#2ECC71', // Green
  '#9B59B6', // Purple
  '#E74C3C', // Red
  '#34495E', // Dark Gray
  '#16A085', // Teal
  '#D35400', // Dark Orange
  '#7D3C98'  // Dark Purple
];

const shapes = ['circle', 'rounded', 'square'];
const topTypes = ['shortHair', 'longHair', 'hat', 'beanie', 'none'];
const accessories = ['none', 'glasses', 'sunglasses', 'earrings'];
const facialFeatures = ['smile', 'laugh', 'surprised', 'serious', 'wink'];

const AvatarCreator: React.FC<AvatarCreatorProps> = ({
  initialData,
  onSave,
  onCancel,
  size = 150
}) => {
  // Initialize with provided data or defaults
  const [avatarData, setAvatarData] = useState<AvatarData>(initialData || defaultAvatar);
  
  // Initialize with data from localStorage if available
  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar && !initialData) {
      try {
        setAvatarData(JSON.parse(savedAvatar));
      } catch (err) {
        console.error('Error parsing saved avatar data', err);
      }
    }
  }, [initialData]);

  // Update avatar data when any property changes
  const handleChange = (key: keyof AvatarData, value: string) => {
    setAvatarData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Save changes and call the onSave callback
  const handleSave = () => {
    localStorage.setItem('userAvatar', JSON.stringify(avatarData));
    onSave(avatarData);
  };

  // Avatar preview component that displays the current configuration
  const AvatarPreview = () => {
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
    
    return (
      <Box sx={{
        position: 'relative',
        width: size,
        height: size,
        backgroundColor: avatarData.bgColor,
        borderRadius: getBorderRadius(),
        margin: '0 auto',
        overflow: 'hidden',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }}>
        {getTopElement()}
        <Eyes />
        {getFacialFeature()}
        {getAccessory()}
      </Box>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 4, maxWidth: 550, margin: '0 auto' }}>
      <Typography variant="h6" align="center" sx={{ mb: 3, color: '#FF7EB9', fontWeight: 700 }}>
        Create Your Avatar
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <AvatarPreview />
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Shape Selection */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Shape
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {shapes.map(shape => (
              <Tooltip key={shape} title={shape.charAt(0).toUpperCase() + shape.slice(1)}>
                <OptionButton
                  variant={avatarData.shape === shape ? 'contained' : 'outlined'}
                  color="secondary"
                  onClick={() => handleChange('shape', shape)}
                >
                  {shape.charAt(0).toUpperCase() + shape.slice(1)}
                </OptionButton>
              </Tooltip>
            ))}
          </Box>
        </Box>
        
        {/* Background Color Selection */}
        <Box sx={{ width: { xs: '100%', sm: '48%' }, display: 'inline-block', verticalAlign: 'top', mr: { sm: 1 } }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Background Color
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {bgColors.map(color => (
              <Tooltip key={color} title={color}>
                <ColorOption 
                  sx={{
                    backgroundColor: color,
                    border: avatarData.bgColor === color ? '3px solid #FF7EB9' : '2px solid transparent',
                    transform: avatarData.bgColor === color ? 'scale(1.1)' : 'scale(1)'
                  }}
                  onClick={() => handleChange('bgColor', color)}
                />
              </Tooltip>
            ))}
          </Box>
        </Box>
        
        {/* Foreground Color Selection */}
        <Box sx={{ width: { xs: '100%', sm: '48%' }, display: 'inline-block', verticalAlign: 'top', ml: { sm: 1 } }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Feature Color
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {fgColors.map(color => (
              <Tooltip key={color} title={color}>
                <ColorOption 
                  sx={{
                    backgroundColor: color,
                    border: avatarData.fgColor === color ? '3px solid #FF7EB9' : '2px solid transparent',
                    transform: avatarData.fgColor === color ? 'scale(1.1)' : 'scale(1)'
                  }}
                  onClick={() => handleChange('fgColor', color)}
                />
              </Tooltip>
            ))}
          </Box>
        </Box>
        
        {/* Top Type Selection */}
        <Box sx={{ width: { xs: '100%', sm: '48%' }, display: 'inline-block', verticalAlign: 'top', mr: { sm: 1 } }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Top Style
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {topTypes.map(type => (
              <OptionButton
                key={type}
                variant={avatarData.topType === type ? 'contained' : 'outlined'}
                color="secondary"
                onClick={() => handleChange('topType', type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1')}
              </OptionButton>
            ))}
          </Box>
        </Box>
        
        {/* Accessories Selection */}
        <Box sx={{ width: { xs: '100%', sm: '48%' }, display: 'inline-block', verticalAlign: 'top', ml: { sm: 1 } }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Accessories
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {accessories.map(acc => (
              <OptionButton
                key={acc}
                variant={avatarData.accessory === acc ? 'contained' : 'outlined'}
                color="secondary"
                onClick={() => handleChange('accessory', acc)}
              >
                {acc.charAt(0).toUpperCase() + acc.slice(1)}
              </OptionButton>
            ))}
          </Box>
        </Box>
        
        {/* Facial Features Selection */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Expression
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {facialFeatures.map(feature => (
              <OptionButton
                key={feature}
                variant={avatarData.facialFeature === feature ? 'contained' : 'outlined'}
                color="secondary"
                onClick={() => handleChange('facialFeature', feature)}
              >
                {feature.charAt(0).toUpperCase() + feature.slice(1)}
              </OptionButton>
            ))}
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
        {onCancel && (
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={onCancel}
            sx={{ borderRadius: 8, px: 3 }}
          >
            Cancel
          </Button>
        )}
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleSave}
          sx={{ borderRadius: 8, px: 4, py: 1 }}
        >
          Save Avatar
        </Button>
      </Box>
    </Paper>
  );
};

export default AvatarCreator;
