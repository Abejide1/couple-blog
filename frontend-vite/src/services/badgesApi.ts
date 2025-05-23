import api from '../utils/axiosConfig';

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
