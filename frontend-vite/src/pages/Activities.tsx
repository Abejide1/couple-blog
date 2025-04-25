import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Snackbar,
    Alert,
    Chip,
    Tooltip,
    Divider,
    CircularProgress,
    Card,
    CardContent,
    Grid
} from '@mui/material';
import { FaHeart, FaStar, FaRegSmileBeam, FaRegCheckCircle, FaEdit, FaTrash, FaMagic, FaHiking, FaMusic, FaUtensils, FaCamera, FaGamepad, FaPlane, FaBook, FaFilm, FaCampground, FaGift, FaUmbrellaBeach } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';
import { TrendingUp, CheckCircle, Schedule, Category as CategoryIcon, Timer, Add as AddIcon } from '@mui/icons-material';
import { Activity, Category, Difficulty, Cost, Season } from '../types';
import { activitiesApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import MoodPicker from '../components/MoodPicker';
import ActivityGallery from '../components/ActivityGallery';

const initialActivity: Omit<Activity, 'id' | 'created_at'> & { mood?: string } = {
    title: '',
    description: '',
    status: 'planned',
    category: 'indoor',
    difficulty: 'easy',
    duration: 30,
    cost: 'low',
    season: 'any',
    rating: undefined,
    notes: undefined,
    mood: ''
};

const Activities = () => {
    type ActivityWithMood = Activity & { mood?: string };
    const [activities, setActivities] = useState<ActivityWithMood[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [newActivity, setNewActivity] = useState<Omit<Activity, 'id' | 'created_at'> & { mood?: string }>(initialActivity);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const fetchActivities = React.useCallback(async () => {
        setLoading(true);
        try {
            const response = await activitiesApi.getAll();
            setActivities(response.data);
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    const handleSubmit = React.useCallback(async () => {
        setSubmitLoading(true);
        setErrorMsg(null);
        const coupleCode = localStorage.getItem('coupleCode');
        if (!coupleCode) {
            setErrorMsg('Please enter your couple code first.');
            setSubmitLoading(false);
            return;
        }
        try {
            const res = await activitiesApi.create(newActivity);
            if (photoFile && res.data?.id) {
                const formData = new FormData();
                formData.append('file', photoFile);
                formData.append('couple_code', coupleCode);
                formData.append('activity_id', String(res.data.id));
                await fetch(`${import.meta.env.VITE_API_URL}/photos/`, {
                    method: 'POST',
                    body: formData
                });
            }
            setOpen(false);
            setNewActivity(initialActivity);
            setPhotoFile(null);
            fetchActivities();
        } catch (error: any) {
            setErrorMsg(error?.response?.data?.detail || 'Failed to add activity.');
            console.error('Error creating activity:', error);
        } finally {
            setSubmitLoading(false);
        }
    }, [newActivity, fetchActivities, photoFile]);

    // --- STATISTICS CALCULATION ---
    const stats = useMemo(() => {
        const total = activities.length;
        const completed = activities.filter(a => a.status === 'completed').length;
        const planned = activities.filter(a => a.status === 'planned').length;
        const categoryCount: Record<string, number> = {};
        let totalDuration = 0;
        activities.forEach(a => {
            categoryCount[a.category] = (categoryCount[a.category] || 0) + 1;
            totalDuration += a.duration || 0;
        });
        const mostPopularCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
        const avgDuration = total > 0 ? Math.round(totalDuration / total) : 0;
        return { total, completed, planned, mostPopularCategory, avgDuration };
    }, [activities]);

    if (loading) return <LoadingSpinner />;

    return (
        <Box>
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} alignItems={{ md: 'center' }} mb={4}>
                <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '2.2rem', md: '2.7rem' }, fontWeight: 900, color: '#FF7EB9', letterSpacing: '0.04em', mb: 3, mt: 2, fontFamily: 'Grotesco, Arial, sans-serif' }}>
                    🎉 Activities
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<MdAdd size={22} />}
                    onClick={() => setOpen(true)}
                    sx={{ mb: 2, fontWeight: 700, borderRadius: 8, fontSize: '1.13rem', boxShadow: '0 2px 8px #FFD6E8', animation: 'pulse 1.6s infinite', '@keyframes pulse': { '0%': { boxShadow: '0 0 0 0 #FFD6E8' }, '70%': { boxShadow: '0 0 0 14px rgba(255,214,232,0)' }, '100%': { boxShadow: '0 0 0 0 #FFD6E8' } } }}
                >
                    Add Activity
                </Button>
            </Box>
            {/* --- STATISTICS SECTION --- */}
            <Grid container spacing={2} sx={{ marginBottom: 4 }}>
                <Grid item xs={12} sm={6} md={2}><Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'grey.50' }}><FaMagic color="#B388FF" size={32} /><Typography variant="h6">Total</Typography><Typography variant="h5" fontWeight={700}>{stats.total}</Typography></Paper></Grid>
                <Grid item xs={12} sm={6} md={2}><Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'success.50' }}><FaRegCheckCircle color="#34C759" size={32} /><Typography variant="h6">Completed</Typography><Typography variant="h5" fontWeight={700}>{stats.completed}</Typography></Paper></Grid>
                <Grid item xs={12} sm={6} md={2}><Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'warning.50' }}><FaRegSmileBeam color="#FFC107" size={32} /><Typography variant="h6">Planned</Typography><Typography variant="h5" fontWeight={700}>{stats.planned}</Typography></Paper></Grid>
                <Grid item xs={12} sm={6} md={3}><Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'info.50' }}><FaHiking color="#2196F3" size={32} /><Typography variant="h6">Popular Category</Typography><Chip label={stats.mostPopularCategory} color="info" sx={{ mt: 1, fontWeight: 600 }} /></Paper></Grid>
                <Grid item xs={12} sm={6} md={3}><Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'secondary.50' }}><FaMusic color="#9C27B0" size={32} /><Typography variant="h6">Avg. Duration</Typography><Typography variant="h5" fontWeight={700}>{stats.avgDuration} min</Typography></Paper></Grid>
            </Grid>
            <Divider sx={{ mb: 4 }} />
            <Grid container spacing={3}>
                {activities.map((activity) => (
                    <Grid item xs={12} sm={6} md={4} key={activity.id}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                    {activity.mood && <span style={{ fontSize: 28 }}>{activity.mood}</span>}
                                    <Typography variant="h6" fontWeight={600}>{activity.title}</Typography>
                                </Box>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    {activity.description}
                                </Typography>
                                <ActivityGallery activityId={activity.id} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add Activity</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={newActivity.title}
                        onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        value={newActivity.description}
                        onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    />
                    <TextField
                        select
                        margin="dense"
                        label="Category"
                        fullWidth
                        value={newActivity.category}
                        onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value as Category })}
                    >
                        <MenuItem value="indoor">Indoor</MenuItem>
                        <MenuItem value="outdoor">Outdoor</MenuItem>
                        <MenuItem value="dining">Dining</MenuItem>
                        <MenuItem value="entertainment">Entertainment</MenuItem>
                        <MenuItem value="travel">Travel</MenuItem>
                    </TextField>
                    <TextField
                        select
                        margin="dense"
                        label="Difficulty"
                        fullWidth
                        value={newActivity.difficulty}
                        onChange={(e) => setNewActivity({ ...newActivity, difficulty: e.target.value as Difficulty })}
                    >
                        <MenuItem value="easy">Easy</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="hard">Hard</MenuItem>
                    </TextField>
                    <TextField
                        type="number"
                        margin="dense"
                        label="Duration (minutes)"
                        fullWidth
                        value={newActivity.duration}
                        onChange={(e) => setNewActivity({ ...newActivity, duration: parseInt(e.target.value) })}
                    />
                    <TextField
                        select
                        margin="dense"
                        label="Cost"
                        fullWidth
                        value={newActivity.cost}
                        onChange={(e) => setNewActivity({ ...newActivity, cost: e.target.value as Cost })}
                    >
                        <MenuItem value="free">Free</MenuItem>
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                    </TextField>
                    <TextField
                        select
                        margin="dense"
                        label="Season"
                        fullWidth
                        value={newActivity.season}
                        onChange={(e) => setNewActivity({ ...newActivity, season: e.target.value as Season })}
                    >
                        <MenuItem value="any">Any Season</MenuItem>
                        <MenuItem value="spring">Spring</MenuItem>
                        <MenuItem value="summer">Summer</MenuItem>
                        <MenuItem value="fall">Fall</MenuItem>
                        <MenuItem value="winter">Winter</MenuItem>
                    </TextField>
                    <TextField
                        select
                        margin="dense"
                        label="Status"
                        fullWidth
                        value={newActivity.status}
                        onChange={(e) => setNewActivity({ ...newActivity, status: e.target.value as 'planned' | 'completed' })}
                    >
                        <MenuItem value="planned">Planned</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                    </TextField>
                    <MoodPicker
                        value={newActivity.mood}
                        onChange={(mood) => setNewActivity({ ...newActivity, mood })}
                    />
                    <Box mt={2}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setPhotoFile(e.target.files?.[0] || null)}
                        />
                    </Box>
                </DialogContent>
                {errorMsg && (
                    <Box mt={2} color="error.main">
                        <Typography color="error">{errorMsg}</Typography>
                    </Box>
                )}
                <DialogActions>
                    <Button onClick={() => setOpen(false)} disabled={submitLoading}>Cancel</Button>
                    <Button onClick={handleSubmit} color="primary" disabled={submitLoading}>
                        {submitLoading ? 'Adding...' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Activities;