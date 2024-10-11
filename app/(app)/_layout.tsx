import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { Feather } from '@expo/vector-icons'
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native'
import 'expo-dev-client'
import { useFonts } from 'expo-font'
import { router, Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { Fragment, useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Appearance, TouchableOpacity, View } from 'react-native'

import Loading from '~/components/Loading'
import { Text } from '~/components/nativewindui/Text'
import { ThemeToggle } from '~/components/nativewindui/ThemeToggle'
import { Fonts } from '~/constants/Fonts'
import '~/global.css'
import { useAppointments } from '~/hooks/useAppointments'
import { useLinking } from '~/hooks/useLinking'
import { useProtectedRoute } from '~/hooks/useProtectedRoutes'
import { useUser } from '~/hooks/useUser'
import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme'
import { i18n } from '~/locales/i18n'
import { translation } from '~/locales/translate'
import { useAuth } from '~/providers/AuthContext'
import { NAV_THEME } from '~/theme'
SplashScreen.preventAutoHideAsync().catch((e) => {
   console.log('errors from splashscreen', e)
})
export {
   // Catch any errors thrown by the Layout component.
   ErrorBoundary
} from 'expo-router'

export default function RootLayout() {
   useInitialAndroidBarSync()
   useLinking()
   useSchemeListener()
   useUser()
   useAppointments()
   const [loaded, error] = useFonts(Fonts)
   const { colorScheme, isDarkColorScheme, colors } = useColorScheme()
   const { loading, logOut } = useAuth()

   const { mounted } = useProtectedRoute()

   useEffect(() => {
      if (loaded && !error && mounted) {
         SplashScreen.hideAsync().catch((e) => {
            console.log('errors from splashscreen hide', e)
         })
      }
   }, [loaded, error, mounted])

   if (!loaded && !error) {
      return null
   }

   if (loading) return <Loading />
   // if (user && user.isBarber) return <Redirect href={'/(app)/(barber-tabs)'} />;

   return (
      <Fragment>
         <StatusBar
            key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
            style={isDarkColorScheme ? 'light' : 'dark'}
         />
         {/* WRAP YOUR APP WITH ANY ADDITIONAL PROVIDERS HERE */}
         {/* <ExampleProvider> */}
         <I18nextProvider i18n={i18n}>
            <ActionSheetProvider>
               <NavThemeProvider value={NAV_THEME[colorScheme]}>
                  <Stack screenOptions={{ ...SCREEN_OPTIONS }}>
                     <Stack.Screen name="(tabs)" options={TABS_OPTIONS} />
                     <Stack.Screen
                        name="(barber-tabs)"
                        options={TABS_OPTIONS}
                     />
                     <Stack.Screen name="(terms)" options={TABS_OPTIONS} />
                     <Stack.Screen name="(modals)" options={TABS_OPTIONS} />
                     <Stack.Screen
                        name="(profile)"
                        options={{
                           ...MODAL_OPTIONS,
                           headerStyle: {
                              backgroundColor: colors.background
                           },
                           headerBackTitle: 'Back',
                           headerRight: () => (
                              <View className="flex-row items-center gap-4">
                                 <Text
                                    onPress={() => {
                                       logOut()
                                       router.canDismiss() &&
                                          router.dismissAll()
                                    }}
                                 >
                                    {translation('profile', 'logout')}
                                 </Text>
                                 <ThemeToggle />
                              </View>
                           ),
                           headerLeft: () => (
                              <TouchableOpacity onPress={router.back}>
                                 <Feather
                                    name="chevron-left"
                                    className="p-1"
                                    size={26}
                                    color={
                                       isDarkColorScheme ? '#ffffff' : '#212121'
                                    }
                                 />
                              </TouchableOpacity>
                           )
                        }}
                     />
                     <Stack.Screen
                        name="(auth)"
                        options={{
                           headerBackTitle: 'Back',
                           title: '',
                           headerShadowVisible: false,
                           headerStyle: {
                              backgroundColor: colors.background
                           },
                           // headerTintColor: colors.grey,
                           headerTitleStyle: {
                              fontWeight: 'bold',
                              color: '#ffffff'
                           },
                           presentation: 'modal',
                           animation: 'slide_from_bottom',
                           //headerShown: false,
                           contentStyle: {
                              backgroundColor: colors.background
                           },
                           headerLeft: () => (
                              <TouchableOpacity onPress={router.back}>
                                 <Feather
                                    name="chevron-left"
                                    className="p-1"
                                    size={26}
                                    color={
                                       isDarkColorScheme ? '#ffffff' : '#212121'
                                    }
                                 />
                              </TouchableOpacity>
                           ),
                           headerRight: () => {
                              return <ThemeToggle />
                           }
                        }}
                     />
                     <Stack.Screen
                        name="subscription"
                        options={{
                           title: translation('subscription', 'title'),
                           headerShadowVisible: false,
                           headerStyle: {
                              backgroundColor: colors.background
                           },
                           // headerTintColor: colors.grey,
                           headerTitleStyle: {
                              fontWeight: 'bold',
                              color: isDarkColorScheme ? '#ffffff' : '#212121'
                           },
                           presentation: 'modal',
                           animation: 'slide_from_bottom',
                           //headerShown: false,
                           contentStyle: {
                              backgroundColor: colors.background
                           },
                           headerLeft: ({ canGoBack }) =>
                              canGoBack ? (
                                 <TouchableOpacity
                                    activeOpacity={0.3}
                                    onPress={() => router.back()}
                                 >
                                    <Feather
                                       className="p-1"
                                       name="chevron-left"
                                       size={26}
                                       color={
                                          isDarkColorScheme ? 'white' : 'black'
                                       }
                                    />
                                 </TouchableOpacity>
                              ) : null,

                           headerRight: () => {
                              return <ThemeToggle />
                           }
                        }}
                     />
                  </Stack>
               </NavThemeProvider>
            </ActionSheetProvider>
         </I18nextProvider>

         {/* </ExampleProvider> */}
      </Fragment>
   )
}

const SCREEN_OPTIONS = {
   animation: 'ios'
   // for android
} as const

const TABS_OPTIONS = {
   headerShown: false
} as const

const MODAL_OPTIONS = {
   presentation: 'modal',

   animation: 'fade_from_bottom', // for android
   title: translation('tabs', 'profile')
} as const

const useSchemeListener = () => {
   useEffect(() => {
      const listener = Appearance.addChangeListener(({ colorScheme }) => {
         Appearance.setColorScheme(colorScheme)
      })
      return () => {
         listener.remove()
      }
   }, [])
}
