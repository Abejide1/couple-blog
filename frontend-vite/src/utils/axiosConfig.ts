/**
 * Axios configuration for iOS app
 * Ensures API requests work correctly on both web and iOS environments
 * while maintaining avatar-based profile approach (no photo uploads)
 */

import axios from 'axios';
import { Preferences } from '@capacitor/preferences';
import { isNativeMobile } from './mobileUtils';

// Create a function to get the proper base URL for the current environment
const getBaseUrl = () => {
  // For iOS/Android and production web, use your public backend IP or domain
  // Replace this with your deployed backend domain if you have one (e.g., https://api.yourdomain.com)
  const PROD_API = 'http://52.41.36.82:8000'; // <-- Your backend's public IP

  if (isNativeMobile()) {
    return PROD_API;
  }

  // Optionally, use public API for production web builds as well
  if (process.env.NODE_ENV === 'production') {
    return PROD_API;
  }

  // For local development in browser
  return 'http://localhost:8000';
};

// Create axios instance with our base URL
const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,  // 15 second timeout for mobile networks
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Important for iOS network requests
  withCredentials: false
});

// Add runtime warning if baseURL is localhost on iOS
if (isNativeMobile() && getBaseUrl().includes('localhost')) {
  // eslint-disable-next-line no-console
  console.warn('[iOS WARNING] You are using localhost as your API base URL. This will not work on iOS devices. Use your computer\'s LAN IP instead.');
}

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

// Cache successful GET responses
api.interceptors.response.use((response) => {
  // Only cache GET requests
  if (response.config.method === 'get') {
    try {
      // Store in localStorage for offline access
      const cacheKey = `cache_${response.config.url}`;
      localStorage.setItem(cacheKey, JSON.stringify(response.data));
      
      // Also store in Preferences for iOS if available
      if (isNativeMobile()) {
        // Use async IIFE to handle the Promise
        (async () => {
          try {
            await Preferences.set({
              key: cacheKey,
              value: JSON.stringify(response.data)
            });
          } catch (err) {
            console.error('Error saving cache to Preferences:', err);
            // Not critical, we still have localStorage cache
          }
        })();
      }
    } catch (error) {
      console.error('Error caching response:', error);
    }
  }
  return response;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Check if we have an internet connection issue
    const isNetworkError = !navigator.onLine || 
                          (error.message && (
                            error.message.includes('Network Error') || 
                            error.code === 'ERR_NETWORK' || 
                            error.code === 'ECONNABORTED'
                          ));
    
    if (isNetworkError) {
      console.warn('Network error detected.');
      
      // Try to get cached data from localStorage
      try {
        const cacheKey = `cache_${error.config?.url || ''}`;
        const cachedData = localStorage.getItem(cacheKey);
        
        if (cachedData) {
          console.log('Using cached data from previous successful requests');
          return { 
            data: JSON.parse(cachedData),
            status: 200,
            statusText: 'OK (From Cache)',
            config: error.config,
            cached: true
          };
        }
      } catch (cacheError) {
        console.error('Error retrieving cached data:', cacheError);
      }
    }
    
    return Promise.reject(error);
  }
);

// No mock data as per user's request

export default api;
