// Application type definitions

export interface Activity {
  id: number;
  title: string;
  description: string;
  category: string;
  status: 'planned' | 'completed';
  created_at: string;
  couple_code?: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  genre?: string;
  status: 'to_read' | 'reading' | 'completed';
  review?: string;
  rating?: number;
  created_at: string;
  couple_code?: string;
}

export interface Movie {
  id: number;
  title: string;
  genre?: string;
  status: 'to_watch' | 'watched';
  review?: string;
  rating?: number;
  created_at: string;
  couple_code?: string;
}

export interface BlogEntry {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  couple_code?: string;
  created_by?: string;
}
