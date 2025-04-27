import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
  CardActions,
  Divider,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
} from '@mui/material';
import { FaTrophy, FaRegCheckCircle, FaRegClock, FaInfoCircle, FaMagic, FaPlus, FaTrash } from 'react-icons/fa';
import { goalsApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Goals = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [newGoal, setNewGoal] = useState('');
  const [addingGoal, setAddingGoal] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const response = await goalsApi.getAll();
      setGoals(response.data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to load goals.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.trim()) return;
    setActionInProgress(true);
    try {
      await goalsApi.create({ title: newGoal });
      setSnackbar({ open: true, message: 'Goal added!', severity: 'success' });
      setNewGoal('');
      fetchGoals();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to add goal.', severity: 'error' });
    } finally {
      setActionInProgress(false);
    }
  };

  const handleCompleteGoal = async (goal: any) => {
    setActionInProgress(true);
    try {
      await goalsApi.complete(goal.id);
      setSnackbar({ open: true, message: 'Goal completed!', severity: 'success' });
      fetchGoals();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to complete goal.', severity: 'error' });
    } finally {
      setActionInProgress(false);
    }
  };

  const handleDeleteGoal = async (goal: any) => {
    setActionInProgress(true);
    try {
      await goalsApi.delete(goal.id);
      setSnackbar({ open: true, message: 'Goal deleted!', severity: 'success' });
      fetchGoals();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete goal.', severity: 'error' });
    } finally {
      setActionInProgress(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: '#B388FF' }}>
        Couple Goals
      </Typography>
      <Typography variant="body1" paragraph>
        Set and track your shared goals as a couple!
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="New Goal"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          fullWidth
          disabled={actionInProgress}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaPlus />}
          onClick={handleAddGoal}
          disabled={actionInProgress || !newGoal.trim()}
        >
          Add
        </Button>
      </Box>

      <List>
        {goals.map((goal) => (
          <ListItem
            key={goal.id}
            sx={{
              mb: 2,
              bgcolor: goal.completed ? '#C3F6C7' : '#FFF6FB',
              borderRadius: 3,
              boxShadow: '0 2px 8px #FFD6E8',
              border: goal.completed ? '2px solid #2E7D32' : '1px solid #FFD6E8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1.5,
              textAlign: 'center',
              borderColor: goal.completed ? 'success.main' : undefined,
            }}
            secondaryAction={
              <Box sx={{ display: 'flex', gap: 1 }}>
                {!goal.completed && (
                  <IconButton
                    edge="end"
                    color="success"
                    onClick={() => handleCompleteGoal(goal)}
                    disabled={actionInProgress}
                  >
                    <FaRegCheckCircle />
                  </IconButton>
                )}
                <IconButton
                  edge="end"
                  color="error"
                  onClick={() => handleDeleteGoal(goal)}
                  disabled={actionInProgress}
                >
                  <FaTrash />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={
                <Typography
                  variant="h6"
                  sx={{
                    color: goal.completed ? '#2E7D32' : '#B388FF',
                    textDecoration: goal.completed ? 'line-through' : 'none',
                  }}
                >
                  {goal.title}
                </Typography>
              }
              secondary={
                goal.completed && (
                  <Chip
                    label="Completed"
                    color="success"
                    icon={<FaRegCheckCircle />}
                    sx={{
                      fontWeight: 'bold',
                      background: '#C3F6C7',
                      color: '#2E7D32',
                      fontSize: '1rem',
                      mt: 1,
                    }}
                  />
                )
              }
            />
          </ListItem>
        ))}
      </List>

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

export default Goals;