/**
 * Axios configuration for iOS app
 * Ensures API requests work correctly on both web and iOS environments
 * while maintaining avatar-based profile approach
 */

import axios from 'axios';
import { Preferences } from '@capacitor/preferences';
import { isNativeMobile } from './mobileUtils';

// Create a function to get the proper base URL for the current environment
const getBaseURL = () => {
  if (isNativeMobile()) {
    // When running on iOS, we need to use your actual API server address
    // not localhost (which refers to the device itself on iOS)
    
    // For production:
    return 'https://couple-activities-api.herokuapp.com';
    
    // For testing with your local network:
    // return 'http://YOUR_COMPUTER_LOCAL_IP:8000';
    // Example: 'http://192.168.1.100:8000'
  }
  
  // For web development
  return 'http://localhost:8000';
};

// Create a configured axios instance
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  async (config) => {
    // Get couple code from storage using Preferences plugin
    const getFromStorage = async (key: string) => {
      try {
        const { value } = await Preferences.get({ key });
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error(`Error getting ${key} from storage:`, error);
        return null;
      }
    };

    // Get couple code from storage
    const coupleCode = await getFromStorage('coupleCode');

    // If couple code exists, add it to headers
    if (coupleCode) {
      config.headers['X-Couple-Code'] = coupleCode;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle network errors with fallback to local data
    if (error.code === 'ERR_NETWORK') {
      console.log('Network error detected, using local data fallback');
      
      // Return mock data to prevent app from crashing
      // This maintains the avatar-based approach by not relying on server images
      const url = error.config?.url || '';
      
      if (url.includes('/activities')) {
        return { data: getMockActivities() };
      }
      
      if (url.includes('/movies')) {
        return { data: getMockMovies() };
      }
      
      if (url.includes('/blog-entries')) {
        return { data: getMockBlogEntries() };
      }
    }
    
    return Promise.reject(error);
  }
);

// Mock data for offline mode
const getMockActivities = () => {
  return [
    { id: 1, title: 'Picnic in the Park', description: 'Enjoy a relaxing day outdoors', category: 'outdoors' },
    { id: 2, title: 'Movie Night', description: 'Watch your favorite film together', category: 'indoors' },
    { id: 3, title: 'Cooking Class', description: 'Learn to make a new dish together', category: 'indoors' }
  ];
};

const getMockMovies = () => {
  return [
    { id: 1, title: 'The Notebook', genre: 'Romance' },
    { id: 2, title: 'When Harry Met Sally', genre: 'Romance/Comedy' },
    { id: 3, title: 'La La Land', genre: 'Musical/Romance' }
  ];
};

const getMockBlogEntries = () => {
  return [
    { id: 1, title: 'Our First Vacation', content: 'It was amazing!', createdAt: '2023-05-15' },
    { id: 2, title: 'Anniversary Celebration', content: 'One year together!', createdAt: '2023-06-22' }
  ];
};

export default api;
