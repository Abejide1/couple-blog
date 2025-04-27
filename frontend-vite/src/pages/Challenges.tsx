import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  CardContent,
  CardActions,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import { FaMagic, FaTrophy, FaRegCheckCircle, FaInfoCircle, FaRegClock } from 'react-icons/fa';
import { challengesApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const categoryIcons: Record<string, React.ReactNode> = {
  Romance: <FaMagic size={20} color="#FF7EB9" />,
  Adventure: <FaTrophy size={20} color="#B388FF" />,
  // Add more categories as needed
};

const Challenges = () => {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const response = await challengesApi.getAll();
      setChallenges(response.data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to load challenges.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleStartChallenge = async (challenge: any) => {
    setActionInProgress(true);
    try {
      await challengesApi.start(challenge.id);
      setSnackbar({ open: true, message: 'Challenge started!', severity: 'success' });
      fetchChallenges();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to start challenge.', severity: 'error' });
    } finally {
      setActionInProgress(false);
    }
  };

  const handleCompleteChallenge = async (challenge: any) => {
    setActionInProgress(true);
    try {
      await challengesApi.complete(challenge.id);
      setSnackbar({ open: true, message: 'Challenge completed!', severity: 'success' });
      fetchChallenges();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to complete challenge.', severity: 'error' });
    } finally {
      setActionInProgress(false);
    }
  };

  const openDetailDialog = (challenge: any) => {
    setSelectedChallenge(challenge);
    setDetailDialogOpen(true);
  };

  const closeDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedChallenge(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: '#B388FF' }}>
        Relationship Challenges
      </Typography>
      <Typography variant="body1" paragraph>
        Choose from our curated list of activities designed to help couples connect, communicate, and create memories.
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 2, sm: 3 },
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {challenges.map((challenge) => (
          <Box
            key={challenge.id}
            sx={{
              width: { xs: 270, sm: 310 },
              minHeight: 300,
              bgcolor: '#FFF6FB',
              borderRadius: '32px',
              boxShadow: '0 2px 12px #FFD6E8',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              p: 0,
              m: 1,
              border: challenge.completed ? '2px solid #2E7D32' : 'none',
              opacity: challenge.completed ? 0.85 : 1,
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
                  zIndex: 2,
                }}
              />
            )}

            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
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
                  {challenge.icon
                    ? <span style={{ fontSize: '2.2rem' }}>{challenge.icon}</span>
                    : (categoryIcons[challenge.category || ''] || <FaMagic size={30} color="#FF7EB9" />)}
                </Box>
                <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                  {challenge.title}
                </Typography>
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  minHeight: '3.5em',
                  maxHeight: '5.5em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
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
                sx={{
                  fontWeight: 700,
                  color: '#B388FF',
                  borderRadius: 8,
                  background: '#F3E8FF',
                  '&:hover': { background: '#E1CFFF', color: '#7C3AED' },
                }}
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
                  onClick={() => handleCompleteChallenge(challenge)}
                  disabled={actionInProgress}
                  sx={{
                    fontWeight: 700,
                    borderRadius: 8,
                    background: '#C3F6C7',
                    color: '#2E7D32',
                    '&:hover': { background: '#A8E6A1', color: '#145C1E' },
                  }}
                >
                  Complete
                </Button>
              )}
            </CardActions>
          </Box>
        ))}
      </Box>

      {/* Detail dialog and snackbar components would go here */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Challenges;