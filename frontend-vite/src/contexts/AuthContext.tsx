import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axiosConfig';

interface User {
  id: number;
  email: string;
  display_name?: string;
  profile_pic?: string;
  couple_code?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  display_name?: string;
  couple_code?: string;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

// API_URL is now handled by the shared api instance

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const res = await axios.post(`${API_URL}/user/login`, new URLSearchParams({ username: email, password }));
    setToken(res.data.access_token);
    setUser(res.data.user);
    localStorage.setItem('token', res.data.access_token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setLoading(false);
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    const res = await axios.post(`${API_URL}/user/register`, data);
    // Auto-login after register
    await login(data.email, data.password);
    setLoading(false);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!token) return;
    const res = await axios.put(`${API_URL}/user/profile`, data, { headers: { Authorization: `Bearer ${token}` } });
    setUser(res.data);
    localStorage.setItem('user', JSON.stringify(res.data));
  };

  const refreshProfile = async () => {
    if (!token) return;
    const res = await axios.get(`${API_URL}/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
    setUser(res.data);
    localStorage.setItem('user', JSON.stringify(res.data));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
