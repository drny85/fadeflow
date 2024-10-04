import { Feather, MaterialIcons } from '@expo/vector-icons'
import { Icon } from '@roninoss/icons'
import { FlashList } from '@shopify/flash-list'
import { format, isSameDay } from 'date-fns'
import { router } from 'expo-router'
import { MotiView } from 'moti'
import React, { useMemo, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import WeekSelector from '~/components/Appointment/WeekSelectorComponent'
import { Button } from '~/components/Button'
import { Container } from '~/components/Container'
import SwipleableAppoimentListItem from '~/components/SwipleableAppoimentListItem'
import { Sheet, useSheetRef } from '~/components/nativewindui/Sheet'
import { Text } from '~/components/nativewindui/Text'
import { DEFAULT_SCHEDULE, SIZES } from '~/constants'
import { useStatusBarColor } from '~/hooks/useStatusBarColor'
import { useColorScheme } from '~/lib/useColorScheme'
import { useAuth } from '~/providers/AuthContext'
import { useAppointmentStore } from '~/providers/useAppointmentStore'

const BarberAppointments = () => {
   const { user } = useAuth()
   const { colors, isDarkColorScheme } = useColorScheme()
   const blockedDates = user?.isBarber && user.blockedTimes
   const bottomSheetRef = useSheetRef()
   const [showNoData, setShowData] = useState(true)
   const [selectedDate, setSelectedDate] = useState<Date>(new Date())
   const appointments = useAppointmentStore((s) =>
      s.appointments.sort((a, b) =>
         new Date(a.date) > new Date(b.date) ? 1 : -1
      )
   )
   console.log(JSON.stringify(blockedDates, null, 2))

   const pendingAppointments = useMemo(() => {
      return appointments.filter((a) => a.status === 'pending')
   }, [appointments])

   const data = useMemo(() => {
      return appointments.filter((appointment) =>
         isSameDay(appointment.date, selectedDate)
      )
   }, [appointments, selectedDate])

   useStatusBarColor('dark')
   return (
      <Container>
         <View className="flex-row items-center justify-between mx-4">
            <TouchableOpacity onPress={() => router.push('/(modals)/clients')}>
               <Feather
                  name="users"
                  size={28}
                  color={isDarkColorScheme ? '#ffffff' : colors.accent}
               />
            </TouchableOpacity>
            <Text variant="title1" className="text-center mb-2">
               Appointments
            </Text>
            <View className="flex-row items-center gap-4">
               <TouchableOpacity onPress={() => router.push('/block-times')}>
                  <MaterialIcons
                     name="block"
                     size={28}
                     color={colors.primary}
                  />
               </TouchableOpacity>
               <MotiView
                  transition={{
                     loop: pendingAppointments.length > 0,
                     duration: 400,
                     delay: 400,
                     type: 'timing'
                  }}
                  animate={{
                     scale: pendingAppointments.length > 0 ? [1.2, 1, 1.2] : 1
                  }}
               >
                  <TouchableOpacity
                     onPress={() => bottomSheetRef.current?.present()}
                  >
                     <Icon
                        name="calendar-alert"
                        size={28}
                        color={isDarkColorScheme ? '#ffffff' : colors.accent}
                     />
                  </TouchableOpacity>
               </MotiView>
            </View>
         </View>

         <View className="m-1 min-h-36 rounded-md bg-card shadow-sm">
            <WeekSelector
               ignorePast
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
                     {blockedDates &&
                        blockedDates.length > 0 &&
                        blockedDates
                           .filter(
                              (d) =>
                                 d.allDay &&
                                 d.date ===
                                    new Date(selectedDate)
                                       .toISOString()
                                       .split('T')[0]
                           )
                           .map((day) => (
                              <View key={day.date} className="gap-4">
                                 <Text className="text-2xl font-roboto mt-3 uppercase">
                                    This day is blocked
                                 </Text>
                                 <Button
                                    title="Unlock it"
                                    onPress={() => {
                                       router.push({
                                          pathname: '/block-times',
                                          params: { date: day.date }
                                       })
                                    }}
                                 />
                              </View>
                           ))}
                  </View>
               }
               estimatedItemSize={125}
               key={showNoData ? 1 : 2}
               showsVerticalScrollIndicator={false}
               renderItem={({ item, index }) => {
                  if (!showNoData) return null

                  return (
                     <SwipleableAppoimentListItem
                        index={index}
                        item={item}
                        onPress={() =>
                           router.push({
                              pathname: '/barber-appointment-view',
                              params: { appointmentId: item.id }
                           })
                        }
                     />
                  )
               }}
            />
         </View>
         <Sheet
            snapPoints={['100%']}
            ref={bottomSheetRef}
            topInset={SIZES.statusBarHeight}
         >
            <View className="flex-1">
               <View className="flex-row justify-between items-center mx-2 mb-3">
                  <TouchableOpacity
                     onPress={() => bottomSheetRef.current?.close()}
                  >
                     <Icon
                        name="chevron-left"
                        size={28}
                        color={isDarkColorScheme ? '#ffffff' : colors.accent}
                     />
                  </TouchableOpacity>
                  <Text variant="title1" className="text-center mb-2">
                     New Appointments
                  </Text>
                  <Text />
               </View>
               <FlashList
                  data={pendingAppointments}
                  ListEmptyComponent={
                     <View className="mt-10 flex-1 items-center justify-center">
                        <Text className="text-center font-semibold text-muted dark:text-slate-300">
                           No New Appointments
                        </Text>
                     </View>
                  }
                  estimatedItemSize={125}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item, index }) => {
                     return (
                        <SwipleableAppoimentListItem
                           onPress={() => {
                              router.push({
                                 pathname: '/barber-appointment-view',
                                 params: { appointmentId: item.id }
                              })
                           }}
                           showDate
                           disabled
                           index={index}
                           item={item}
                        />
                     )
                  }}
               />
            </View>
         </Sheet>
      </Container>
   )
}

export default BarberAppointments
