import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { FlashList } from '@shopify/flash-list'
import {
   isSameDay,
   isPast,
   parseISO,
   format,
   getHours,
   isAfter,
   startOfDay,
   endOfDay,
   eachHourOfInterval
} from 'date-fns'
import { router } from 'expo-router'
import React, { useMemo, useState } from 'react'
import {
   Alert,
   FlatList,
   ScrollView,
   StyleSheet,
   TouchableOpacity,
   View
} from 'react-native'
import Animated, { FadeInLeft, SlideInLeft } from 'react-native-reanimated'

import { updateAppointmentInDatabase } from '~/actions/appointments'
import AppointmentCard from '~/components/Appointment/AppointmentCard'
import WeekSelector from '~/components/Appointment/WeekSelectorComponent'
import { Button } from '~/components/Button'
import { Container } from '~/components/Container'
import { Text } from '~/components/nativewindui/Text'
import { DEFAULT_SCHEDULE } from '~/constants'
import { useStatusBarColor } from '~/hooks/useStatusBarColor'
import { toastAlert } from '~/lib/toast'
import { useColorScheme } from '~/lib/useColorScheme'
import { useAuth } from '~/providers/AuthContext'
import { useAppointmentStore } from '~/providers/useAppointmentStore'
import { Appointment } from '~/shared/types'
import { COLORS } from '~/theme/colors'
import { getAppointmentDuration } from '~/utils/getAppointmentDuration'

const VALUES = ['Today', 'Calendar']

const BarberAppointments = () => {
   const { user } = useAuth()
   const [showNoData, setShowData] = useState(true)
   const [selectedDate, setSelectedDate] = useState<Date>(new Date())
   const appointments = useAppointmentStore((s) =>
      s.appointments.sort((a, b) =>
         new Date(a.date) > new Date(b.date) ? 1 : -1
      )
   )

   const [selectedIndex, setSelectedIndex] = useState(0)

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
                  if (!showNoData)
                     return (
                        <View className="mt-10 flex-1 items-center justify-center">
                           <Text className="text-center font-semibold text-muted dark:text-slate-300">
                              Select a Date
                           </Text>
                        </View>
                     )
                  const statusColor =
                     item.status === 'cancelled'
                        ? 'border-l-red-500'
                        : item.status === 'pending'
                          ? 'border-l-orange-400'
                          : 'border-l-green-500'
                  return (
                     <Animated.View entering={SlideInLeft.delay(index * 200)}>
                        <Text className="font-roboto-bold ml-2">
                           {item.startTime}
                        </Text>
                        <TouchableOpacity
                           onPress={() =>
                              router.push({
                                 pathname: '/barber-appointment-view',
                                 params: { appointmentId: item.id }
                              })
                           }
                           className={`bg-card mb-1 p-2 rounded-md border-l-4 flex-row justify-between items-center ${statusColor}`}
                        >
                           <View className="bg-card p-2 rounded-md gap-1">
                              <View className="flex-row items-center gap-2">
                                 <Text className="font-raleway">
                                    {item.customer.name}
                                 </Text>
                                 <View className="bg-slate-400 h-1 w-1 rounded-full" />
                                 <Text className="text-sm text-muted dark:text-slate-400">
                                    {getAppointmentDuration(item.services)} mins
                                 </Text>
                              </View>
                              <View>
                                 {item.services.map((s, index) => (
                                    <Text
                                       className="font-raleway-bold text-sm text-muted dark:text-white"
                                       key={s.id}
                                    >
                                       {s.name}{' '}
                                       {s.quantity > 1 ? `x ${s.quantity}` : ''}{' '}
                                       {index !== item.services.length - 1 &&
                                          ','}
                                    </Text>
                                 ))}
                              </View>
                           </View>
                           <View
                              className={`${item.status === 'confirmed' ? 'bg-green-400' : item.status === 'pending' ? 'bg-orange-400' : item.status === 'cancelled' ? 'bg-primary' : 'bg-gray-400'} w-1/4 rounded-2xl p-1 px-2`}
                           >
                              <Text className="text-center text-sm font-semibold capitalize text-white">
                                 {item.status}
                              </Text>
                           </View>
                        </TouchableOpacity>
                     </Animated.View>
                  )
               }}
            />
         </View>
      </Container>
   )
}

export default BarberAppointments

const ActionButtons = ({ appointment }: { appointment: Appointment }) => {
   const { colors } = useColorScheme()
   const handleActions = () => {
      if (appointment.status === 'pending') {
         updateAppointmentInDatabase({
            ...appointment,
            status: 'confirmed',
            changesMadeBy: 'barber'
         })
         // handle confirm
      }
      if (appointment.status === 'confirmed') {
         if (!isPast(appointment.date)) {
            toastAlert({
               title: 'Error',
               message: 'You can only complete past appointments .',
               preset: 'error'
            })
            return
         }
         updateAppointmentInDatabase({
            ...appointment,
            status: 'completed',
            changesMadeBy: 'barber'
         })
         // handle complete
      }
   }

   const handleCancelAppointment = () => {
      if (appointment.status === 'confirmed') {
         Alert.alert(
            'Appointment is confirmed',
            'Are you sure that you want to cancel this appointment',
            [
               {
                  text: 'No',
                  style: 'cancel'
               },
               {
                  text: 'OK, Cancel it',
                  onPress: () => {
                     updateAppointmentInDatabase({
                        ...appointment,
                        status: 'cancelled',
                        changesMadeBy: 'barber'
                     })
                  }
               }
            ]
         )
      } else if (appointment.status === 'completed') {
         return Alert.alert(
            'Appointment is completed',
            'This appointment has already been completed and cannot be cancelled.'
         )
      } else {
         Alert.alert(
            'Cancel Appointment',
            'Are you sure you want to cancel this appointment?',
            [
               {
                  text: 'Cancel',
                  style: 'cancel'
               },
               {
                  text: 'Yes',
                  style: 'destructive',
                  onPress: () => {
                     updateAppointmentInDatabase({
                        ...appointment,
                        status: 'cancelled',
                        changesMadeBy: 'barber'
                     })
                  }
               }
            ]
         )
      }
   }

   return (
      <View className="mt-2 w-full flex-1 flex-row justify-evenly">
         <Button
            disabled={
               appointment.status === 'cancelled' ||
               appointment.status === 'confirmed'
            }
            onPress={() => {
               Alert.alert(
                  'Cancel Appointment',
                  'Are you sure you want to cancel this appointment?',
                  [
                     {
                        text: 'Cancel',
                        style: 'cancel'
                     },
                     {
                        text: 'Yes',
                        style: 'destructive',
                        onPress: handleCancelAppointment
                     }
                  ]
               )
            }}
            style={{
               backgroundColor: COLORS.light.grey3,
               paddingHorizontal: 16
            }}
            title="Cancel"
         />
         <Button
            style={{
               paddingVertical: 1,
               backgroundColor:
                  appointment.status === 'cancelled' ? 'red' : colors.primary
            }}
            onPress={handleActions}
            title={
               appointment.status === 'confirmed'
                  ? 'Complete'
                  : appointment.status === 'pending'
                    ? 'Confirm'
                    : 'No Action'
            }
         />
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#000'
   },
   dateSelector: {
      paddingVertical: 10
   },
   schedule: {
      paddingHorizontal: 20
   },
   hourBlock: {
      borderBottomColor: '#666',
      borderBottomWidth: 1,
      paddingTop: 10
   },
   hourText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold'
   },
   appointment: {
      backgroundColor: '#333',
      padding: 10,
      marginVertical: 5
   },
   appointmentText: {
      color: '#fff',
      fontSize: 14
   }
})
