import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Rating,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LoadingSpinner from '../components/LoadingSpinner';
import booksApi from '../api/booksApi';

interface Book {
  id: number;
  title: string;
  author: string;
  status: 'to_read' | 'reading' | 'completed';
  review?: string;
  rating?: number;
}

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newBook, setNewBook] = useState<{ title: string; author: string; status: 'to_read' | 'reading' | 'completed'; review?: string; rating?: number }>({
    title: '',
    author: '',
    status: 'to_read',
    review: '',
    rating: 0,
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await booksApi.getAll();
      setBooks(res.data);
    } catch (error) {
      setErrorMsg('Failed to fetch books.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setErrorMsg('');
    try {
      await booksApi.create(newBook);
      setOpen(false);
      setNewBook({ title: '', author: '', status: 'to_read', review: '', rating: 0 });
      fetchBooks();
      setSnackbarOpen(true);
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.detail || 'Failed to add book.');
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

      {/* Bubble-style flexbox layout */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 2, sm: 3 },
          justifyContent: 'center',
          width: '100%',
          mt: 2,
        }}
      >
        {books.map((book) => (
          <Box
            key={book.id}
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
              {book.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              by {book.author}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 1 }}>
              {book.status && (
                <Chip
                  label={book.status}
                  size="small"
                  color={
                    book.status === 'completed'
                      ? 'success'
                      : book.status === 'reading'
                      ? 'primary'
                      : 'default'
                  }
                />
              )}
            </Box>
            {(book.status === 'completed' || book.rating) && (
              <Box mt={1}>
                <Typography component="legend" sx={{ fontSize: 12 }}>
                  Your Rating
                </Typography>
                <Rating
                  value={book.rating || 0}
                  size="small"
                  onChange={(_, value) => {
                    if (value !== null) {
                      booksApi
                        .update(book.id, { status: book.status, rating: value })
                        .then(() => fetchBooks())
                        .catch((error) => console.error('Error updating rating:', error));
                    }
                  }}
                />
              </Box>
            )}
            {(book.status === 'completed' || book.review) && (
              <Box mt={1}>
                <TextField
                  label="Your Review"
                  multiline
                  rows={2}
                  fullWidth
                  value={book.review || ''}
                  size="small"
                  onChange={(e) => {
                    booksApi
                      .update(book.id, { status: book.status, review: e.target.value })
                      .then(() => fetchBooks())
                      .catch((error) => console.error('Error updating review:', error));
                  }}
                />
              </Box>
            )}
            <Button
              size="small"
              variant="outlined"
              sx={{ mt: 1, borderRadius: 8, fontWeight: 700 }}
              onClick={() => {
                const nextStatus =
                  book.status === 'to_read'
                    ? 'reading'
                    : book.status === 'reading'
                    ? 'completed'
                    : 'to_read';
                booksApi
                  .update(book.id, { status: nextStatus })
                  .then(() => fetchBooks())
                  .catch((error) => console.error('Error updating book:', error));
              }}
            >
              {book.status === 'to_read'
                ? 'Start Reading'
                : book.status === 'reading'
                ? 'Mark Complete'
                : 'Read Again'}
            </Button>
          </Box>
        ))}
      </Box>

      {/* Add Book Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Book</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Author"
              fullWidth
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              required
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
            {errorMsg && (
              <Box mt={2} color="error.main">
                <Typography color="error">{errorMsg}</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} disabled={submitLoading}>
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={submitLoading}>
              {submitLoading ? 'Adding...' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Book added!"
      />
    </>
  );
};

export default Books;