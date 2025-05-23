import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Paper, Tabs, Tab, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { isIOS } from '../utils/mobileUtils';
import { setupIOSTouchHandlers, setupIOSScrolling, optimizeAvatarForIOS } from '../utils/iOSAvatarUtils';

// Avatar options
const topTypes = [
  'NoHair',
  'EyePatch',
  'Hat',
  'Hijab',
  'Turban',
  'WinterHat',
  'LongHairBig',
  'LongHairBob',
  'LongHairBun',
  'LongHairCurly',
  'LongHairCurvy',
  'LongHairDreads',
  'LongHairFrida',
  'LongHairFro',
  'LongHairNotTooLong',
  'LongHairShavedSides',
  'LongHairStraight',
  'ShortHairDreads',
  'ShortHairFrizzle',
  'ShortHairShaggy',
  'ShortHairCurly',
  'ShortHairFlat',
  'ShortHairRound',
  'ShortHairWaved',
  'ShortHairSides',
  'ShortHairCaesar'
];

const accessoriesTypes = [
  'None',
  'Prescription01',
  'Prescription02',
  'Round',
  'Sunglasses',
  'Wayfarers'
];

const hairColors = [
  'Auburn',
  'Black',
  'Blonde',
  'BlondeGolden',
  'Brown',
  'BrownDark',
  'PastelPink',
  'Platinum',
  'Red',
  'SilverGray'
];

const facialHairTypes = [
  'None',
  'BeardMedium',
  'BeardLight',
  'BeardMajestic',
  'MoustacheFancy',
  'MoustacheMagnum'
];

const facialHairColors = [
  'Auburn',
  'Black',
  'Blonde',
  'BlondeGolden',
  'Brown',
  'BrownDark',
  'Platinum',
  'Red'
];

const clotheTypes = [
  'BlazerShirt',
  'BlazerSweater',
  'CollarSweater',
  'GraphicShirt',
  'Hoodie',
  'Overall',
  'ShirtCrewNeck',
  'ShirtScoopNeck',
  'ShirtVNeck'
];

const clotheColors = [
  'Black',
  'Blue01',
  'Blue02',
  'Blue03',
  'Gray01',
  'Gray02',
  'Heather',
  'PastelBlue',
  'PastelGreen',
  'PastelOrange',
  'PastelRed',
  'PastelYellow',
  'Pink',
  'Red',
  'White'
];

const eyeTypes = [
  'Close',
  'Cry',
  'Default',
  'Dizzy',
  'EyeRoll',
  'Happy',
  'Hearts',
  'Side',
  'Squint',
  'Surprised',
  'Wink',
  'WinkWacky'
];

const eyebrowTypes = [
  'Angry',
  'AngryNatural',
  'Default',
  'DefaultNatural',
  'FlatNatural',
  'RaisedExcited',
  'RaisedExcitedNatural',
  'SadConcerned',
  'SadConcernedNatural',
  'UnibrowNatural',
  'UpDown',
  'UpDownNatural'
];

const mouthTypes = [
  'Concerned',
  'Default',
  'Disbelief',
  'Eating',
  'Grimace',
  'Sad',
  'ScreamOpen',
  'Serious',
  'Smile',
  'Tongue',
  'Twinkle'
];

const skinColors = [
  'Tanned',
  'Yellow',
  'Pale',
  'Light',
  'Brown',
  'DarkBrown',
  'Black'
];

