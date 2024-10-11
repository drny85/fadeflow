import { Octicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { Container } from '~/components/Container'
import EarningComponent from '~/components/EarningsChart'
import { Text } from '~/components/nativewindui/Text'
import { useStatusBarColor } from '~/hooks/useStatusBarColor'
import { translation } from '~/locales/translate'
import { useAppointmentStore } from '~/providers/useAppointmentStore'

const Earnings = () => {
   const appointments = useAppointmentStore((s) =>
      s.appointments.filter((a) => a.status !== 'cancelled')
   )
   useStatusBarColor('dark')

   if (appointments.length === 0)
      return (
         <Container>
            <View className="flex-1 items-center justify-center">
               <Text className="font-semibold text-muted dark:text-slate-300">
                  {translation('misc', 'no_data')}
               </Text>
            </View>
         </Container>
      )

   return (
      <Container>
         <View className="flex-1">
            <View className="flex-row items-center justify-between mx-4 mt-4">
               <Text className="text-center" variant="largeTitle">
                  {translation('tabs', 'earnings')}
               </Text>
               <TouchableOpacity
                  className="h-12 w-12 rounded-full justify-center items-center bg-primary"
                  onPress={() => router.push('/analyties')}
               >
                  <Octicons name="graph" size={28} color={'white'} />
               </TouchableOpacity>
            </View>

            <EarningComponent appointments={appointments} />
         </View>
      </Container>
   )
}

export default Earnings
