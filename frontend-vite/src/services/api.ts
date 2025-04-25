import axios from 'axios';
import { Activity, Book, Movie, BlogEntry } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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

export interface CalendarEvent {
    id?: number;
    title: string;
    description?: string;
    start_time: Date | string;
    end_time?: Date | string;
    all_day: boolean;
    location?: string;
    event_type?: 'birthday' | 'anniversary' | 'date' | 'reminder' | 'appointment' | 'activity' | 'other';
    recurrence?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
    color?: string;
    reminder?: number;  // minutes before event
    shared: boolean;
    activity_id?: number;
    created_at?: Date | string;
    created_by?: string;
    couple_code?: string;
}

export const calendarApi = {
    getAll: (startDate?: Date, endDate?: Date) => {
        let params = {};
        if (startDate) params = { ...params, start_date: startDate.toISOString() };
        if (endDate) params = { ...params, end_date: endDate.toISOString() };
        return api.get<CalendarEvent[]>('/calendar/', { params });
    },
    create: (event: Omit<CalendarEvent, 'id' | 'created_at' | 'couple_code' | 'created_by'>) => 
        api.post<CalendarEvent>('/calendar/', event),
    update: (id: number, event: Partial<Omit<CalendarEvent, 'id' | 'created_at' | 'couple_code' | 'created_by'>>) => 
        api.put<CalendarEvent>(`/calendar/${id}`, event),
    delete: (id: number) => api.delete(`/calendar/${id}`)
};

// Challenge interfaces and API
export interface Challenge {
    id: number;
    title: string;
    description?: string;
    category?: string;
    points: number;
    icon?: string;
    active: boolean;
    created_at: Date | string;
}

export interface ChallengeWithProgress extends Challenge {
    started: boolean;
    completed: boolean;
    started_at?: Date | string;
    completed_at?: Date | string;
}

export interface ChallengeProgress {
    id: number;
    challenge_id: number;
    couple_code: string;
    started_at: Date | string;
    completed_at?: Date | string;
    progress_data?: string;
}

export const challengesApi = {
    getAll: () => api.get<ChallengeWithProgress[]>('/challenges/'),
    start: (challengeId: number) => api.post<ChallengeProgress>(`/challenges/${challengeId}/start`),
    complete: (challengeId: number, progressData?: { data: string }) => 
        api.post<ChallengeProgress>(`/challenges/${challengeId}/complete`, progressData)
};

// Goal interfaces and API
export interface Goal {
    id: number;
    title: string;
    description?: string;
    target_date?: Date | string;
    completed: boolean;
    priority?: string;
    category?: string;
    created_by?: string;
    created_at: Date | string;
    completed_at?: Date | string;
    couple_code: string;
}

export interface GoalCreate {
    title: string;
    description?: string;
    target_date?: Date | string;
    priority?: string;
    category?: string;
}

export interface GoalUpdate {
    title?: string;
    description?: string;
    target_date?: Date | string;
    completed?: boolean;
    priority?: string;
    category?: string;
}

export const goalsApi = {
    getAll: () => api.get<Goal[]>('/goals/'),
    create: (goal: GoalCreate) => api.post<Goal>('/goals/', goal),
    update: (id: number, goal: GoalUpdate) => api.put<Goal>(`/goals/${id}`, goal),
    delete: (id: number) => api.delete(`/goals/${id}`)
};