// Define avatar data structure
export interface AvatarOptions {
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

interface CustomizableAvatarProps {
  initialOptions?: AvatarOptions;
  onSave: (options: AvatarOptions) => void;
  onCancel?: () => void;
  size?: number;
}

// Default avatar configuration
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

// Helper function to format option text for display
const formatOptionText = (option: string): string => {
  // Replace capital letter with space + lowercase letter (except first letter)
  return option.replace(/([A-Z])/g, ' $1')
    // Handle special cases
    .replace(/([0-9]+)/g, ' $1')
    // Capitalize first letter
    .replace(/^./, (str) => str.toUpperCase());
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

const CustomizableAvatar: React.FC<CustomizableAvatarProps> = ({
  initialOptions,
  onSave,
  onCancel,
  size = 200
}) => {
  // Container ref for iOS-specific optimizations
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Initialize with provided data or defaults
  const [avatarOptions, setAvatarOptions] = useState<AvatarOptions>(
    initialOptions || defaultAvatarOptions
  );
  
  // Check if running on iOS
  const isiOSDevice = isIOS();
  
  // Initialize with data from our storage system
  useEffect(() => {
    const loadSavedAvatar = async () => {
      if (initialOptions) {
        // Use provided options if available
        setAvatarOptions(initialOptions);
        return;
      }
      
      try {
        // Import dynamically to avoid circular dependencies
        const { getAvatarData } = await import('../utils/storageManager');
        const savedAvatar = await getAvatarData();
        
        if (savedAvatar) {
          // Apply any iOS-specific optimizations if needed
          setAvatarOptions(isiOSDevice ? optimizeAvatarForIOS(savedAvatar) : savedAvatar);
        }
      } catch (err) {
        console.error('Error loading saved avatar data', err);
      }
    };
    
    loadSavedAvatar();
  }, [initialOptions, isiOSDevice]);
  
  // Apply iOS-specific optimizations
  useEffect(() => {
    if (isiOSDevice && containerRef.current) {
      // Set up iOS-specific touch and scrolling optimizations
      setupIOSTouchHandlers(containerRef.current);
      setupIOSScrolling(containerRef.current);
    }
  }, [isiOSDevice]);

  // Tab state for option categories
  const [tabValue, setTabValue] = useState(0);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Update avatar options when any property changes
  const handleChange = (name: keyof AvatarOptions, value: string) => {
    setAvatarOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save changes and call the onSave callback
  const handleSave = async () => {
    try {
      // Import dynamically to avoid circular dependencies
      const { saveAvatarData } = await import('../utils/storageManager');
      
      // Save avatar data using our storage system (works on both web and iOS)
      await saveAvatarData(avatarOptions);
      
      // Call the provided onSave callback
      onSave(avatarOptions);
    } catch (err) {
      console.error('Error saving avatar data', err);
      // Fallback to direct localStorage if our system fails
      localStorage.setItem('userAvatarOptions', JSON.stringify(avatarOptions));
      onSave(avatarOptions);
    }
  };

  // Render a selection dropdown for a particular avatar feature
  const renderDropdown = (label: string, name: keyof AvatarOptions, options: string[]) => {
    return (
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id={`${name}-label`}>{label}</InputLabel>
        <Select
          labelId={`${name}-label`}
          id={name}
          value={avatarOptions[name]}
          label={label}
          onChange={(e: SelectChangeEvent) => handleChange(name, e.target.value)}
        >
          {options.map(option => (
            <MenuItem key={option} value={option}>
              {formatOptionText(option)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  // Simple avatar renderer using CSS
  const AvatarPreview = () => {
    const skinColor = getSkinColorHex(avatarOptions.skinColor);
    const hairColor = getHairColorHex(avatarOptions.hairColor);
    const clothesColor = getClothesColorHex(avatarOptions.clotheColor);
    
    return (
      <Box sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#f0f0f0',
        position: 'relative',
        overflow: 'hidden'
      }}>
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

  // Content for each tab
  const renderTabContent = () => {
    switch (tabValue) {
      case 0: // Hair & Accessories
        return (
          <Box sx={{ p: 2 }}>
            {renderDropdown('Hair Style', 'topType', topTypes)}
            {renderDropdown('Hair Color', 'hairColor', hairColors)}
            {renderDropdown('Accessories', 'accessoriesType', accessoriesTypes)}
          </Box>
        );
      case 1: // Face
        return (
          <Box sx={{ p: 2 }}>
            {renderDropdown('Skin Color', 'skinColor', skinColors)}
            {renderDropdown('Eyes', 'eyeType', eyeTypes)}
            {renderDropdown('Eyebrows', 'eyebrowType', eyebrowTypes)}
            {renderDropdown('Mouth', 'mouthType', mouthTypes)}
          </Box>
        );
      case 2: // Facial Hair & Clothes
        return (
          <Box sx={{ p: 2 }}>
            {renderDropdown('Facial Hair', 'facialHairType', facialHairTypes)}
            {renderDropdown('Facial Hair Color', 'facialHairColor', facialHairColors)}
            {renderDropdown('Clothes', 'clotheType', clotheTypes)}
            {renderDropdown('Clothes Color', 'clotheColor', clotheColors)}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Paper 
      elevation={3} 
      ref={containerRef}
      sx={{ 
        p: 3, 
        borderRadius: 4, 
        maxWidth: 550, 
        margin: '0 auto',
        // iOS-specific styling
        ...(isiOSDevice && {
          overflow: 'hidden',
          WebkitOverflowScrolling: 'touch',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        })
      }}
    >
      <Typography variant="h6" align="center" sx={{ mb: 3, color: '#FF7EB9', fontWeight: 700 }}>
        Create Your Avatar
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Box sx={{ 
          width: size, 
          height: size, 
          borderRadius: '50%', 
          overflow: 'hidden',
          backgroundColor: '#f8f8f8',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}>
          <AvatarPreview />
        </Box>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab label="Hair & Accessories" />
          <Tab label="Face Features" />
          <Tab label="Clothing & More" />
        </Tabs>
      </Box>
      
      {renderTabContent()}
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 2 }}>
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

export default CustomizableAvatar;
