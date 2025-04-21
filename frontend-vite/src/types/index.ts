export type Category = 'outdoor' | 'indoor' | 'dining' | 'entertainment' | 'travel';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Cost = 'free' | 'low' | 'medium' | 'high';
export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'any';

export interface Activity {
    id: number;
    title: string;
    description: string;
    status: 'planned' | 'completed';
    category: Category;
    difficulty: Difficulty;
    duration: number;  // in minutes
    cost: Cost;
    season?: Season;
    created_at: string;
    completed_at?: string;
    rating?: number;
    notes?: string;
}

export interface Book {
    id: number;
    title: string;
    author: string;
    status: 'to_read' | 'reading' | 'completed';
    review?: string;
    rating?: number;
    created_at: string;
}

export interface Movie {
    id: number;
    title: string;
    genre: string;
    status: 'to_watch' | 'watched';
    review?: string;
    rating?: number;
    created_at: string;
}

export interface BlogEntry {
    id: number;
    title: string;
    content: string;
    author: string;
    created_at: string;
}
