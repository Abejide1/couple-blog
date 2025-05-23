/**
 * iOS Push Notification utilities for Couple Activities app
 * Used to notify users about relationship milestones and activities
 * Note: This maintains the app's preference for avatar-based user representation
 */

import { isIOS } from './mobileUtils';

// Types for push notification data
export interface NotificationData {
  title: string;
  body: string;
  type: 'milestone' | 'activity' | 'reminder' | 'system';
  data?: Record<string, any>;
  avatarKey?: string; // Uses stored avatar rather than uploaded images
}

// Check if push notifications are available
export const arePushNotificationsAvailable = (): boolean => {
  if (!isIOS()) return false;
  
  // @ts-ignore - Capacitor-specific property
  return !!window.Capacitor?.isPluginAvailable('PushNotifications');
};

// Request notification permissions
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!arePushNotificationsAvailable()) return false;
  
  try {
    // @ts-ignore - Capacitor-specific API
    const { PushNotifications } = window.Capacitor.Plugins;
    
    // Request permission
    const result = await PushNotifications.requestPermission();
    return result.granted;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Register for push notifications
export const registerForPushNotifications = async () => {
  if (!arePushNotificationsAvailable()) return;
  
  try {
    // @ts-ignore - Capacitor-specific API
    const { PushNotifications } = window.Capacitor.Plugins;
    
    // Register with Apple Push Notification service
    await PushNotifications.register();
    
    // Listen for push notification events
    PushNotifications.addListener('registration', (token: { value: string }) => {
      console.log('Push registration success, token:', token.value);
      // Store token in localStorage - we'll use this later to associate with user
      localStorage.setItem('pushNotificationToken', token.value);
    });
    
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error on registration:', error);
    });
    
    // Set up notification received handler
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: { title: string; body: string; data: any }) => {
        // Create and display the notification
        const { title, body, data } = notification;
        
        // If notification contains avatar data, we use our custom avatar display
        // instead of showing a photo (maintaining our avatar-based approach)
        if (data && data.avatarKey) {
          // We'll handle this in our custom notification display
          console.log('Using avatar for notification:', data.avatarKey);
        }
      }
    );
  } catch (error) {
    console.error('Error setting up push notifications:', error);
  }
};

// Schedule a local notification (for testing)
export const scheduleLocalNotification = async (data: NotificationData): Promise<boolean> => {
  if (!arePushNotificationsAvailable()) return false;
  
  try {
    // @ts-ignore - Capacitor-specific API
    const { LocalNotifications } = window.Capacitor.Plugins;
    
    await LocalNotifications.schedule({
      notifications: [
        {
          title: data.title,
          body: data.body,
          id: Date.now(),
          schedule: { at: new Date(Date.now() + 5000) },
          sound: 'default',
          attachments: null, // No photo attachments - we use avatars instead
          actionTypeId: '',
          extra: {
            ...data.data,
            type: data.type,
            avatarKey: data.avatarKey || null
          }
        }
      ]
    });
    
    return true;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return false;
  }
};

// Initialize notifications system
export const initializeNotifications = async () => {
  if (isIOS()) {
    const hasPermission = await requestNotificationPermission();
    if (hasPermission) {
      await registerForPushNotifications();
      return true;
    }
  }
  return false;
};
