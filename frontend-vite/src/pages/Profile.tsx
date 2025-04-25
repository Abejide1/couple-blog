import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Avatar, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Profile: React.FC = () => {
  const { user, token, updateProfile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await updateProfile({ display_name: displayName });
      setSuccess('Profile updated!');
    } catch (err: any) {
      setError('Update failed');
    }
    setLoading(false);
  };

  const handlePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !token) return;
    setLoading(true);
    setError('');
    setSuccess('');
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post(`${API_URL}/user/profile/picture`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setProfilePic(null);
      setSuccess('Profile picture updated!');
      await refreshProfile();
    } catch (err: any) {
      setError('Failed to upload profile picture');
    }
    setLoading(false);
  };

  return (
    <Box maxWidth={420} mx="auto" mt={8}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 6, boxShadow: '0 4px 24px #FFD6E8' }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar
            src={user.profile_pic ? `${API_URL}/${user.profile_pic}` : undefined}
            sx={{ width: 90, height: 90, mb: 2, bgcolor: '#FFD6E8', fontSize: 40 }}
          >
            {user.display_name?.charAt(0) || user.email.charAt(0)}
          </Avatar>
          <Button variant="outlined" component="label" sx={{ borderRadius: 8, fontWeight: 700, mb: 2 }}>
            Change Picture
            <input type="file" accept="image/*" hidden onChange={handlePicUpload} />
          </Button>
        </Box>
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
      </Paper>
    </Box>
  );
};

export default Profile;
