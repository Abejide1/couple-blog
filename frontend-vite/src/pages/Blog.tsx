import React, { useState, useEffect } from 'react';
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
import { blogApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Blog = () => {
    const [entries, setEntries] = useState<BlogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [newEntry, setNewEntry] = useState({
        title: '',
        content: '',
        author: ''
    });

    const fetchEntries = async () => {
        try {
            const response = await blogApi.getAll();
            setEntries(response.data);
        } catch (error) {
            console.error('Error fetching blog entries:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleSubmit = async () => {
        try {
            await blogApi.create(newEntry);
            setOpen(false);
            setNewEntry({ title: '', content: '', author: '' });
            fetchEntries();
        } catch (error) {
            console.error('Error creating blog entry:', error);
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

            <Grid container spacing={3}>
                {entries.map((entry) => (
                    <Grid key={entry.id} sx={{ gridColumn: '1 / -1' }}>
                        <Paper elevation={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        {entry.title}
                                    </Typography>
                                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                        Written by {entry.author} on {new Date(entry.created_at).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                                        {entry.content}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

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
