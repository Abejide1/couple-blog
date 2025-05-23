/**
 * Mobile-specific utilities for the Couple Activities app
 * Ensures consistent avatar-based UI across both web and mobile platforms
 */

// Detect if app is running in a Capacitor native shell
export const isNativeMobile = (): boolean => {
  // @ts-ignore - Window capacitor property
  return window.Capacitor?.isNative === true;
};

// Detect iOS platform specifically
export const isIOS = (): boolean => {
  if (!isNativeMobile()) return false;
  // @ts-ignore - Window capacitor property
  return window.Capacitor?.getPlatform() === 'ios';
};

// Apply iOS-specific UI adjustments
export const applyIOSUIAdjustments = () => {
  if (!isIOS()) return;
  
  // Add iOS-specific class to body for CSS targeting
  document.body.classList.add('ios-device');
  
  // Add safe area padding for notches and home indicators
  document.body.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
  document.body.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
};

// Configure avatar display for optimal mobile experience
export const optimizeAvatarForMobile = (size?: number) => {
  if (!isNativeMobile()) return size || 40;
  
  // Increase avatar size slightly on mobile for better touch targets
  return (size || 40) * 1.2;
};

// iOS gesture handling helpers
export const addIOSSwipeGestures = (element: HTMLElement, onSwipe: (direction: 'left' | 'right') => void) => {
  if (!isIOS()) return;
  
  let touchStartX = 0;
  let touchEndX = 0;
  
  element.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);
  
  element.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);
  
  const handleSwipe = () => {
    const minSwipeDistance = 50;
    if (touchEndX < touchStartX - minSwipeDistance) {
      onSwipe('left');
    }
    if (touchEndX > touchStartX + minSwipeDistance) {
      onSwipe('right');
    }
  };
};
