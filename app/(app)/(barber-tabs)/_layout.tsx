import { Redirect, Tabs } from 'expo-router'
import { Image, Platform } from 'react-native'

import { TabBarIcon } from '../../../components/TabBarIcon'

import { useAppointments } from '~/hooks/useAppointments'
import { useNotifications } from '~/hooks/useNotification'
import { useColorScheme } from '~/lib/useColorScheme'
import { useAuth } from '~/providers/AuthContext'
import { Icon } from '@roninoss/icons'
import { SymbolView } from 'expo-symbols'

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
               ? colors.primary
               : colors.accent,
            tabBarInactiveTintColor: isDarkColorScheme ? '#ffffff' : colors.a,
            tabBarStyle: { backgroundColor: colors.background },
            headerStyle: {
               backgroundColor: colors.background
            }
         }}
      >
         <Tabs.Screen
            name="barber-home"
            options={{
               headerShown: false,
               title: 'Home',
               tabBarIcon: ({ color }) => (
                  <Image
                     source={require('~/assets/images/barbershop.png')}
                     tintColor={color}
                     className="-mb-1 h-8 w-8"
                  />
               )
            }}
         />
         <Tabs.Screen
            name="barber-appointments"
            options={{
               title: 'Appointments',
               headerShown: false,
               tabBarIcon: ({ color, size }) => (
                  <Icon name="calendar-clock" size={size + 10} color={color} />
               )
            }}
         />

         <Tabs.Screen
            name="gallery"
            options={{
               title: 'My Stuffs',
               headerShown: false,
               tabBarIcon: ({ color, size }) =>
                  Platform.OS === 'ios' ? (
                     <SymbolView
                        name="rectangle.on.rectangle.badge.gearshape"
                        size={size + 8}
                        tintColor={color}
                     />
                  ) : (
                     <TabBarIcon name="stack-overflow" color={color} />
                  )
            }}
         />
         <Tabs.Screen
            name="earnings"
            options={{
               title: 'Earnings',
               //headerShown: false,
               tabBarIcon: ({ color, size }) => (
                  <Icon name="chart-pie" size={size + 10} color={color} />
               )
            }}
         />

         <Tabs.Screen
            name="barber-profile"
            options={{
               title: 'Profile',
               headerShown: false,

               tabBarIcon: ({ color }) => (
                  <TabBarIcon name="user-circle" color={color} />
               )
            }}
         />
      </Tabs>
   )
}
