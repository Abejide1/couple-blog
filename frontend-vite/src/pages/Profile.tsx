import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Alert, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import SimpleAvatarDisplay from '../components/SimpleAvatarDisplay';
import CustomizableAvatar, { AvatarOptions } from '../components/CustomizableAvatar';

// Custom avatar options handled by our own CSS-based avatar components

const Profile: React.FC = () => {
  const { user, token, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);
  
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

  // Handle avatar save from the CustomizableAvatar component
  const handleSaveAvatar = async (_avatarOptions: AvatarOptions) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Avatar data is automatically saved to localStorage by the AvatarCreator component
      
      // Update profile name if needed
      if (token) {
        try {
          // Only update the display name - avatar is stored separately in localStorage
          await updateProfile({ display_name: displayName });
        } catch (apiError) {
          console.error('Profile update failed', apiError);
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
          <Box sx={{ mb: 2, position: 'relative' }}>
            <Box 
              sx={{
                width: 100,
                height: 100,
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
              <SimpleAvatarDisplay size={100} displayText={user?.display_name?.charAt(0) || 'U'} />
            </Box>
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
        
        {/* Custom Avatar Creator */}
        {showAvatarCreator && (
          <Box sx={{ width: '100%', mb: 4 }}>
            <CustomizableAvatar
              onSave={handleSaveAvatar} 
              onCancel={() => setShowAvatarCreator(false)}
              size={200}
            />
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
