import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Snackbar,
    Alert,
    CircularProgress,
    Divider,
    Paper
} from '@mui/material';
import { 
    EmojiEvents as TrophyIcon, 
    PlayArrow as StartIcon, 
    CheckCircle as CompleteIcon,
    AccessTime as ClockIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { challengesApi, ChallengeWithProgress } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

// Icons for different challenge categories
const categoryIcons: Record<string, string> = {
    'daily': '📅',
    'weekly': '📆',
    'one-time': '🎯',
    'beginner': '🌱',
    'advanced': '🔥',
};

const Challenges = () => {
    const [challenges, setChallenges] = useState<ChallengeWithProgress[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedChallenge, setSelectedChallenge] = useState<ChallengeWithProgress | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
    const [actionInProgress, setActionInProgress] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        fetchChallenges();
    }, []);

    const fetchChallenges = async () => {
        setLoading(true);
        try {
            const response = await challengesApi.getAll();
            setChallenges(response.data);
        } catch (error) {
            console.error('Error fetching challenges:', error);
            setSnackbarMessage('Failed to load challenges. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleStartChallenge = async (challenge: ChallengeWithProgress) => {
        setActionInProgress(true);
        try {
            await challengesApi.start(challenge.id);
            
            // Update local state
            setChallenges(prevChallenges => 
                prevChallenges.map(c => 
                    c.id === challenge.id 
                        ? { ...c, started: true, started_at: new Date().toISOString() }
                        : c
                )
            );
            
            setSnackbarMessage(`You've started the "${challenge.title}" challenge!`);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error starting challenge:', error);
            setSnackbarMessage('Failed to start challenge. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setActionInProgress(false);
        }
    };

    const handleCompleteChallenge = async (challenge: ChallengeWithProgress) => {
        setActionInProgress(true);
        try {
            await challengesApi.complete(challenge.id);
            
            // Update local state
            setChallenges(prevChallenges => 
                prevChallenges.map(c => 
                    c.id === challenge.id 
                        ? { 
                            ...c, 
                            started: true, 
                            completed: true,
                            completed_at: new Date().toISOString() 
                        }
                        : c
                )
            );
            
            setCompleteDialogOpen(false);
            setSnackbarMessage(`🎉 Congratulations! You've completed the "${challenge.title}" challenge!`);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error completing challenge:', error);
            setSnackbarMessage('Failed to complete challenge. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setActionInProgress(false);
        }
    };

    const openDetailDialog = (challenge: ChallengeWithProgress) => {
        setSelectedChallenge(challenge);
        setDetailDialogOpen(true);
    };

    const openCompleteDialog = (challenge: ChallengeWithProgress) => {
        setSelectedChallenge(challenge);
        setCompleteDialogOpen(true);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <Box>
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} alignItems={{ md: 'center' }} mb={4}>
                <Typography variant="h4" sx={{ flexGrow: 1 }}>Relationship Challenges</Typography>
            </Box>

            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>Complete challenges together to strengthen your relationship!</Typography>
                <Typography variant="body1" paragraph>Choose from our curated list of activities designed to help couples connect, communicate, and create memories.</Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {challenges.map((challenge) => (
                        <Box key={challenge.id} sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
                            <Card 
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    ...(challenge.completed && {
                                        backgroundColor: 'success.light',
                                        borderColor: 'success.main',
                                        borderWidth: 1,
                                        borderStyle: 'solid'
                                    })
                                }}
                            >
                                {challenge.completed && (
                                    <Chip 
                                        label="Completed" 
                                        color="success" 
                                        icon={<CompleteIcon />} 
                                        sx={{ 
                                            position: 'absolute', 
                                            top: 10, 
                                            right: 10,
                                            fontWeight: 'bold'
                                        }} 
                                    />
                                )}

                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Box 
                                            sx={{ 
                                                fontSize: '2rem', 
                                                mr: 1,
                                                lineHeight: 1 
                                            }}
                                        >
                                            {challenge.icon || categoryIcons[challenge.category || ''] || '🎯'}
                                        </Box>
                                        <Typography variant="h6" component="div">
                                            {challenge.title}
                                        </Typography>
                                    </Box>
                                    
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary" 
                                        sx={{ 
                                            height: '4.5em', 
                                            overflow: 'hidden', 
                                            textOverflow: 'ellipsis', 
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical'
                                        }}
                                    >
                                        {challenge.description}
                                    </Typography>
                                    
                                    <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                                        <Chip 
                                            label={`${challenge.points} pts`} 
                                            color="primary" 
                                            size="small" 
                                            icon={<TrophyIcon />} 
                                        />
                                        
                                        {challenge.started && !challenge.completed && (
                                            <Chip 
                                                label="In Progress" 
                                                color="warning" 
                                                size="small" 
                                                icon={<ClockIcon />} 
                                            />
                                        )}
                                        
                                        {challenge.category && (
                                            <Chip 
                                                label={challenge.category} 
                                                color="default" 
                                                size="small" 
                                                variant="outlined"
                                            />
                                        )}
                                    </Box>
                                </CardContent>
                                
                                <CardActions sx={{ p: 2, pt: 0 }}>
                                    <Button 
                                        size="small" 
                                        startIcon={<InfoIcon />}
                                        onClick={() => openDetailDialog(challenge)}
                                    >
                                        Details
                                    </Button>
                                    
                                    {!challenge.started && (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<StartIcon />}
                                            onClick={() => handleStartChallenge(challenge)}
                                            disabled={actionInProgress}
                                        >
                                            Start
                                        </Button>
                                    )}
                                    
                                    {challenge.started && !challenge.completed && (
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="success"
                                            startIcon={<CompleteIcon />}
                                            onClick={() => openCompleteDialog(challenge)}
                                            disabled={actionInProgress}
                                        >
                                            Complete
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        </Box>
                    ))}
                </Box>
            </Paper>

            {/* Challenge Details Dialog */}
            <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="sm" fullWidth>
                {selectedChallenge && (
                    <>
                        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box fontSize="2rem" mr={1}>
                                {selectedChallenge.icon || categoryIcons[selectedChallenge.category || ''] || '🎯'}
                            </Box>
                            {selectedChallenge.title}
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="body1" paragraph>
                                {selectedChallenge.description}
                            </Typography>
                            
                            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                                <Chip 
                                    label={`${selectedChallenge.points} points`} 
                                    color="primary" 
                                    icon={<TrophyIcon />} 
                                />
                                
                                {selectedChallenge.category && (
                                    <Chip 
                                        label={selectedChallenge.category} 
                                        variant="outlined" 
                                    />
                                )}
                                
                                {selectedChallenge.completed ? (
                                    <Chip 
                                        label="Completed" 
                                        color="success" 
                                        icon={<CompleteIcon />} 
                                    />
                                ) : selectedChallenge.started ? (
                                    <Chip 
                                        label="In Progress" 
                                        color="warning" 
                                        icon={<ClockIcon />} 
                                    />
                                ) : null}
                            </Box>
                            
                            {selectedChallenge.started_at && (
                                <Typography variant="body2">
                                    Started: {format(new Date(selectedChallenge.started_at), 'PP')}
                                </Typography>
                            )}
                            
                            {selectedChallenge.completed_at && (
                                <Typography variant="body2">
                                    Completed: {format(new Date(selectedChallenge.completed_at), 'PP')}
                                </Typography>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
                            
                            {!selectedChallenge.started && (
                                <Button 
                                    variant="outlined" 
                                    color="primary" 
                                    startIcon={<StartIcon />}
                                    onClick={() => {
                                        setDetailDialogOpen(false);
                                        handleStartChallenge(selectedChallenge);
                                    }}
                                    disabled={actionInProgress}
                                >
                                    Start Challenge
                                </Button>
                            )}
                            
                            {selectedChallenge.started && !selectedChallenge.completed && (
                                <Button 
                                    variant="contained" 
                                    color="success" 
                                    startIcon={<CompleteIcon />}
                                    onClick={() => {
                                        setDetailDialogOpen(false);
                                        openCompleteDialog(selectedChallenge);
                                    }}
                                    disabled={actionInProgress}
                                >
                                    Mark Complete
                                </Button>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Challenge Complete Dialog */}
            <Dialog open={completeDialogOpen} onClose={() => setCompleteDialogOpen(false)}>
                {selectedChallenge && (
                    <>
                        <DialogTitle>
                            Complete Challenge
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to mark "{selectedChallenge.title}" as complete?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setCompleteDialogOpen(false)} disabled={actionInProgress}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={() => handleCompleteChallenge(selectedChallenge)} 
                                color="success" 
                                variant="contained"
                                disabled={actionInProgress}
                            >
                                {actionInProgress ? <CircularProgress size={24} /> : 'Complete Challenge'}
                            </Button>
                        </DialogActions>
                    </>
                )}
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
        </Box>
    );
};

export default Challenges;
