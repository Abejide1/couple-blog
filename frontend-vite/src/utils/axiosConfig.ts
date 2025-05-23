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
  // For iOS/Android, cannot use localhost as it refers to the device itself
  if (isNativeMobile()) {
    // IMPORTANT: You must use your computer's actual local IP address here
    // Run 'ipconfig' on Windows or 'ifconfig' on Mac/Linux to find your IP
    // This allows your iOS device to reach your development server
    return 'http://172.26.127.246'; // REPLACE WITH YOUR ACTUAL LOCAL IP
    
    // When deploying to production, use your real API endpoint instead:
    // return 'https://your-actual-api-endpoint.com';
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
