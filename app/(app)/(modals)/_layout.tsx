import { Feather } from '@expo/vector-icons'
import { router, Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native'

import { useColorScheme } from '~/lib/useColorScheme'

const ModalLayout = () => {
   const { isDarkColorScheme } = useColorScheme()

   return (
      <Stack>
         <Stack.Screen name="barber" options={{ headerShown: false }} />
         <Stack.Screen name="booking" options={{ headerShown: false }} />
         <Stack.Screen name="appointment" options={{ headerShown: false }} />
         <Stack.Screen name="barbers-map" options={{ headerShown: false }} />
         <Stack.Screen
            name="quick-booking"
            options={({ navigation }) => ({
               title: 'Barbers',
               headerRight: () => (
                  <TouchableOpacity>
                     <Feather
                        name="map"
                        size={26}
                        color={isDarkColorScheme ? 'white' : 'black'}
                        onPress={() => router.push('/barbers-map')}
                     />
                  </TouchableOpacity>
               ),
               headerLeft: () => (
                  <TouchableOpacity>
                     <Feather
                        name="chevron-left"
                        size={26}
                        color={isDarkColorScheme ? 'white' : 'black'}
                        onPress={() => navigation.goBack()}
                     />
                  </TouchableOpacity>
               )
            })}
         />
         <Stack.Screen
            name="barber-appointment-view"
            options={{ headerShown: false }}
         />
      </Stack>
   )
}

export default ModalLayout
