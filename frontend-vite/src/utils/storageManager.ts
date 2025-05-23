/**
 * Storage Manager for iOS app
 * Ensures avatar data is saved and retrieved reliably across platforms
 * Maintains avatar-based profiles (no photo uploads)
 */

import { isNativeMobile } from './mobileUtils';
import { AvatarOptions } from '../components/CustomizableAvatar';

// Save avatar configuration data (maintains avatar-based approach)
export const saveAvatarData = async (avatarOptions: AvatarOptions) => {
  try {
    // Always save to localStorage first
    localStorage.setItem('userAvatarOptions', JSON.stringify(avatarOptions));
    
    // If on iOS, also store in Capacitor Storage for redundancy
    if (isNativeMobile()) {
      try {
        // @ts-ignore - Capacitor specific API
        const { Storage } = window.Capacitor.Plugins;
        if (Storage) {
          await Storage.set({
            key: 'userAvatarOptions',
            value: JSON.stringify(avatarOptions)
          });
        }
      } catch (capacitorError) {
        console.error('Capacitor storage error:', capacitorError);
        // Still succeeded with localStorage
        return true;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error saving avatar data:', error);
    return false;
  }
};

// Get avatar configuration data
export const getAvatarData = async (): Promise<AvatarOptions | null> => {
  try {
    // Try localStorage first (works in web and iOS)
    const localData = localStorage.getItem('userAvatarOptions');
    if (localData) {
      return JSON.parse(localData) as AvatarOptions;
    }
    
    // If on iOS and no localStorage, try Capacitor Storage
    if (isNativeMobile()) {
      try {
        // @ts-ignore - Capacitor specific API
        const { Storage } = window.Capacitor.Plugins;
        if (Storage) {
          const result = await Storage.get({ key: 'userAvatarOptions' });
          if (result && result.value) {
            return JSON.parse(result.value) as AvatarOptions;
          }
        }
      } catch (capacitorError) {
        console.error('Capacitor storage retrieval error:', capacitorError);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving avatar data:', error);
    return null;
  }
};

// Clear avatar data from all storage locations
export const clearAvatarData = async (): Promise<boolean> => {
  try {
    // Clear from localStorage
    localStorage.removeItem('userAvatarOptions');
    
    // If on iOS, also clear from Capacitor Storage
    if (isNativeMobile()) {
      try {
        // @ts-ignore - Capacitor specific API
        const { Storage } = window.Capacitor.Plugins;
        if (Storage) {
          await Storage.remove({ key: 'userAvatarOptions' });
        }
      } catch (capacitorError) {
        console.error('Error clearing Capacitor storage:', capacitorError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing avatar data:', error);
    return false;
  }
};

// Store couple connection information
export const saveCoupleData = async (coupleCode: string): Promise<boolean> => {
  try {
    // Save in localStorage
    localStorage.setItem('coupleCode', coupleCode);
    
    // If on iOS, also save in Capacitor Storage
    if (isNativeMobile()) {
      try {
        // @ts-ignore - Capacitor specific API
        const { Storage } = window.Capacitor.Plugins;
        if (Storage) {
          await Storage.set({
            key: 'coupleCode',
            value: coupleCode
          });
        }
      } catch (capacitorError) {
        console.error('Capacitor storage error for couple data:', capacitorError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error saving couple data:', error);
    return false;
  }
};

// Retrieve couple connection information
export const getCoupleData = async (): Promise<string | null> => {
  try {
    // Try localStorage first
    const localData = localStorage.getItem('coupleCode');
    if (localData) return localData;
    
    // If on iOS and no localStorage, try Capacitor Storage
    if (isNativeMobile()) {
      try {
        // @ts-ignore - Capacitor specific API
        const { Storage } = window.Capacitor.Plugins;
        if (Storage) {
          const result = await Storage.get({ key: 'coupleCode' });
          if (result && result.value) return result.value;
        }
      } catch (capacitorError) {
        console.error('Error retrieving couple data from Capacitor:', capacitorError);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving couple data:', error);
    return null;
  }
};
