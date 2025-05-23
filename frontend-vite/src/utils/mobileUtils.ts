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
  document.body.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left)');
  document.body.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right)');
  
  // Fix content area scrolling issues on iOS
  document.documentElement.style.setProperty('overflow', 'auto');
  document.documentElement.style.setProperty('height', '100%');
  
  // Fix tap highlight color on iOS
  document.documentElement.style.setProperty('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');
};

// Configure avatar display for optimal mobile experience
// Maintains avatar-based approach (no photo uploads)
export const optimizeAvatarForMobile = (size?: number) => {
  if (!isNativeMobile()) return size || 40;
  
  // Increase avatar size on mobile for better touch targets
  // iOS needs minimum touch target of 44px
  const baseSize = size || 40;
  return Math.max(baseSize * 1.2, 44);
};

// Fix iOS-specific layout issues
export const fixIOSLayoutIssues = () => {
  if (!isIOS()) return;
  
  // Add event listener to adjust content when keyboard appears/disappears
  window.addEventListener('keyboardWillShow', (event: any) => {
    // @ts-ignore - Event details
    const keyboardHeight = event.keyboardHeight || 0;
    document.body.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
    document.body.classList.add('keyboard-visible');
  });
  
  window.addEventListener('keyboardWillHide', () => {
    document.body.style.setProperty('--keyboard-height', '0px');
    document.body.classList.remove('keyboard-visible');
  });
  
  // Fix iOS scroll bounce
  document.addEventListener('touchmove', (e) => {
    if (document.documentElement.classList.contains('lock-scroll')) {
      e.preventDefault();
    }
  }, { passive: false });
};

// Get iOS-safe dimensions accounting for notches and home indicator
export const getIOSSafeDimensions = () => {
  const width = window.innerWidth - 
    parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-left') || '0') - 
    parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-right') || '0');
  
  const height = window.innerHeight - 
    parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top') || '0') - 
    parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom') || '0');
  
  return { width, height };
};

// iOS gesture handling helpers with improved touch handling
export const addIOSSwipeGestures = (element: HTMLElement, onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void) => {
  if (!isIOS()) return;
  
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;
  let startTime = 0;
  let endTime = 0;
  
  // Prevent scroll interference during swipe
  element.style.touchAction = 'pan-y';
  
  element.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    startTime = Date.now();
  }, { passive: true });
  
  element.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    endTime = Date.now();
    handleSwipe();
  }, { passive: true });
  
  const handleSwipe = () => {
    const minSwipeDistance = 50;
    const maxSwipeTime = 300; // milliseconds
    const swipeTime = endTime - startTime;
    
    // Only register quick swipes for better UX
    if (swipeTime > maxSwipeTime) return;
    
    const horizontalDistance = Math.abs(touchEndX - touchStartX);
    const verticalDistance = Math.abs(touchEndY - touchStartY);
    
    // Determine if horizontal or vertical swipe based on which distance is greater
    if (horizontalDistance > verticalDistance) {
      // Horizontal swipe
      if (touchEndX < touchStartX - minSwipeDistance) {
        onSwipe('left');
      } else if (touchEndX > touchStartX + minSwipeDistance) {
        onSwipe('right');
      }
    } else {
      // Vertical swipe
      if (touchEndY < touchStartY - minSwipeDistance) {
        onSwipe('up');
      } else if (touchEndY > touchStartY + minSwipeDistance) {
        onSwipe('down');
      }
    }
  };
};
