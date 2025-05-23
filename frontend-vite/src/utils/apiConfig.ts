/**
 * API Configuration utility for iOS app
 * Ensures proper API connectivity in both web and iOS environments
 * while maintaining avatar-based profile approach
 */

import api from './axiosConfig';
import { isNativeMobile } from './mobileUtils';

// Get API base URL for iOS/web
export function getApiBaseUrl() {
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

// Use api instance for all API requests
export async function fetchWithConfig(url: string, options?: any) {
  // Only support GET/POST for now
  if (!options || !options.method || options.method === 'GET') {
    const response = await api.get(url, options);
    return response.data;
  } else if (options.method === 'POST') {
    const response = await api.post(url, options.body ? JSON.parse(options.body) : undefined, options);
    return response.data;
  } else if (options.method === 'PUT') {
    const response = await api.put(url, options.body ? JSON.parse(options.body) : undefined, options);
    return response.data;
  } else if (options.method === 'DELETE') {
    const response = await api.delete(url, options);
    return response.data;
  }
  throw new Error('Unsupported method in fetchWithConfig');
};

// Simplified API request with timeout for iOS
export const apiRequest = async <T>(endpoint: string, options: any = {}): Promise<T> => {
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
