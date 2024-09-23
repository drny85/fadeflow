import { ExpoConfig } from 'expo/config'
const config: ExpoConfig = {
    name: 'FadeFlow',
    slug: 'fadeflow',
    version: '1.0.0',
    scheme: 'fadeflow',
    web: {
        bundler: 'metro',
        output: 'static',
        favicon: './assets/favicon.png'
    },
    plugins: [
        'expo-router',
        'expo-font',
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
            'expo-dev-launcher',
            {
                launchMode: 'most-recent'
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
                merchantIdentifier: '',
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
        resizeMode: 'cover',
        backgroundColor: '#773344'
    },
    assetBundlePatterns: ['**/*'],

    ios: {
        supportsTablet: false,
        bundleIdentifier: 'net.robertdev.fadeflow',
        buildNumber: '1.0.0',
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
        url: 'https://u.expo.dev/cb7be3e3-9d35-412f-ad3b-064c09c29bfa'
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
    owner: 'drny85'
}

export default config
