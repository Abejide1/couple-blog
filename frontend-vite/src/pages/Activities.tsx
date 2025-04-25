import React, { useState, useEffect, useMemo } from 'react';
import {
    Typography,
    Card,
    CardContent,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Box,
    Paper,
    Chip,
    Divider
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { TrendingUp, CheckCircle, Schedule, Category as CategoryIcon, Timer } from '@mui/icons-material';
import { Add as AddIcon } from '@mui/icons-material';
import { Activity, Category, Difficulty, Cost, Season } from '../types';
import { activitiesApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import MoodPicker from '../components/MoodPicker';
import ActivityGallery from '../components/ActivityGallery';

const initialActivity = {
    title: '',
    description: '',
    status: 'planned' as const,
    category: 'indoor' as Category,
    difficulty: 'easy' as Difficulty,
    duration: 30,
    cost: 'low' as Cost,
    season: 'any' as Season,
    rating: undefined,
    notes: undefined
};

const Activities = () => {
    type ActivityWithMood = Activity & { mood?: string };
    const [activities, setActivities] = useState<ActivityWithMood[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [newActivity, setNewActivity] = useState<Omit<Activity, 'id' | 'created_at'>>(initialActivity);
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
        // Check for couple code
        const coupleCode = localStorage.getItem('coupleCode');
        if (!coupleCode) {
            setErrorMsg('Please enter your couple code first.');
            setSubmitLoading(false);
            return;
        }
        try {
            // 1. Create activity
            const res = await activitiesApi.create(newActivity);
            // 2. If photo, upload it
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

    // --- UI ---
    return (
        <Box>
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} alignItems={{ md: 'center' }} mb={4}>
                <Typography variant="h4" sx={{ flexGrow: 1 }}>Activities</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                    sx={{ minWidth: 160, fontWeight: 600 }}
                >
                    Add Activity
                </Button>
            </Box>
            {/* --- STATISTICS SECTION --- */}
            <Grid container spacing={2} style={{ marginBottom: 32 }}>
                <Grid item xs={12} sm={6} md={2}>
                    <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'grey.50' }}>
                        <TrendingUp color="primary" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="h6">Total</Typography>
                        <Typography variant="h5" fontWeight={700}>{stats.total}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'success.50' }}>
                        <CheckCircle color="success" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="h6">Completed</Typography>
                        <Typography variant="h5" fontWeight={700}>{stats.completed}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'warning.50' }}>
                        <Schedule color="warning" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="h6">Planned</Typography>
                        <Typography variant="h5" fontWeight={700}>{stats.planned}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'info.50' }}>
                        <CategoryIcon color="info" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="h6">Popular Category</Typography>
                        <Chip label={stats.mostPopularCategory} color="info" sx={{ mt: 1, fontWeight: 600 }} />
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'secondary.50' }}>
                        <Timer color="secondary" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="h6">Avg. Duration</Typography>
                        <Typography variant="h5" fontWeight={700}>{stats.avgDuration} min</Typography>
                    </Paper>
                </Grid>
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
                    >
                        <MenuItem value="outdoor">Outdoor</MenuItem>
                        <MenuItem value="indoor">Indoor</MenuItem>
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
        </>
    );
}

export default Activities;
