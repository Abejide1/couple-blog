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
    MenuItem,
    Box,
    Rating
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Movie } from '../types';
import { moviesApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Movies = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [newMovie, setNewMovie] = useState<Omit<Movie, 'id' | 'created_at'>>({
        title: '',
        genre: '',
        status: 'to_watch' as const,
        review: '',
        rating: 0
    });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const fetchMovies = async () => {
        try {
            const response = await moviesApi.getAll();
            setMovies(response.data);
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleSubmit = async () => {
        setSubmitLoading(true);
        setErrorMsg(null);
        const coupleCode = localStorage.getItem('coupleCode');
        if (!coupleCode) {
            setErrorMsg('Please enter your couple code first.');
            setSubmitLoading(false);
            return;
        }
        try {
            await moviesApi.create({ ...newMovie, couple_code: coupleCode });
            setOpen(false);
            setNewMovie({ title: '', genre: '', status: 'to_watch', review: '', rating: 0 });
            fetchMovies();
        } catch (error: any) {
            setErrorMsg(error?.response?.data?.detail || 'Failed to add movie.');
            console.error('Error creating movie:', error);
        } finally {
            setSubmitLoading(false);
        }
    };


    if (loading) return <LoadingSpinner />;

    return (
        <>
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
                    <Grid key={movie.id} sx={{ gridColumn: { xs: '1 / -1', sm: 'span 6', md: 'span 4' } }}>
                        <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    bgcolor: movie.status === 'watched' ? 'success.light' : 'background.paper'
                                }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    {movie.title}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                                    Genre: {movie.genre}
                                </Typography>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="body2" color="primary">
                                        Status: {movie.status.replace('_', ' ')}
                                    </Typography>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => {
                                            const nextStatus = movie.status === 'to_watch' ? 'watched' : 'to_watch';
                                            moviesApi.update(movie.id, { status: nextStatus })
                                                .then(() => fetchMovies())
                                                .catch(error => console.error('Error updating movie:', error));
                                        }}
                                    >
                                        {movie.status === 'to_watch' ? 'Mark Watched' : 'Watch Again'}
                                    </Button>
                                </Box>

                                {(movie.status === 'watched' || movie.rating) && (
                                    <Box mt={2}>
                                        <Typography component="legend">Your Rating</Typography>
                                        <Rating
                                            value={movie.rating || 0}
                                            onChange={(_, value) => {
                                                if (value !== null) {
                                                    moviesApi.update(movie.id, { status: movie.status, rating: value })
                                                        .then(() => fetchMovies())
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
                                                moviesApi.update(movie.id, { status: movie.status, review: e.target.value })
                                                    .then(() => fetchMovies())
                                                    .catch(error => console.error('Error updating review:', error));
                                            }}
                                        />
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add New Movie</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={newMovie.title}
                        onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Genre"
                        fullWidth
                        value={newMovie.genre}
                        onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                    />
                    <TextField
                        select
                        margin="dense"
                        label="Status"
                        fullWidth
                        value={newMovie.status}
                        onChange={(e) => setNewMovie({ ...newMovie, status: e.target.value as 'to_watch' | 'watched' })}
                    >
                        <MenuItem value="to_watch">To Watch</MenuItem>
                        <MenuItem value="watched">Watched</MenuItem>
                    </TextField>
                    {newMovie.status === 'watched' && (
                        <>
                            <Box mt={2}>
                                <Typography component="legend">Rating</Typography>
                                <Rating
                                    value={newMovie.rating}
                                    onChange={(_, value) => setNewMovie({ ...newMovie, rating: value || 0 })}
                                />
                            </Box>
                            <TextField
                                margin="dense"
                                label="Review"
                                fullWidth
                                multiline
                                rows={4}
                                value={newMovie.review}
                                onChange={(e) => setNewMovie({ ...newMovie, review: e.target.value })}
                            />
                        </>
                    )}
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
};

export default Movies;
