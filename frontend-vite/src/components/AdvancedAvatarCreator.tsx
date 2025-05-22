import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Tabs, Tab, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import Avatar from 'avataaars';

// Avatar options
const topTypes = [
  'NoHair',
  'Eyepatch',
  'Hat',
  'Hijab',
  'Turban',
  'WinterHat1',
  'WinterHat2',
  'WinterHat3',
  'WinterHat4',
  'LongHairBigHair',
  'LongHairBob',
  'LongHairBun',
  'LongHairCurly',
  'LongHairCurvy',
  'LongHairDreads',
  'LongHairFrida',
  'LongHairFro',
  'LongHairFroBand',
  'LongHairNotTooLong',
  'LongHairShavedSides',
  'LongHairMiaWallace',
  'LongHairStraight',
  'LongHairStraight2',
  'LongHairStraightStrand',
  'ShortHairDreads01',
  'ShortHairDreads02',
  'ShortHairFrizzle',
  'ShortHairShaggyMullet',
  'ShortHairShortCurly',
  'ShortHairShortFlat',
  'ShortHairShortRound',
  'ShortHairShortWaved',
  'ShortHairSides',
  'ShortHairTheCaesar',
  'ShortHairTheCaesarSidePart'
];

const accessoriesTypes = [
  'Blank',
  'Kurt',
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
  'Blank',
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
  'Twinkle',
  'Vomit'
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
export interface AvataaarsOptions {
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

interface AdvancedAvatarCreatorProps {
  initialOptions?: AvataaarsOptions;
  onSave: (options: AvataaarsOptions) => void;
  onCancel?: () => void;
  size?: number;
}

// Default avatar configuration
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

// Helper function to format option text for display
const formatOptionText = (option: string): string => {
  // Replace capital letter with space + lowercase letter (except first letter)
  return option.replace(/([A-Z])/g, ' $1')
    // Handle special cases
    .replace(/([0-9]+)/g, ' $1')
    // Capitalize first letter
    .replace(/^./, (str) => str.toUpperCase());
};

const AdvancedAvatarCreator: React.FC<AdvancedAvatarCreatorProps> = ({
  initialOptions,
  onSave,
  onCancel,
  size = 200
}) => {
  // Initialize with provided data or defaults
  const [avatarOptions, setAvatarOptions] = useState<AvataaarsOptions>(
    initialOptions || defaultAvatarOptions
  );
  
  // Initialize with data from localStorage if available
  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatarOptions');
    if (savedAvatar && !initialOptions) {
      try {
        setAvatarOptions(JSON.parse(savedAvatar));
      } catch (err) {
        console.error('Error parsing saved avatar data', err);
      }
    }
  }, [initialOptions]);

  // Tab state for option categories
  const [tabValue, setTabValue] = useState(0);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Update avatar options when any property changes
  const handleChange = (name: keyof AvataaarsOptions, value: string) => {
    setAvatarOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save changes and call the onSave callback
  const handleSave = () => {
    localStorage.setItem('userAvatarOptions', JSON.stringify(avatarOptions));
    onSave(avatarOptions);
  };

  // Render a selection dropdown for a particular avatar feature
  const renderDropdown = (label: string, name: keyof AvataaarsOptions, options: string[]) => {
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
    <Paper elevation={3} sx={{ p: 3, borderRadius: 4, maxWidth: 550, margin: '0 auto' }}>
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

export default AdvancedAvatarCreator;
