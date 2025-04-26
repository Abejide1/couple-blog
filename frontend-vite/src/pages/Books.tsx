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
import { Book } from '../types';
import { booksApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { badgesApi } from '../services/badgesApi';

const Books = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [newBook, setNewBook] = useState<Omit<Book, 'id' | 'created_at'>>({
        title: '',
        author: '',
        status: 'to_read' as const,
        review: '',
        rating: 0
    });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const fetchBooks = async () => {
        try {
            const response = await booksApi.getAll();
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleSubmit = async () => {
        // BADGE LOGIC: Bookworms badge
        let badges: Record<string, boolean> = {};
        try {
            badges = await badgesApi.get();
        } catch {}

        setSubmitLoading(true);
        setErrorMsg(null);
        const coupleCode = localStorage.getItem('coupleCode');
        if (!coupleCode) {
            setErrorMsg('Please enter your couple code first.');
            setSubmitLoading(false);
            return;
        }
        try {
            await booksApi.create(newBook);
            // Check for badge: 5 completed books
            const booksAfter = await booksApi.getAll();
            const completedBooks = booksAfter.data.filter((b: any) => b.status === 'completed').length;
            if (!badges.bookworms && completedBooks >= 5) {
                await badgesApi.update({ ...badges, bookworms: true });
            }
            setOpen(false);
            setNewBook({ title: '', author: '', status: 'to_read', review: '', rating: 0 });
            fetchBooks();
        } catch (error: any) {
            setErrorMsg(error?.response?.data?.detail || 'Failed to add book.');
            console.error('Error creating book:', error);
        } finally {
            setSubmitLoading(false);
        }
    };


    if (loading) return <LoadingSpinner />;

    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Books</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                >
                    Add Book
                </Button>
            </Box>

            <Box sx={{
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: { xs: 2, sm: 3 },
  width: '100%',
  mt: 2,
}}>
  {books.map((book) => (
    <Box
      key={book.id}
      sx={{
        width: { xs: 170, sm: 200 },
        height: { xs: 170, sm: 200 },
        bgcolor: book.status === 'completed' ? '#C3F6C7' : book.status === 'reading' ? '#E3F6FC' : '#FFF6FB',
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
      <Typography variant="h6" fontWeight={700} sx={{ color: '#B388FF', mb: 1, fontSize: { xs: '1rem', sm: '1.15rem' } }}>
        {book.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
        by {book.author}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>{book.status.toUpperCase()}</Typography>
      {book.rating > 0 && <Rating value={book.rating} readOnly size="small" sx={{ mb: 1 }} />}
      {book.review && <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.95rem' } }}>{book.review}</Typography>}
    </Box>
  ))}
</Box>
                                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                                    by {book.author}
                                </Typography>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="body2" color="primary">
                                        Status: {book.status.replace('_', ' ')}
                                    </Typography>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => {
                                            const nextStatus = {
                                                'to_read': 'reading',
                                                'reading': 'completed',
                                                'completed': 'to_read'
                                            }[book.status] as 'to_read' | 'reading' | 'completed';
                                            
                                            booksApi.update(book.id, { status: nextStatus })
                                                .then(() => fetchBooks())
                                                .catch(error => console.error('Error updating book:', error));
                                        }}
                                    >
                                        {book.status === 'to_read' ? 'Start Reading' :
                                         book.status === 'reading' ? 'Mark Complete' :
                                         'Read Again'}
                                    </Button>
                                </Box>

                                {(book.status === 'completed' || book.rating) && (
                                    <Box mt={2}>
                                        <Typography component="legend">Your Rating</Typography>
                                        <Rating
                                            value={book.rating || 0}
                                            onChange={(_, value) => {
                                                if (value !== null) {
                                                    booksApi.update(book.id, { status: book.status, rating: value })
                                                        .then(() => fetchBooks())
                                                        .catch(error => console.error('Error updating rating:', error));
                                                }
                                            }}
                                        />
                                    </Box>
                                )}
                                {(book.status === 'completed' || book.review) && (
                                    <Box mt={2}>
                                        <TextField
                                            label="Your Review"
                                            multiline
                                            rows={3}
                                            fullWidth
                                            value={book.review || ''}
                                            onChange={(e) => {
                                                booksApi.update(book.id, { status: book.status, review: e.target.value })
                                                    .then(() => fetchBooks())
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
                <DialogTitle>Add New Book</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={newBook.title}
                        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Author"
                        fullWidth
                        value={newBook.author}
                        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    />
                    <TextField
                        select
                        margin="dense"
                        label="Status"
                        fullWidth
                        value={newBook.status}
                        onChange={(e) => setNewBook({ ...newBook, status: e.target.value as 'to_read' | 'reading' | 'completed' })}
                    >
                        <MenuItem value="to_read">To Read</MenuItem>
                        <MenuItem value="reading">Reading</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                    </TextField>
                    {newBook.status === 'completed' && (
                        <>
                            <Box mt={2}>
                                <Typography component="legend">Rating</Typography>
                                <Rating
                                    value={newBook.rating}
                                    onChange={(_, value) => setNewBook({ ...newBook, rating: value || 0 })}
                                />
                            </Box>
                            <TextField
                                margin="dense"
                                label="Review"
                                fullWidth
                                multiline
                                rows={4}
                                value={newBook.review}
                                onChange={(e) => setNewBook({ ...newBook, review: e.target.value })}
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

export default Books;
