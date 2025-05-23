/**
 * Database Service for iOS app
 * Handles data operations with fallbacks for offline mode
 * Maintains avatar-based profiles (no photo uploads)
 */

import { fetchWithConfig, apiRequest } from '../utils/apiConfig';
import { saveAvatarData, getAvatarData, getCoupleData, saveCoupleData } from '../utils/storageManager';
import { AvatarOptions } from '../components/CustomizableAvatar';

// Interface for user data
interface UserData {
  id: string | number;
  display_name: string;
  email?: string;
  avatarOptions?: AvatarOptions;
  // No photo URL fields - we use avatars instead
}

// Interface for couple data
interface CoupleData {
  id: string | number;
  code: string;
  users: UserData[];
  createdAt: string;
}

// Save user avatar (following avatar-based approach, not photo uploads)
export const saveUserAvatar = async (userId: string, avatarOptions: AvatarOptions): Promise<boolean> => {
  // Always save locally first (following avatar-based approach)
  const localSaveSuccess = await saveAvatarData(avatarOptions);
  
  // Then try to sync with server if available
  try {
    const response = await fetchWithConfig(`/users/${userId}/avatar`, {
      method: 'POST',
      body: JSON.stringify({ avatarOptions })
    });
    
    return response.ok;
  } catch (error) {
    console.log('Could not sync avatar with server, but saved locally:', error);
    // Local save was successful, so user won't lose their avatar data
    return localSaveSuccess;
  }
};

// Get user avatar (from local storage first, then try server)
export const getUserAvatar = async (userId: string): Promise<AvatarOptions | null> => {
  // Try local storage first for immediate display
  const localAvatar = await getAvatarData();
  if (localAvatar) return localAvatar;
  
  // If not in local storage, try to fetch from server
  try {
    const data = await apiRequest<{avatarOptions: AvatarOptions}>(`/users/${userId}/avatar`);
    if (data && data.avatarOptions) {
      // Save to local storage for future use
      await saveAvatarData(data.avatarOptions);
      return data.avatarOptions;
    }
  } catch (error) {
    console.error('Error fetching avatar from server:', error);
  }
  
  return null;
};

// Connect with partner via couple code
export const connectWithPartner = async (coupleCode: string): Promise<CoupleData | null> => {
  // Save code locally first
  await saveCoupleData(coupleCode);
  
  // Try to connect with server
  try {
    const data = await apiRequest<CoupleData>('/couples/connect', {
      method: 'POST',
      body: JSON.stringify({ code: coupleCode })
    });
    
    return data;
  } catch (error) {
    console.error('Error connecting with partner:', error);
    // Return fallback with just the code saved locally
    return {
      id: 'local-only',
      code: coupleCode,
      users: [],
      createdAt: new Date().toISOString()
    };
  }
};

// Get couple data (with fallback to local storage)
export const getCouple = async (): Promise<CoupleData | null> => {
  // Get locally stored couple code
  const coupleCode = await getCoupleData();
  if (!coupleCode) return null;
  
  // Try to get full data from server
  try {
    const data = await apiRequest<CoupleData>(`/couples/${coupleCode}`);
    return data;
  } catch (error) {
    console.error('Error fetching couple data:', error);
    // Return fallback with just the code saved locally
    return {
      id: 'local-only',
      code: coupleCode,
      users: [],
      createdAt: new Date().toISOString()
    };
  }
};

// Save milestone to timeline
export const saveTimelineMilestone = async (milestone: any): Promise<boolean> => {
  // Get locally stored milestones
  const storedMilestones = localStorage.getItem(`milestones-${milestone.coupleId}`);
  let milestones = storedMilestones ? JSON.parse(storedMilestones) : [];
  
  // Add new milestone to local storage
  milestones.push(milestone);
  localStorage.setItem(`milestones-${milestone.coupleId}`, JSON.stringify(milestones));
  
  // Try to sync with server
  try {
    const response = await fetchWithConfig('/milestones', {
      method: 'POST',
      body: JSON.stringify(milestone)
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error saving milestone to server:', error);
    // Still saved locally
    return true;
  }
};

// Get all milestones for a couple
export const getTimelineMilestones = async (coupleId: string): Promise<any[]> => {
  // Get locally stored milestones first
  const storedMilestones = localStorage.getItem(`milestones-${coupleId}`);
  let milestones = storedMilestones ? JSON.parse(storedMilestones) : [];
  
  // Try to get from server and update local copy
  try {
    const serverMilestones = await apiRequest<any[]>(`/milestones/${coupleId}`);
    if (serverMilestones && serverMilestones.length > 0) {
      // Update local storage with server data
      localStorage.setItem(`milestones-${coupleId}`, JSON.stringify(serverMilestones));
      return serverMilestones;
    }
  } catch (error) {
    console.error('Error fetching milestones from server:', error);
    // Use local milestones as fallback
  }
  
  return milestones;
};
