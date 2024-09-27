import { FlashList } from '@shopify/flash-list'
import { isSameDay } from 'date-fns'
import React, { useMemo, useState } from 'react'
import { View } from 'react-native'

import WeekSelector from '~/components/Appointment/WeekSelectorComponent'
import { Container } from '~/components/Container'
import { Text } from '~/components/nativewindui/Text'
import SwipleableAppoimentListItem from '~/components/SwipleableAppoimentListItem'
import { DEFAULT_SCHEDULE } from '~/constants'
import { useStatusBarColor } from '~/hooks/useStatusBarColor'
import { useAuth } from '~/providers/AuthContext'
import { useAppointmentStore } from '~/providers/useAppointmentStore'

const BarberAppointments = () => {
   const { user } = useAuth()
   const [showNoData, setShowData] = useState(true)
   const [selectedDate, setSelectedDate] = useState<Date>(new Date())
   const appointments = useAppointmentStore((s) =>
      s.appointments.sort((a, b) =>
         new Date(a.date) > new Date(b.date) ? 1 : -1
      )
   )

   const data = useMemo(() => {
      return appointments.filter((appointment) =>
         isSameDay(appointment.date, selectedDate)
      )
   }, [appointments, selectedDate])

   useStatusBarColor('dark')
   return (
      <Container>
         <Text variant={'largeTitle'} className="text-center mb-2">
            Appointments
         </Text>

         <View className="m-1 min-h-36 rounded-md bg-card shadow-sm">
            <WeekSelector
               ignorePast={true}
               onChange={() => {
                  setShowData(false)
               }}
               schedule={(user?.isBarber && user.schedule) || DEFAULT_SCHEDULE}
               onPress={(day) => {
                  setShowData(true)
                  setSelectedDate(day)
               }}
            />
         </View>
         <View className="flex-1 p-2">
            <FlashList
               data={data}
               ListEmptyComponent={
                  <View className="mt-10 flex-1 items-center justify-center">
                     <Text className="text-center font-semibold text-muted dark:text-slate-300">
                        No Appointments Scheduled
                     </Text>
                  </View>
               }
               estimatedItemSize={125}
               key={showNoData ? 1 : 2}
               showsVerticalScrollIndicator={false}
               renderItem={({ item, index }) => {
                  if (!showNoData) return null

                  return (
                     <SwipleableAppoimentListItem index={index} item={item} />
                  )
               }}
            />
         </View>
      </Container>
   )
}

export default BarberAppointments
