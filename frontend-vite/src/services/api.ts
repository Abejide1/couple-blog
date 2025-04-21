import axios from 'axios';
import { Activity, Book, Movie, BlogEntry } from '../types';

const API_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor to include couple code
api.interceptors.request.use((config) => {
    const coupleCode = localStorage.getItem('coupleCode');
    if (coupleCode) {
        config.params = { ...config.params, code: coupleCode };
    }
    return config;
});

export const activitiesApi = {
    getAll: () => api.get<Activity[]>('/activities/'),
    create: (activity: Omit<Activity, 'id' | 'created_at'>) => 
        api.post<Activity>('/activities/', activity),
    update: (id: number, status: 'planned' | 'completed') =>
        api.patch<Activity>(`/activities/${id}`, { status }),
};

export const booksApi = {
    getAll: () => api.get<Book[]>('/books/'),
    create: (book: Omit<Book, 'id' | 'created_at'>) => 
        api.post<Book>('/books/', book),
    update: (id: number, update: { status: 'to_read' | 'reading' | 'completed', review?: string, rating?: number }) =>
        api.patch<Book>(`/books/${id}`, update),
};

export const moviesApi = {
    getAll: () => api.get<Movie[]>('/movies/'),
    create: (movie: Omit<Movie, 'id' | 'created_at'>) => 
        api.post<Movie>('/movies/', movie),
    update: (id: number, update: { status: 'to_watch' | 'watched', review?: string, rating?: number }) =>
        api.patch<Movie>(`/movies/${id}`, update),
};

export const blogApi = {
    getAll: () => api.get<BlogEntry[]>('/blog-entries/'),
    create: (entry: Omit<BlogEntry, 'id' | 'created_at'>) => 
        api.post<BlogEntry>('/blog-entries/', entry),
};
