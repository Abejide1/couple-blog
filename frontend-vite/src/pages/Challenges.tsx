import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Divider,
    Chip,
    Button,
    Card,
    CardContent,
    CardActions,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Snackbar,
    Alert,
    CircularProgress,
} from '@mui/material';
import { FaTrophy, FaRegSmileBeam, FaRegCheckCircle, FaRegClock, FaInfoCircle, FaMagic } from 'react-icons/fa';
import { GiRibbonMedal } from 'react-icons/gi';
import { format } from 'date-fns';
import { challengesApi, ChallengeWithProgress } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Badges from '../components/Badges';
import { badgesApi } from '../services/badgesApi';

// Cute react-icons for different challenge categories
const categoryIcons: Record<string, React.ReactNode> = {
  'daily': <FaRegSmileBeam size={28} color="#FFB86B" />,
  'weekly': <FaTrophy size={28} color="#B388FF" />,
  'one-time': <FaMagic size={30} color="#FF7EB9" />,
  'beginner': <GiRibbonMedal size={28} color="#7AF5FF" />,
  'advanced': <FaTrophy size={30} color="#FFD36E" />,
};

const Challenges = () => {
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
    const [badges, setBadges] = useState<Record<string, boolean>>({});
    const [badgesLoading, setBadgesLoading] = useState(true);

    useEffect(() => {
        fetchChallenges();
        fetchBadges();
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

    const fetchBadges = async () => {
        setBadgesLoading(true);
        try {
            const progress = await badgesApi.get();
            setBadges(progress);
        } catch {
            setBadges({});
        } finally {
            setBadgesLoading(false);
        }
    };

    const handleStartChallenge = async (challenge: ChallengeWithProgress) => {
        setActionInProgress(true);
        try {
            await challengesApi.start(challenge.id);
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
            setSnackbarMessage(`You've completed the "${challenge.title}" challenge!`);
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

    if (loading || badgesLoading) return <LoadingSpinner />;

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
                                        sx={{ fontWeight: 700, borderRadius: 8 }}
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
            {/* ...rest of your dialog and snackbar code... */}
        </Box>
    );
};

export default Challenges;