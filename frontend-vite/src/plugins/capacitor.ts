/**
 * Capacitor plugin initialization for iOS app
 * Configures iOS-specific features while maintaining avatar-based profile approach
 */

import { isIOS, isNativeMobile } from '../utils/mobileUtils';
import { initializeNotifications } from '../utils/iosNotifications';

// Initialize all Capacitor plugins
export const initializeCapacitorPlugins = async () => {
  // Only run in mobile environment
  if (!isNativeMobile()) return;
  
  // iOS-specific initialization
  if (isIOS()) {
    // Initialize push notifications
    await initializeNotifications();
    
    // Set iOS status bar style
    try {
      // @ts-ignore - Capacitor API
      const { StatusBar } = window.Capacitor.Plugins;
      if (StatusBar) {
        // Set a style that works well with our app's pink theme
        StatusBar.setStyle({ style: 'DARK' });
        
        // Make the status bar overlay the app content
        StatusBar.setOverlaysWebView({ overlay: true });
      }
    } catch (error) {
      console.error('Error initializing StatusBar:', error);
    }
    
    // Configure iOS app startup behavior
    try {
      // @ts-ignore - Capacitor API
      const { App } = window.Capacitor.Plugins;
      if (App) {
        // Listen for app state changes
        App.addListener('appStateChange', ({ isActive }: { isActive: boolean }) => {
          console.log('App state changed. Is active?', isActive);
          
          // If coming back to active state, refresh avatar data
          if (isActive) {
            // This is where we'd refresh avatar data if needed
            // No photo handling needed - we use avatars instead
          }
        });
      }
    } catch (error) {
      console.error('Error setting up App listeners:', error);
    }
    
    // Disable screenshot feature in sensitive areas (optional)
    try {
      // @ts-ignore - Capacitor API
      const { ScreenReader } = window.Capacitor.Plugins;
      if (ScreenReader) {
        // We could optionally prevent screenshots in private sections
        // ScreenReader.isEnabled();
      }
    } catch (error) {
      // This is optional, so we just silently fail
    }
  }
};

// Apply iOS-specific visual adjustments
export const applyIOSVisualAdjustments = () => {
  if (!isIOS()) return;
  
  // Add iOS-specific body class
  document.body.classList.add('ios-app');
  
  // Configure safe area insets
  document.documentElement.style.setProperty(
    '--safe-area-inset-top',
    'env(safe-area-inset-top)'
  );
  document.documentElement.style.setProperty(
    '--safe-area-inset-bottom',
    'env(safe-area-inset-bottom)'
  );
  
  // Configure viewport for iOS
  const metaViewport = document.querySelector('meta[name=viewport]');
  if (metaViewport) {
    metaViewport.setAttribute(
      'content',
      'viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'
    );
  }
};
