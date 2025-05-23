import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.coupleactivities.app',
  appName: 'Couple Activities',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'localhost'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FFD6E8',
      showSpinner: true,
      spinnerColor: '#FF7EB9',
    },
    // Disable Camera since we're using avatars instead of photo uploads
    Camera: {
      includeVideos: false,
      includeImages: false
    },
  },
  ios: {
    contentInset: 'always',
    scheme: 'CoupleActivities',
    backgroundColor: '#FFF6FB',
    preferredContentMode: 'mobile'
  }
};

export default config;
