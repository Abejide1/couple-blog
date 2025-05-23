# Couple Activities iOS App Installation Guide

## Introduction

This guide provides step-by-step instructions for finalizing and building the iOS version of your Couple Activities app. The app has been configured to maintain your avatar-based approach throughout the mobile experience, with no photo uploads required for user profiles.

## Prerequisites

- A Mac computer with macOS 10.15 or later
- Xcode 12 or later installed
- An Apple Developer account for app distribution
- CocoaPods installed (`sudo gem install cocoapods`)
- Node.js and npm installed

## Step 1: Transfer Your Project to a Mac

1. Clone your repository on a Mac:
   ```bash
   git clone https://github.com/Abejide1/couple-blog.git
   cd couple-blog
   ```

2. Install dependencies:
   ```bash
   cd frontend-vite
   npm install
   ```

3. Install Capacitor CLI globally:
   ```bash
   npm install -g @capacitor/cli
   ```

## Step 2: Build the Web App

1. Build your web application:
   ```bash
   npm run build
   ```

2. Sync the build with the iOS platform:
   ```bash
   npx cap sync ios
   ```

## Step 3: Set Up iOS-Specific Assets

1. Copy the iOS assets we created:
   ```bash
   cp -R ios-assets/* ios/App/App/
   ```

2. Update Info.plist with our customized version:
   ```bash
   cp ios-assets/Info.plist ios/App/App/Info.plist
   ```

3. Add app icon and splash screen:
   ```bash
   cp -R ios-assets/AppIcon.appiconset ios/App/App/Assets.xcassets/
   cp ios-assets/splash.storyboard ios/App/App/LaunchScreen.storyboard
   ```

## Step 4: Open and Configure the iOS Project

1. Open the iOS project in Xcode:
   ```bash
   npx cap open ios
   ```

2. In Xcode, select the App project in the Project navigator.

3. Select the App target and go to the "Signing & Capabilities" tab.

4. Sign in with your Apple Developer account.

5. Update the Bundle Identifier to match your app (e.g., "com.yourusername.coupleactivities").

6. Ensure the following capabilities are enabled:
   - Push Notifications
   - Background Modes (Background fetch, Remote notifications)

## Step 5: Install CocoaPods Dependencies

1. Navigate to the iOS project directory:
   ```bash
   cd ios/App
   ```

2. Install CocoaPods dependencies:
   ```bash
   pod install
   ```

## Step 6: Test the App

1. In Xcode, select a simulator or connected device.

2. Click the Play button to build and run the app.

3. Test all features, particularly the avatar creation system, to ensure it works properly on iOS.

## Step 7: Configure Push Notifications (Optional)

If you want to use push notifications:

1. Go to the Apple Developer portal and create an APNs key.

2. In Xcode, go to Signing & Capabilities and add the Push Notifications capability.

3. Configure your backend to send notifications that include avatar data rather than photos.

## Step 8: Prepare for App Store Submission

1. Update the app version and build number in Xcode.

2. Create App Store screenshots.

3. Prepare app metadata:
   - App name: "Couple Activities"
   - Description: Highlight that the app uses a custom avatar system rather than requiring photo uploads
   - Keywords: couple, relationship, activities, avatar, personalization
   - Privacy policy URL

4. In Xcode, select "Product" > "Archive" to create an app archive.

5. Use the Xcode Organizer to upload your build to App Store Connect.

## Important Notes About Your Avatar-Based Approach

- The app has been configured to use avatars rather than photo uploads for all user representations.
- The Info.plist has been set to indicate that camera and photo library access are not required.
- All notifications are designed to use avatar data rather than photos.
- The app includes iOS-specific optimizations for the avatar creation experience.

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Run `pod install` in the ios/App directory
   - Update CocoaPods with `sudo gem install cocoapods`

2. **Signing Issues**
   - Ensure your Apple Developer account is active
   - Verify the Bundle Identifier is unique

3. **App Crashes on Launch**
   - Check Xcode console for error messages
   - Verify Capacitor plugins are properly configured

4. **Avatar System Issues**
   - The avatar system is fully client-side, so no server integration is needed
   - Verify that localStorage is working properly on iOS

## Next Steps

After successfully building and testing your iOS app, you can:

1. Submit it to the App Store for review.
2. Set up a TestFlight beta testing program.
3. Continue enhancing the app with more iOS-specific features while maintaining your avatar-based approach.

## Support

If you encounter any issues, refer to the following resources:

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
