import React from 'react'
import { View } from 'react-native'

import { Container } from '~/components/Container'
import EarningComponent from '~/components/EarningsChart'
import { Text } from '~/components/nativewindui/Text'
import { useStatusBarColor } from '~/hooks/useStatusBarColor'
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
                  No Data to show
               </Text>
            </View>
         </Container>
      )

   return (
      <Container>
         <View className="flex-1">
            <Text className="text-center" variant="largeTitle">
               Earnings
            </Text>
            <EarningComponent appointments={appointments} />
         </View>
      </Container>
   )
}

export default Earnings
