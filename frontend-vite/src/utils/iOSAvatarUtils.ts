/**
 * iOS-specific utilities for avatar customization
 * Ensures a great user experience for avatar creation on iOS devices
 * (maintaining app's preference for avatars over photo uploads)
 */

import { AvatarOptions } from '../components/CustomizableAvatar';
import { isIOS } from './mobileUtils';

// Optimize touch interactions for avatar customization on iOS
export const setupIOSTouchHandlers = (element: HTMLElement) => {
  if (!isIOS()) return;
  
  // Prevent unwanted zooming when tapping avatar options
  element.addEventListener('touchstart', (e) => {
    if ((e.target as HTMLElement).tagName === 'BUTTON' || 
        (e.target as HTMLElement).tagName === 'SELECT') {
      e.preventDefault();
    }
  }, { passive: false });

  // Add haptic feedback for iOS avatar customization
  const selects = element.querySelectorAll('select');
  selects.forEach(select => {
    select.addEventListener('change', () => {
      // @ts-ignore - This will work on iOS but TypeScript doesn't know about it
      if (window.navigator && window.navigator.vibrate) {
        // Light haptic feedback when changing avatar options
        window.navigator.vibrate(10);
      }
    });
  });
};

// Optimize avatar rendering for iOS devices
export const optimizeAvatarForIOS = (options: AvatarOptions): AvatarOptions => {
  if (!isIOS()) return options;
  
  // Some subtle enhancements for iOS devices that improve rendering
  return {
    ...options,
    // No changes to the actual options, just making the function available
    // for future iOS-specific optimizations
  };
};

// Save avatar with iOS-specific metadata
export const saveAvatarWithIOSMetadata = (options: AvatarOptions) => {
  const avatarData = {
    ...options,
    // Add metadata but don't change the core avatar approach
    platform: 'ios',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  };
  
  localStorage.setItem('userAvatarOptions', JSON.stringify(avatarData));
  return avatarData;
};

// Setup iOS-optimized scrolling for avatar customization screens
export const setupIOSScrolling = (element: HTMLElement) => {
  if (!isIOS()) return;
  
  // Add iOS-friendly momentum scrolling
  // @ts-ignore - WebkitOverflowScrolling exists on iOS but TypeScript doesn't recognize it
  element.style.WebkitOverflowScrolling = 'touch';
  
  // Prevent scrolling issues on iOS
  document.body.addEventListener('touchmove', (e) => {
    // Allow scrolling in the avatar customization element
    if (element.contains(e.target as Node)) return;
    
    // Prevent unwanted body scrolling when interacting with avatar
    if (element === e.target || element.contains(e.target as Node)) {
      e.preventDefault();
    }
  }, { passive: false });
};
