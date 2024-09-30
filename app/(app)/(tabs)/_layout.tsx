import { Tabs } from 'expo-router'
import { Image } from 'react-native'

import { TabBarIcon } from '../../../components/TabBarIcon'

import FilterAppointments from '~/components/Filters/FilterAppointments'
import { useBarbers } from '~/hooks/useBarbers'
import { useNotifications } from '~/hooks/useNotification'
import { useColorScheme } from '~/lib/useColorScheme'
import { useAuth } from '~/providers/AuthContext'

export default function TabLayout() {
   const { colors, isDarkColorScheme } = useColorScheme()
   const { user } = useAuth()
   useNotifications()
   useBarbers()

   return (
      <Tabs
         screenOptions={{
            tabBarActiveTintColor: isDarkColorScheme
               ? colors.accent
               : colors.grey,
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
            name="index"
            options={{
               headerShown: false,
               title: 'Home',
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
            name="appointments"
            options={{
               title: 'Appointments',
               headerRight: () => <FilterAppointments />,

               tabBarIcon: ({ focused }) => (
                  <Image
                     source={require('~/assets/images/appointment.png')}
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
            name="(barbers)"
            options={{
               unmountOnBlur: true,
               title: 'Barbers',
               headerShown: false,

               tabBarIcon: ({ focused }) => (
                  <TabBarIcon
                     name="scissors"
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
            name="profile"
            options={{
               headerShown: false,
               title: 'Profile',

               tabBarIcon: ({ focused, size }) =>
                  user && user.image ? (
                     <Image
                        source={{ uri: user.image }}
                        style={{
                           resizeMode: 'cover',
                           height: size + 4,
                           width: size + 4,
                           borderRadius: (size + 4) / 2
                        }}
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
