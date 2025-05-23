import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import {
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  Rating,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Movie } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const genreOptions = [
  'Romance', 'Comedy', 'Drama', 'Action', 'Adventure', 'Fantasy', 'Sci-Fi', 'Documentary', 'Other'
];

const statusOptions = [
  { value: 'to_watch', label: 'To Watch' },
  { value: 'watched', label: 'Watched' },
];

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newMovie, setNewMovie] = useState<Omit<Movie, 'id' | 'created_at'>>({
    title: '',
    genre: '',
    status: 'to_watch',
    review: '',
    rating: 0,
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await api.get('/movies/');
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([
          { id: 1, title: 'The Notebook', genre: 'Romance' },
          { id: 2, title: 'When Harry Met Sally', genre: 'Romance/Comedy' },
          { id: 3, title: 'La La Land', genre: 'Musical/Romance' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleDialogClose = () => {
    setOpen(false);
    setErrorMsg(null);
    setNewMovie({
      title: '',
      genre: '',
      status: 'to_watch',
      review: '',
      rating: 0,
    });
  };

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setErrorMsg(null);
    try {
      await api.post('/movies/', newMovie);
      handleDialogClose();
      const response = await api.get('/movies/');
      setMovies(response.data);
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.detail || 'Failed to add movie.');
      console.error('Error creating movie:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Movies</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Movie
        </Button>
      </Box>

      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
            <Box
              sx={{
                width: { xs: 170, sm: 200 },
                height: { xs: 170, sm: 200 },
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
              <Typography variant="h6" fontWeight={700} sx={{ color: '#B388FF', mb: 1 }}>
                {movie.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {movie.genre}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 1 }}>
                {movie.status && (
                  <Chip
                    label={movie.status === 'to_watch' ? 'To Watch' : 'Watched'}
                    size="small"
                    color={movie.status === 'watched' ? 'success' : 'default'}
                  />
                )}
              </Box>
              {(movie.status === 'watched' || movie.rating) && (
                <Box mt={2}>
                  <Typography component="legend">Your Rating</Typography>
                  <Rating
                    value={movie.rating || 0}
                    onChange={(_, value) => {
                      if (value !== null) {
                        api.put(`/movies/${movie.id}/`, { status: movie.status, rating: value })
                          .then(() => api.get('/movies/').then(response => setMovies(response.data)))
                          .catch(error => console.error('Error updating rating:', error));
                      }
                    }}
                  />
                </Box>
              )}
              {(movie.status === 'watched' || movie.review) && (
                <Box mt={2}>
                  <TextField
                    label="Your Review"
                    multiline
                    rows={3}
                    fullWidth
                    value={movie.review || ''}
                    onChange={(e) => {
                      api.put(`/movies/${movie.id}/`, { status: movie.status, review: e.target.value })
                        .then(() => api.get('/movies/').then(response => setMovies(response.data)))
                        .catch(error => console.error('Error updating review:', error));
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Add New Movie</DialogTitle>
        <form onSubmit={handleAddMovie}>
          <DialogContent>
            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              required
              value={newMovie.title}
              onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              select
              label="Genre"
              fullWidth
              required
              value={newMovie.genre}
              onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
              sx={{ mb: 2 }}
            >
              {genreOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Status"
              fullWidth
              value={newMovie.status}
              onChange={(e) => setNewMovie({ ...newMovie, status: e.target.value as 'to_watch' | 'watched' })}
              sx={{ mb: 2 }}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Review"
              multiline
              rows={3}
              fullWidth
              value={newMovie.review}
              onChange={(e) => setNewMovie({ ...newMovie, review: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography>Your Rating:</Typography>
              <Rating
                value={newMovie.rating}
                onChange={(_, value) => setNewMovie({ ...newMovie, rating: value || 0 })}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={submitLoading}>
              {submitLoading ? <CircularProgress size={22} /> : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Movies;