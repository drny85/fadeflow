import { Tabs } from 'expo-router'
import { Image, TouchableOpacity } from 'react-native'
import { TabBarIcon } from '../../../components/TabBarIcon'
import { useBarbers } from '~/hooks/useBarbers'
import { useNotifications } from '~/hooks/useNotification'
import { useColorScheme } from '~/lib/useColorScheme'
import FilterAppointments from '~/components/Filters/FilterAppointments'

export default function TabLayout() {
   const { colors, isDarkColorScheme } = useColorScheme()

   useNotifications()
   useBarbers()

   return (
      <Tabs
         screenOptions={{
            tabBarActiveTintColor: isDarkColorScheme
               ? colors.grey2
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
            name="(barbers)"
            options={{
               unmountOnBlur: true,
               title: 'Barbers',
               headerShown: false,

               tabBarIcon: ({ color }) => (
                  <TabBarIcon name="scissors" color={color} />
               )
            }}
         />
         <Tabs.Screen
            name="appointments"
            options={{
               title: 'Appointments',
               headerRight: () => <FilterAppointments />,

               tabBarIcon: ({ color }) => (
                  <Image
                     source={require('~/assets/images/appointment.png')}
                     tintColor={color}
                     className="-mb-1 h-8 w-8"
                  />
               )
            }}
         />
         <Tabs.Screen
            name="profile"
            options={{
               headerShown: false,

               tabBarIcon: ({ color }) => (
                  <TabBarIcon name="user-circle" color={color} />
               )
            }}
         />
      </Tabs>
   )
}
