import { Icon } from '@roninoss/icons'
import { Tabs, useSegments } from 'expo-router'
import { Image } from 'react-native'

import { TabBarIcon } from '../../../components/TabBarIcon'

import { useColorScheme } from '~/lib/useColorScheme'
import { translation } from '~/locales/translate'
import { useAuth } from '~/providers/AuthContext'

export default function AdminTabLayout() {
   const { colors, isDarkColorScheme } = useColorScheme()
   const { user } = useAuth()
   const segs = useSegments()
   console.log(segs[2])
   //    useAppointments()
   //    useNotifications()

   // if (!user) return <Redirect href="/(app)/(tabs)" />
   return (
      <Tabs
         initialRouteName="dashboard"
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
            name="dashboard"
            options={{
               headerShown: false,
               title: translation('tabs', 'home'),
               tabBarIcon: ({ focused }) => (
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
            name="(admin-barbers)"
            options={{
               title: translation('tabs', 'appointments'),

               tabBarIcon: ({ size, focused }) => (
                  <Icon
                     name="person"
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
            name="admin-settings"
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
