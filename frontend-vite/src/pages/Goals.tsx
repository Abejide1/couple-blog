import { useState, useEffect } from 'react';
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
    Checkbox,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Snackbar,
    Alert,
    Fab,
    Divider,
    LinearProgress,
    Tooltip
} from '@mui/material';
import { FaFlag, FaEdit, FaTrash, FaRegCheckCircle, FaCalendarAlt, FaListAlt, FaCheck, FaRegSmileBeam, FaHeart, FaStar, FaBirthdayCake } from 'react-icons/fa';
import { MdAdd, MdCelebration } from 'react-icons/md';
import { format } from 'date-fns';
import { goalsApi, Goal, GoalCreate, GoalUpdate } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

// Priority colors
const priorityColors: Record<string, string> = {
    'high': 'error',
    'medium': 'warning',
    'low': 'success',
};

const Goals = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
    const [formData, setFormData] = useState<GoalCreate>({
        title: '',
        description: '',
        target_date: undefined,
        priority: 'medium',
        category: ''
    });
    const [completeAlertOpen, setCompleteAlertOpen] = useState(false);
    const [completedGoal, setCompletedGoal] = useState<Goal | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    // Categories for goals (could be dynamic or based on couple's interests)
    const categories = ['Travel', 'Home', 'Financial', 'Adventure', 'Learning', 'Relationship', 'Health', 'Entertainment', 'Other'];

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        setLoading(true);
        try {
            const response = await goalsApi.getAll();
            setGoals(response.data);
        } catch (error) {
            console.error('Error fetching goals:', error);
            setSnackbarMessage('Failed to load goals. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (goal?: Goal) => {
        if (goal) {
            setSelectedGoal(goal);
            setFormData({
                title: goal.title,
                description: goal.description || '',
                target_date: goal.target_date,
                priority: goal.priority || 'medium',
                category: goal.category || ''
            });
            setEditMode(true);
        } else {
            setSelectedGoal(null);
            setFormData({
                title: '',
                description: '',
                target_date: undefined,
                priority: 'medium',
                category: ''
            });
            setEditMode(false);
        }
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    const handleCreateGoal = async () => {
        try {
            const response = await goalsApi.create(formData);
            setGoals([...goals, response.data]);
            setDialogOpen(false);
            setSnackbarMessage('Goal created successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error creating goal:', error);
            setSnackbarMessage('Failed to create goal. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleUpdateGoal = async () => {
        if (!selectedGoal) return;

        try {
            const response = await goalsApi.update(selectedGoal.id, formData as GoalUpdate);
            setGoals(goals.map(goal => goal.id === selectedGoal.id ? response.data : goal));
            setDialogOpen(false);
            setSnackbarMessage('Goal updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error updating goal:', error);
            setSnackbarMessage('Failed to update goal. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleDeleteGoal = async (goalId: number) => {
        try {
            await goalsApi.delete(goalId);
            setGoals(goals.filter(goal => goal.id !== goalId));
            setSnackbarMessage('Goal deleted successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error deleting goal:', error);
            setSnackbarMessage('Failed to delete goal. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleCompleteGoal = async (goal: Goal) => {
        try {
            const response = await goalsApi.update(goal.id, { completed: true } as GoalUpdate);
            setGoals(goals.map(g => g.id === goal.id ? response.data : g));
            setCompletedGoal(response.data);
            setCompleteAlertOpen(true);
        } catch (error) {
            console.error('Error completing goal:', error);
            setSnackbarMessage('Failed to complete goal. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const getGoalProgress = () => {
        const totalGoals = goals.length;
        const completedGoals = goals.filter(goal => goal.completed).length;
        return totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
    };

    if (loading) return <LoadingSpinner />;

    // Sort goals: incomplete first, then by priority, then by target date
    const sortedGoals = [...goals].sort((a, b) => {
        // Incomplete goals first
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        
        // Then by priority (high > medium > low)
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        const aPriority = a.priority ? priorityOrder[a.priority as keyof typeof priorityOrder] || 3 : 3;
        const bPriority = b.priority ? priorityOrder[b.priority as keyof typeof priorityOrder] || 3 : 3;
        
        if (aPriority !== bPriority) {
            return aPriority - bPriority;
        }
        
        // Then by target date (closest first)
        if (a.target_date && b.target_date) {
            return new Date(a.target_date).getTime() - new Date(b.target_date).getTime();
        } else if (a.target_date) {
            return -1;
        } else if (b.target_date) {
            return 1;
        }
        
        // Finally by title
        return a.title.localeCompare(b.title);
    });

    return (
        <Box>
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} alignItems={{ md: 'center' }} mb={4}>
                <Typography variant="h4" sx={{ flexGrow: 1 }}>Couple Goals</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<MdAdd size={24} />}
                    onClick={() => handleOpen()}
                    sx={{ minWidth: 180, fontWeight: 700, borderRadius: 8, fontSize: '1.2rem', boxShadow: '0 2px 8px #FFD6E8' }}
                >
                    Add Goal
                </Button>
            </Box>

            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Box sx={{ mb: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="h6">Progress</Typography>
                        <Typography variant="body2">
                            {goals.filter(goal => goal.completed).length} of {goals.length} completed
                        </Typography>
                    </Box>
                    <LinearProgress 
                        variant="determinate" 
                        value={getGoalProgress()} 
                        sx={{ height: 10, borderRadius: 5 }} 
                    />
                </Box>

                <Divider sx={{ mb: 3 }} />

                {sortedGoals.length === 0 ? (
                    <Box textAlign="center" p={3}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No goals yet
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            Add some goals to work towards together!
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<MdAdd size={24} />}
                            onClick={() => handleOpen()}
                            sx={{ fontWeight: 700, borderRadius: 8, fontSize: '1.15rem', boxShadow: '0 2px 8px #FFD6E8' }}
                        >
                            Add Your First Goal
                        </Button>
                    </Box>
                ) : (
                    <List sx={{ width: '100%' }}>
                        {sortedGoals.map((goal) => (
                            <ListItem
                                key={goal.id}
                                sx={{
                                    mb: 2,
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    ...(goal.completed && {
                                        bgcolor: 'success.light',
                                        opacity: 0.8,
                                        borderColor: 'success.main'
                                    })
                                }}
                                secondaryAction={
                                    <Box>
                                        {!goal.completed && (
                                            <>
                                                <Tooltip title="Mark as complete">
                                                    <IconButton edge="end" onClick={() => handleCompleteGoal(goal)}>
                                                        <FaCheck color="#2E7D32" size={22} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit goal">
                                                    <IconButton edge="end" onClick={() => handleOpen(goal)}>
                                                        <FaEdit color="#B388FF" size={22} />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                        <Tooltip title="Delete goal">
                                            <IconButton edge="end" onClick={() => handleDeleteGoal(goal.id)}>
                                                <FaTrash color="#FF7EB9" size={22} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                }
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={goal.completed}
                                        onChange={() => !goal.completed && handleCompleteGoal(goal)}
                                        sx={{ 
                                            '&.Mui-checked': { color: 'success.main' }
                                        }}
                                    />
                                </ListItemIcon>

                                <ListItemText
                                    primary={
                                        <Box display="flex" alignItems="center">
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    mr: 1,
                                                    textDecoration: goal.completed ? 'line-through' : 'none',
                                                }}
                                            >
                                                {goal.title}
                                            </Typography>
                                            
                                            {goal.priority && (
                                                <Chip 
                                                    label={goal.priority} 
                                                    size="medium"
                                                    color={priorityColors[goal.priority] as any || 'default'} 
                                                    icon={<FaFlag size={18} />}
                                                    sx={{ mr: 1, fontWeight: 700, background: '#FFF8E1', color: '#FFA000', fontSize: '1.05rem', borderRadius: 8 }}
                                                />
                                            )}
                                            
                                            {goal.category && (
                                                <Chip 
                                                    label={goal.category} 
                                                    size="medium"
                                                    variant="outlined"
                                                    icon={<FaListAlt size={18} />}
                                                    sx={{ fontWeight: 700, borderRadius: 8 }}
                                                />
                                            )}
                                        </Box>
                                    }
                                    secondary={
                                        <Box mt={1}>
                                            {goal.description && (
                                                <Typography 
                                                    variant="body2" 
                                                    paragraph 
                                                    sx={{ 
                                                        mt: 1,
                                                        textDecoration: goal.completed ? 'line-through' : 'none',
                                                        opacity: goal.completed ? 0.7 : 1
                                                    }}
                                                >
                                                    {goal.description}
                                                </Typography>
                                            )}
                                            
                                            <Box display="flex" mt={1}>
                                                {goal.target_date && (
                                                    <Typography 
                                                        variant="caption" 
                                                        sx={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center',
                                                            mr: 2,
                                                            color: 'text.secondary'
                                                        }}
                                                    >
                                                        <FaCalendarAlt size={15} style={{ marginRight: 4 }} />
                                                        Target: {format(new Date(goal.target_date), 'PP')}
                                                    </Typography>
                                                )}
                                                
                                                {goal.completed_at && (
                                                    <Typography 
                                                        variant="caption" 
                                                        sx={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center',
                                                            color: 'success.main'
                                                        }}
                                                    >
                                                        <FaRegCheckCircle size={15} style={{ marginRight: 4 }} />
                                                        Completed: {format(new Date(goal.completed_at), 'PP')}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>

            {/* Create/Edit Goal Dialog */}
            <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editMode ? 'Edit Goal' : 'Add New Goal'}
                </DialogTitle>
                <DialogContent>
                    <Box mt={2} display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Title"
                            fullWidth
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />

                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />

                        <TextField
                            label="Target Date"
                            type="date"
                            fullWidth
                            value={formData.target_date ? format(new Date(formData.target_date), 'yyyy-MM-dd') : ''}
                            onChange={(e) => setFormData({ ...formData, target_date: e.target.value ? new Date(e.target.value) : undefined })}
                            InputLabelProps={{ shrink: true }}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Priority</InputLabel>
                            <Select
                                value={formData.priority || 'medium'}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                label="Priority"
                            >
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={formData.category || ''}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                label="Category"
                            >
                                <MenuItem value="">None</MenuItem>
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>{category}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button 
                        onClick={editMode ? handleUpdateGoal : handleCreateGoal} 
                        color="primary"
                        variant="contained"
                        disabled={!formData.title}
                    >
                        {editMode ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Goal Completion Celebration Dialog */}
            <Dialog
                open={completeAlertOpen}
                onClose={() => setCompleteAlertOpen(false)}
                PaperProps={{
                    style: {
                        backgroundColor: '#f8f9fa',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        borderRadius: '12px',
                        padding: '16px'
                    }
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
                    <MdCelebration color="#FF7EB9" size={60} />
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center', pt: 2 }}>
                    <Typography variant="h5" color="success.main" gutterBottom>
                        Goal Accomplished! 🎉
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Congratulations on completing your goal:
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" paragraph>
                        "{completedGoal?.title}"
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Keep up the great work! What will you achieve next?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                    <Button
                        onClick={() => setCompleteAlertOpen(false)}
                        variant="contained"
                        color="success"
                        sx={{ minWidth: 120 }}
                    >
                        Thank You!
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Add Button (for mobile) */}
            <Box sx={{ display: { sm: 'none' } }}>
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{ position: 'fixed', bottom: 16, right: 16, fontSize: 28, background: '#FF7EB9' }}
                    onClick={() => handleOpen()}
                >
                    <MdAdd size={28} />
                </Fab>
            </Box>
        </Box>
    );
};

export default Goals;
