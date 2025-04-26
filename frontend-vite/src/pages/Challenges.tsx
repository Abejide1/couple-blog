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
import { FaTrophy, FaRegSmileBeam, FaRegCheckCircle, FaRegClock, FaInfoCircle, FaHeart, FaStar, FaMagic, FaBirthdayCake } from 'react-icons/fa';
import { GiPartyPopper, GiLoveMystery, GiCutDiamond, GiRibbonMedal } from 'react-icons/gi';
import { format } from 'date-fns';
import { challengesApi, ChallengeWithProgress } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfettiBurst from '../components/ConfettiBurst';
import Badges from '../components/Badges';
import { badgesApi } from '../services/badgesApi';

// Cute react-icons for different challenge categories
const categoryIcons: Record<string, React.ReactNode> = {
  'daily': <FaRegSmileBeam size={28} color="#FFB86B" />,
  'weekly': <FaStar size={28} color="#B388FF" />,
  'one-time': <GiPartyPopper size={30} color="#FF7EB9" />,
  'beginner': <GiLoveMystery size={28} color="#7AF5FF" />,
  'advanced': <GiCutDiamond size={30} color="#FFD36E" />,
};

const Challenges = () => {
    // --- BADGES STATE (fetch from backend) ---
    const [badges, setBadges] = useState<Record<string, boolean>>({});
    const [badgesLoading, setBadgesLoading] = useState(true);

    useEffect(() => {
        // Fetch badge progress from backend
        const fetchBadges = async () => {
            try {
                const progress = await badgesApi.get();
                setBadges(progress);
            } catch (e) {
                setBadges({});
            } finally {
                setBadgesLoading(false);
            }
        };
        fetchBadges();
    }, []);

    const [showConfetti, setShowConfetti] = useState(false);
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
        let newBadges = { ...badges };
        let badgeChanged = false;
        // --- BADGE LOGIC: Earn 'challenge_accepted' badge on first complete ---
        if (!newBadges.challenge_accepted) {
            newBadges.challenge_accepted = true;
            badgeChanged = true;
        }
        // --- BADGE LOGIC: Earn 'streak_master' if 30 challenges completed (example streak logic) ---
        const completedCount = challenges.filter(c => c.completed).length + 1; // +1 for this one
        if (!newBadges.streak_master && completedCount >= 30) {
            newBadges.streak_master = true;
            badgeChanged = true;
        }
        // --- BADGE LOGIC: Earn 'goal_crushers' if 5 goals completed (simulate, ideally fetch real count) ---
        if (!newBadges.goal_crushers) {
            // TODO: fetch real completed goals count from backend
            const completedGoals = 5; // Replace with real logic
            if (completedGoals >= 5) {
                newBadges.goal_crushers = true;
                badgeChanged = true;
            }
        }
        if (badgeChanged) {
            setBadges(newBadges);
            await badgesApi.update(newBadges);
        }
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

    const handleCompleteDialog = async () => {
        if (!selectedChallenge) return;
        setActionInProgress(true);
        try {
            await challengesApi.complete(selectedChallenge.id);
            setSnackbarMessage('Challenge completed!');
            setSnackbarOpen(true);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 1800);
            setCompleteDialogOpen(false);
            fetchChallenges();
        } catch (err) {
            setSnackbarMessage('Failed to complete challenge.');
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

    // Section heading style
    const headingSx = { fontSize: { xs: '2.2rem', md: '2.7rem' }, fontWeight: 900, color: '#FF7EB9', letterSpacing: '0.04em', mb: 3, mt: 2, fontFamily: 'Grotesco, Arial, sans-serif' };
    // Add button pulse style
    const addPulseSx = { animation: 'pulse 1.6s infinite', '@keyframes pulse': { '0%': { boxShadow: '0 0 0 0 #FFD6E8' }, '70%': { boxShadow: '0 0 0 14px rgba(255,214,232,0)' }, '100%': { boxShadow: '0 0 0 0 #FFD6E8' } } };

    if (loading) return <LoadingSpinner />;

    return (
        <Box sx={{ p: { xs: 1, md: 4 }, maxWidth: 1100, mx: 'auto', fontFamily: '"Swanky and Moo Moo", cursive' }}>
            <Typography variant="h3" align="center" gutterBottom sx={{ fontFamily: '"Swanky and Moo Moo", cursive', color: '#B388FF', fontWeight: 900 }}>
                Couple Challenges
            </Typography>
            {/* --- BADGES SECTION --- */}
            <Box display="flex" justifyContent="center" mb={3}>
                <Badges badges={badges} />
            </Box>
            <Divider sx={{ mb: 4 }} />
            <Typography variant="h4" sx={{ flexGrow: 1 }}>Relationship Challenges</Typography>
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
                                    icon={<FaRegCheckCircle size={22} />} 
                                    sx={{ 
                                        position: 'absolute', 
                                        top: 10, 
                                        right: 10,
                                        fontWeight: 'bold',
                                        background: '#C3F6C7',
                                        color: '#2E7D32',
                                        fontSize: '1.1rem',
                                    }} 
                                />
                            )}

                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Box 
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
                                        icon={<FaRegCheckCircle size={22} />} 
                                        sx={{ 
                                            position: 'absolute', 
                                            top: 10, 
                                            right: 10,
                                            fontWeight: 'bold',
                                            background: '#C3F6C7',
                                            color: '#2E7D32',
                                            fontSize: '1.1rem',
                                        }} 
                                    />
                                )}

                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Box 
                                            sx={{ 
                                                fontSize: '2.5rem', 
                                                mr: 1.5,
                                                lineHeight: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '50%',
                                                background: '#FFF0F6',
                                                width: 56,
                                                height: 56,
                                                boxShadow: '0 2px 8px #FFD6E8',
                                            }}
                                        >
                                            {challenge.icon ? <span style={{fontSize: '2.2rem'}}>{challenge.icon}</span> : (categoryIcons[challenge.category || ''] || <FaMagic size={30} color="#FF7EB9" />)}
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
                                            size="medium" 
                                            icon={<FaTrophy size={20} />} 
                                            sx={{ fontWeight: 700, background: '#FFF0F6', color: '#FF7EB9', fontSize: '1.1rem' }}
                                        />
                                        
                                        {challenge.started && !challenge.completed && (
                                            <Chip 
                                                label="In Progress" 
                                                color="warning" 
                                                size="medium" 
                                                icon={<FaRegClock size={20} />} 
                                                sx={{ fontWeight: 700, background: '#FFF8E1', color: '#FFA000', fontSize: '1.1rem' }}
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
                                        size="medium" 
                                        startIcon={<FaInfoCircle size={20} />}
                                        onClick={() => openDetailDialog(challenge)}
                                        sx={{ fontWeight: 700, color: '#B388FF', borderRadius: 8, background: '#F3E8FF', '&:hover': { background: '#E1CFFF', color: '#7C3AED' } }}
                                    >
                                        Details
                                    </Button>
                                    
                                    {!challenge.started && (
                                        <Button
                                            size="medium"
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<FaMagic size={20} />}
                                            onClick={() => handleStartChallenge(challenge)}
                                            disabled={actionInProgress}
                                            sx={{ fontWeight: 700, borderRadius: 8, ...addPulseSx }}
                                        >
                                            Start
                                        </Button>
                                    )}
                                    
                                    {challenge.started && !challenge.completed && (
                                        <Button
                                            size="medium"
                                            variant="contained"
                                            color="success"
                                            startIcon={<FaRegCheckCircle size={20} />}
                                            onClick={() => openCompleteDialog(challenge)}
                                            disabled={actionInProgress}
                                            sx={{ fontWeight: 700, borderRadius: 8, background: '#C3F6C7', color: '#2E7D32', '&:hover': { background: '#A8E6A1', color: '#145C1E' } }}
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
                                    icon={<FaTrophy size={20} />} 
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
                                        icon={<FaRegCheckCircle size={20} />} 
                                    />
                                ) : selectedChallenge.started ? (
                                    <Chip 
                                        label="In Progress" 
                                        color="warning" 
                                        icon={<FaRegClock size={20} />} 
                                    />
                                ) : null}
                            </Box>
                            
                            {selectedChallenge.started_at && (
                                <Typography variant="body2">
                                    Started: {format(new Date(selectedChallenge.started_at), 'PP')}
                                </Typography>
                            )}
                            
                            {selectedChallenge.completed_at && (
                                <Typography variant="h4" gutterBottom sx={headingSx}>
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
