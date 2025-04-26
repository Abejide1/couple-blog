import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
});

export interface BadgeProgress {
  [key: string]: boolean;
}

export const badgesApi = {
  get: async () => {
    const res = await api.get<BadgeProgress>('/badges/progress');
    return res.data;
  },
  update: async (progress: BadgeProgress) => {
    await api.post('/badges/progress', progress);
  }
};
