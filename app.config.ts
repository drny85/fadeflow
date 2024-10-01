import { ExpoConfig } from 'expo/config'
const config: ExpoConfig = {
   name: 'FadeFlow',
   slug: 'fadeflow',
   version: '1.0.0',
   scheme: 'fadeflow',
   web: {
      bundler: 'metro',
      output: 'server',
      favicon: './assets/favicon.png'
   },
   plugins: [
      'expo-router',
      'expo-font',
      'expo-apple-authentication',
      [
         'expo-build-properties',
         {
            ios: {
               newArchEnabled: false
            },
            android: {
               newArchEnabled: false
            }
         }
      ],
      [
         'expo-image-picker',
         {
            photosPermission:
               'The app accesses your photos to let you share them with your friends or barber.'
         }
      ],
      [
         '@stripe/stripe-react-native',
         {
            merchantIdentifier: process.env.EXPO_PUBLIC_MERCHANT_ID,
            enableGooglePay: true
         }
      ],
      [
         'expo-location',
         {
            locationAlwaysAndWhenInUsePermission:
               'Allow $(PRODUCT_NAME) to use your location to show the distance to your favorite barber-shop.'
         }
      ]
   ],
   experiments: {
      typedRoutes: true,
      tsconfigPaths: true
   },
   orientation: 'portrait',
   icon: './assets/icon.png',
   userInterfaceStyle: 'automatic',
   splash: {
      image: './assets/splash.png',
      backgroundColor: '#1D3557'
   },
   assetBundlePatterns: ['**/*'],
   platforms: ['ios', 'android'],
   ios: {
      supportsTablet: false,
      usesAppleSignIn: true,
      bundleIdentifier: 'net.robertdev.fadeflow',
      infoPlist: {
         LSApplicationQueriesSchemes: ['tel'],
         NSLocationWhenInUseUsageDescription:
            'Allow $(PRODUCT_NAME) to use your location to show the distance to your favorite barber-shop.',
         NSLocationAlwaysAndWhenInUseUsageDescription:
            'Allow $(PRODUCT_NAME) to use your location to show the distance to your favorite barber-shop.'
      },
      config: {
         googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_API_IOS
      },
      googleServicesFile: './GoogleService-Info.plist',
      associatedDomains: ['applinks:fadeflow.vercel.app']
   },
   android: {
      adaptiveIcon: {
         foregroundImage: './assets/adaptive-icon.png',
         backgroundColor: '#ffffff'
      },
      softwareKeyboardLayoutMode: 'pan',
      package: 'net.robertdev.fadeflow',
      versionCode: 1,
      intentFilters: [
         {
            action: 'VIEW',
            autoVerify: true,
            data: [
               {
                  scheme: 'https',
                  host: 'fadeflow.vercel.app',
                  pathPrefix: '/'
               }
            ],
            category: ['BROWSABLE', 'DEFAULT']
         }
      ],
      config: {
         googleMaps: {
            apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_ANDROID
         }
      }
   },
   updates: {
      url: 'https://u.expo.dev/cb7be3e3-9d35-412f-ad3b-064c09c29bfa',
      enabled: true,
      checkAutomatically: 'ON_LOAD',
      fallbackToCacheTimeout: 0
   },
   extra: {
      eas: {
         projectId: 'cb7be3e3-9d35-412f-ad3b-064c09c29bfa'
      },
      router: {
         origin: false
      }
   },

   runtimeVersion: {
      policy: 'appVersion'
   },
   owner: 'drny85',
   jsEngine: 'hermes'
}

export default config
