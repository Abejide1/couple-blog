import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import {
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Paper
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { BlogEntry } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import MoodPicker from '../components/MoodPicker';
import ActivityGallery from '../components/ActivityGallery';

const Blog = () => {
    const [entries, setEntries] = useState<BlogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [newEntry, setNewEntry] = useState({
        title: '',
        content: '',
        author: '',
        mood: '',
        photo: null as File | null
    });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogEntries = async () => {
            setLoading(true);
            try {
                const response = await api.get('/blog-entries/');
                setEntries(response.data);
            } catch (error) {
                console.error('Error fetching blog entries:', error);
                setEntries([
                    { id: 1, title: 'Our First Vacation', content: 'It was amazing!', createdAt: '2023-05-15' },
                    { id: 2, title: 'Anniversary Celebration', content: 'One year together!', createdAt: '2023-06-22' }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogEntries();
    }, []);

    const handleSubmit = async () => {
        if (!newEntry.title || !newEntry.content) return;

        setSubmitLoading(true);
        setErrorMsg(null);

        try {
            // We follow the user's preference for avatar-based profiles
            // instead of photo uploads, so we don't handle photo uploads here
            let photoPath = '';
            
            // Use our configured API with proper iOS support
            await api.post('/blog-entries/', { ...newEntry, photo: photoPath });

            // Refetch blog entries
            const response = await api.get('/blog-entries/');
            setEntries(response.data);

            // Reset form and close dialog
            setNewEntry({
                title: '',
                content: '',
                author: '',
                mood: '',
                photo: null
            });
            setOpen(false);
        } catch (error) {
            console.error('Error saving blog entry:', error);
            setErrorMsg('Failed to save blog entry. Please try again.');
            
            // Add locally if API fails (offline mode)
            const localEntry = {
                id: Date.now(),
                title: newEntry.title,
                content: newEntry.content,
                author: newEntry.author || 'Me',
                createdAt: new Date().toISOString()
            };
            setEntries(prev => [...prev, localEntry]);
            setNewEntry({
                title: '',
                content: '',
                author: '',
                mood: '',
                photo: null
            });
            setOpen(false);
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Blog</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                >
                    New Entry
                </Button>
            </Box>

            <Box sx={{
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: { xs: 2, sm: 3 },
  width: '100%',
  mt: 2,
}}>
  {entries.map((entry) => (
    <Box
      key={entry.id}
      sx={{
        width: { xs: 170, sm: 220 },
        height: { xs: 170, sm: 220 },
        bgcolor: '#FFF6FB',
        borderRadius: '50%',
        boxShadow: '0 2px 12px #FFD6E8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        m: 1,
        flex: '0 0 auto',
        p: 2,
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" fontWeight={700} sx={{ color: '#B388FF', mb: 1, fontSize: { xs: '1rem', sm: '1.15rem' } }}>
        {entry.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
        by {entry.author}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>{new Date(entry.created_at).toLocaleDateString()}</Typography>
      {entry.mood && <Typography variant="body2" sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem' }, mb: 1 }}>{entry.mood}</Typography>}
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.95rem' }, mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: 48 }}>{entry.content}</Typography>
      {/* Blog Gallery (reuse ActivityGallery with blogEntryId) */}
      <ActivityGallery blogEntryId={entry.id} />
    </Box>
  ))}
</Box>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>New Blog Entry</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={newEntry.title}
                        onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Author"
                        fullWidth
                        value={newEntry.author}
                        onChange={(e) => setNewEntry({ ...newEntry, author: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Content"
                        fullWidth
                        multiline
                        rows={8}
                        value={newEntry.content}
                        onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                    />
                    {/* Mood Picker */}
                    <MoodPicker value={newEntry.mood} onChange={(mood) => setNewEntry({ ...newEntry, mood })} />
                    {/* Photo Upload */}
                    <Button
                        variant="outlined"
                        component="label"
                        sx={{ mt: 2, mb: 1 }}
                    >
                        Upload Photo
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={e => {
                                if (e.target.files && e.target.files[0]) {
                                    setNewEntry({ ...newEntry, photo: e.target.files[0] });
                                }
                            }}
                        />
                    </Button>
                    {newEntry.photo && (
                        <Typography variant="body2" color="textSecondary">{newEntry.photo.name}</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">Publish</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Blog;
