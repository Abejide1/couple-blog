/**
 * API Configuration utility for iOS app
 * Ensures proper API connectivity in both web and iOS environments
 * while maintaining avatar-based profile approach
 */

import { isNativeMobile } from './mobileUtils';

// API base URL configuration
export const getApiBaseUrl = () => {
  // For iOS app, we need to use the actual server address, not localhost
  if (isNativeMobile()) {
    // Use your actual API server URL when deployed
    // This ensures iOS app connects properly to backend
    return 'https://couple-activities-api.herokuapp.com/api';
    
    // For local testing on iOS simulator with local server, you could use:
    // return 'http://localhost:3001/api';
  }
  
  // For web development
  return '/api';
};

// Enhanced fetch function for iOS compatibility
export const fetchWithConfig = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      // Add any auth tokens here if needed
      ...((options.headers as Record<string, string>) || {})
    },
    // Ensure credentials are included for auth
    credentials: 'include',
  };
  
  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    return response;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Simplified API request with timeout for iOS
export const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  try {
    // Add timeout for iOS requests to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 15000);
    });
    
    const fetchPromise = fetchWithConfig(endpoint, options);
    const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};
