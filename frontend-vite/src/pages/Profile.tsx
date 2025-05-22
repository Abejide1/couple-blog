import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Alert, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaSmile, FaMeh, FaLaugh, FaSadTear, FaAngry, FaHeart } from 'react-icons/fa';
import CustomAvatar from '../components/CustomAvatar';

// Avatar creation options
const faceColors = ['#FFD6E8', '#F8E9D6', '#E3D6C5', '#C4A88F', '#8D6E63', '#5D4037', '#6A74C9', '#A6D3FF'];
const hairStyles = ['short', 'medium', 'long', 'bald', 'curly', 'wavy'];
const hairColors = ['#000000', '#6D4C41', '#FFC107', '#FF5722', '#9C27B0', '#E91E63', '#607D8B', '#FFFFFF'];
const expressions = ['smile', 'laugh', 'meh', 'sad', 'angry', 'love'];
const accessories = ['none', 'glasses', 'hat', 'earrings'];

const Profile: React.FC = () => {
  const { user, token, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);
  
  // Avatar customization state
  // Load from localStorage or use defaults
  const [faceColor, setFaceColor] = useState(faceColors[0]);
  const [hairStyle, setHairStyle] = useState(hairStyles[0]);
  const [hairColor, setHairColor] = useState(hairColors[0]);
  const [expression, setExpression] = useState(expressions[0]);
  const [accessory, setAccessory] = useState(accessories[0]);
  
  // Load saved avatar from localStorage on component mount
  useEffect(() => {
    try {
      const savedAvatar = localStorage.getItem('userAvatar');
      if (savedAvatar) {
        const avatarData = JSON.parse(savedAvatar);
        setFaceColor(avatarData.faceColor || faceColors[0]);
        setHairStyle(avatarData.hairStyle || hairStyles[0]);
        setHairColor(avatarData.hairColor || hairColors[0]);
        setExpression(avatarData.expression || expressions[0]);
        setAccessory(avatarData.accessory || accessories[0]);
      }
    } catch (err) {
      console.log('Error loading avatar from localStorage', err);
    }
  }, []);
  
  const navigate = useNavigate();

  if (!user) return null;

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await updateProfile({ display_name: displayName });
      setSuccess('Profile updated!');
      setTimeout(() => {
        navigate('/activities');
      }, 800); // short delay so user sees success
    } catch (err: any) {
      setError('Update failed');
    }
    setLoading(false);
  };

  // Save avatar settings to local storage and update profile
  const handleSaveAvatar = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Create an object with the avatar settings
      const avatarData = {
        faceColor,
        hairStyle,
        hairColor,
        expression,
        accessory
      };
      
      // Remove any temporary preview
      localStorage.removeItem('tempAvatarPreview');
      
      // Save avatar data to local storage for persistence
      localStorage.setItem('userAvatar', JSON.stringify(avatarData));
      
      // Only update the profile displayName - avatar is stored in localStorage only
      if (token) {
        try {
          // Only update the display name - we're storing avatar separately in localStorage
          await updateProfile({ display_name: displayName });
        } catch (apiError) {
          console.log('Profile update failed');
        }
      }
      
      setSuccess('Avatar updated!');
      setShowAvatarCreator(false);
    } catch (err: any) {
      setError('Failed to update avatar');
      console.error(err);
    }
    setLoading(false);
  };

  // Render the avatar preview using the CustomAvatar component
  const renderAvatarPreview = () => {
    // Create a temporary avatar data object based on current selections
    const previewAvatarData = {
      faceColor,
      hairStyle,
      hairColor,
      expression,
      accessory
    };
    
    // Temporarily store in localStorage so CustomAvatar can use it
    localStorage.setItem('tempAvatarPreview', JSON.stringify(previewAvatarData));
    
    // Return the CustomAvatar component with a larger size for the preview
    return (
      <Box sx={{ mt: 2, mb: 4 }}>
        <Box 
          sx={{
            width: 120,
            height: 120,
            margin: '0 auto',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -5,
              left: -5,
              right: -5,
              bottom: -5,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #FF7EB9, #B388FF)',
              zIndex: -1
            }
          }}
        >
          <CustomAvatar size={120} />
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 600, mx: 'auto', fontFamily: 'inherit', mt: 4 }}>
      <Box 
        sx={{
          bgcolor: '#FFF6FB',
          borderRadius: '32px',
          boxShadow: '0 2px 12px #FFD6E8',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 3, color: '#FF7EB9', fontWeight: 700 }}>
          My Profile
        </Typography>
        
        {/* Current avatar display */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 4, 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(to bottom, #fff6fb, #fff)',
            width: '100%',
            maxWidth: 500
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 2, color: '#666' }}>
            Your Current Avatar
          </Typography>
          <Box sx={{ mb: 2 }}>
            <CustomAvatar size={100} displayText={user?.display_name?.charAt(0) || 'U'} />
          </Box>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => setShowAvatarCreator(!showAvatarCreator)}
            sx={{ borderRadius: 8, px: 3, boxShadow: '0 4px 12px rgba(179, 136, 255, 0.3)' }}
          >
            {showAvatarCreator ? 'Hide Avatar Creator' : 'Customize Avatar'}
          </Button>
        </Paper>
        
        {/* Avatar Creator */}
        {showAvatarCreator && (
          <Box sx={{ width: '100%', mb: 4 }}>
            <Paper elevation={3} sx={{ mb: 4, p: 3, borderRadius: 4, bgcolor: '#F8F8FF', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', color: '#FF7EB9', fontWeight: 700 }}>
                Avatar Creator
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                {renderAvatarPreview()}
              </Box>
              
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#FF7EB9', mb: 1 }}>Face Color</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mb: 2 }}>
                {faceColors.map((color) => (
                  <Box 
                    key={color}
                    onClick={() => setFaceColor(color)}
                    sx={{
                      width: 30, 
                      height: 30, 
                      borderRadius: '50%', 
                      backgroundColor: color,
                      border: faceColor === color ? '3px solid #FF7EB9' : '2px solid #FFF',
                      cursor: 'pointer',
                      boxShadow: faceColor === color ? '0 0 8px #FF7EB9' : 'none'
                    }}
                  />
                ))}
              </Box>

              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#FF7EB9', mb: 1, mt: 2 }}>Hair Style</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mb: 2 }}>
                {hairStyles.map((style) => (
                  <Button
                    key={style}
                    variant={hairStyle === style ? 'contained' : 'outlined'}
                    color="secondary"
                    onClick={() => setHairStyle(style)}
                    sx={{ borderRadius: 4, minWidth: 'auto', px: 2 }}
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </Button>
                ))}
              </Box>

              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#FF7EB9', mb: 1, mt: 2 }}>Hair Color</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mb: 2 }}>
                {hairColors.map((color) => (
                  <Box 
                    key={color}
                    onClick={() => setHairColor(color)}
                    sx={{
                      width: 30, 
                      height: 30, 
                      borderRadius: '50%', 
                      backgroundColor: color,
                      border: hairColor === color ? '3px solid #FF7EB9' : '2px solid #FFF',
                      cursor: 'pointer',
                      boxShadow: hairColor === color ? '0 0 8px #FF7EB9' : 'none'
                    }}
                  />
                ))}
              </Box>

              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#FF7EB9', mb: 1, mt: 2 }}>Expression</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mb: 2 }}>
                {expressions.map((expr) => (
                  <Button
                    key={expr}
                    variant={expression === expr ? 'contained' : 'outlined'}
                    color="secondary"
                    onClick={() => setExpression(expr)}
                    sx={{ borderRadius: 4, minWidth: 'auto', px: 2 }}
                  >
                    {expr.charAt(0).toUpperCase() + expr.slice(1)}
                  </Button>
                ))}
              </Box>

              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#FF7EB9', mb: 1, mt: 2 }}>Accessories</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mb: 2 }}>
                {accessories.map((acc) => (
                  <Button
                    key={acc}
                    variant={accessory === acc ? 'contained' : 'outlined'}
                    color="secondary"
                    onClick={() => setAccessory(acc)}
                    sx={{ borderRadius: 4, minWidth: 'auto', px: 2 }}
                  >
                    {acc.charAt(0).toUpperCase() + acc.slice(1)}
                  </Button>
                ))}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveAvatar}
                  sx={{ borderRadius: 8, fontWeight: 700, px: 4, py: 1.2 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Avatar'}
                </Button>
              </Box>
            </Paper>
          </Box>
        )}
        
        <form onSubmit={handleProfileUpdate}>
          <TextField
            label="Display Name"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            value={user.email}
            fullWidth
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            label="Couple Code"
            value={user.couple_code || ''}
            fullWidth
            disabled
            sx={{ mb: 2 }}
          />
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={loading}
            sx={{ borderRadius: 8, fontWeight: 700, fontSize: '1.1rem', mb: 1 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Profile;
