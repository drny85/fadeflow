import { Icon } from '@roninoss/icons'
import { Redirect, Tabs } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { Image, Platform } from 'react-native'

import { TabBarIcon } from '../../../components/TabBarIcon'

import { useAppointments } from '~/hooks/useAppointments'
import { useNotifications } from '~/hooks/useNotification'
import { useColorScheme } from '~/lib/useColorScheme'
import { translation } from '~/locales/translate'
import { useAuth } from '~/providers/AuthContext'

export default function BarberTabLayout() {
   const { colors, isDarkColorScheme } = useColorScheme()
   const { user } = useAuth()
   useAppointments()
   useNotifications()

   if (!user) return <Redirect href="/(app)/(tabs)" />
   return (
      <Tabs
         screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: isDarkColorScheme
               ? colors.accent
               : colors.primary,
            tabBarInactiveTintColor: isDarkColorScheme
               ? '#ffffff'
               : colors.accent,
            tabBarStyle: { backgroundColor: colors.background },
            headerStyle: {
               backgroundColor: colors.background
            }
         }}
      >
         <Tabs.Screen
            name="barber-home"
            options={{
               unmountOnBlur: true,
               headerShown: false,
               title: translation('tabs', 'home'),
               tabBarIcon: ({ color, focused }) => (
                  <Image
                     source={require('~/assets/images/barbershop.png')}
                     tintColor={
                        focused
                           ? colors.primary
                           : isDarkColorScheme
                             ? '#ffffff'
                             : colors.accent
                     }
                     className="-mb-1 h-8 w-8"
                  />
               )
            }}
         />
         <Tabs.Screen
            name="barber-appointments"
            options={{
               title: translation('tabs', 'appointments'),
               headerShown: false,
               tabBarIcon: ({ size, focused }) => (
                  <Icon
                     name="calendar-clock"
                     size={size + 10}
                     color={
                        focused
                           ? colors.primary
                           : isDarkColorScheme
                             ? '#ffffff'
                             : colors.accent
                     }
                  />
               )
            }}
         />

         <Tabs.Screen
            name="gallery"
            options={{
               title: 'My Stuffs',
               headerShown: false,
               tabBarIcon: ({ size, focused }) =>
                  Platform.OS === 'ios' ? (
                     <SymbolView
                        name="rectangle.on.rectangle.badge.gearshape"
                        size={size + 8}
                        tintColor={
                           focused
                              ? colors.primary
                              : isDarkColorScheme
                                ? '#ffffff'
                                : colors.accent
                        }
                     />
                  ) : (
                     <TabBarIcon
                        name="stack-overflow"
                        color={
                           focused
                              ? colors.primary
                              : isDarkColorScheme
                                ? '#ffffff'
                                : colors.accent
                        }
                     />
                  )
            }}
         />
         <Tabs.Screen
            name="earnings"
            options={{
               title: 'Earnings',
               //headerShown: false,

               tabBarIcon: ({ size, focused }) => (
                  <Icon
                     name="chart-pie"
                     size={size + 10}
                     color={
                        focused
                           ? colors.primary
                           : isDarkColorScheme
                             ? '#ffffff'
                             : colors.accent
                     }
                  />
               )
            }}
         />

         <Tabs.Screen
            name="barber-profile"
            options={{
               title: 'Profile',
               headerShown: false,
               tabBarIcon: ({ focused }) =>
                  user && user.isBarber && user.image ? (
                     <Image
                        source={{ uri: user.image }}
                        className="h-8 w-8 rounded-full"
                     />
                  ) : (
                     <TabBarIcon
                        name="user-circle"
                        color={
                           focused
                              ? colors.primary
                              : isDarkColorScheme
                                ? '#ffffff'
                                : colors.accent
                        }
                     />
                  )
            }}
         />
      </Tabs>
   )
}
