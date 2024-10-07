import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { FlashList } from '@shopify/flash-list'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { Button } from '~/components/Button'
import ConfettiComponent, {
   ConfettiComponentRef
} from '~/components/ConfettiComponent'
import { Container } from '~/components/Container'
import SwipleableAppoimentListItem from '~/components/SwipleableAppoimentListItem'
import { Text } from '~/components/nativewindui/Text'
import { useStatusBarColor } from '~/hooks/useStatusBarColor'
import { useColorScheme } from '~/lib/useColorScheme'
import { useAuth } from '~/providers/AuthContext'
import { useAppointmentStore } from '~/providers/useAppointmentStore'
import { COLORS } from '~/theme/colors'

const VALUES = ['Upcoming', 'Past']

type ParamsProps = {
   confetti?: string
}
const AppointmentsPage = () => {
   const { user } = useAuth()
   const { confetti } = useLocalSearchParams<ParamsProps>()
   const { colors, isDarkColorScheme } = useColorScheme()
   const [selectedIndex, setSelectedIndex] = useState(0)
   const {
      filtered,
      filteredAppointments,
      setFiltered,
      setSelectedStatuses,
      setFilteredAppointments
   } = useAppointmentStore()

   const appointments = useAppointmentStore((s) =>
      s.appointments.filter((app) => app.customer.id === user?.id)
   )

   const confettiRef = useRef<ConfettiComponentRef>(null)
   const d = filtered ? filteredAppointments : appointments
   const data = useMemo(
      () => d.sort((a, b) => (a.date < b.date ? 1 : -1)),
      [appointments, filtered]
   )

   const pastAppointmens = data
      .filter((item) => new Date(item.date) < new Date())
      .sort((a, b) => (new Date(a.date) > new Date(b.date) ? 1 : -1))

   const upcomingAppointments = data
      .filter((item) => new Date(item.date) >= new Date())
      .sort((a, b) => (new Date(a.date) > new Date(b.date) ? 1 : -1))

   useEffect(() => {
      if (confetti) {
         confettiRef.current?.triggerConfetti()
      }
   }, [confetti])

   useStatusBarColor('dark')

   if (!user)
      return (
         <Container>
            <View className="flex-1 items-center justify-center gap-6">
               <Text className="font-raleway text-xl text-muted dark:text-white">
                  Please login to view your appointments
               </Text>
               <Button
                  title="Login"
                  textStyle={{ paddingHorizontal: 22 }}
                  onPress={() => {
                     router.push({
                        pathname: '/login',
                        params: { returnUrl: '/appointments' }
                     })
                  }}
               />
            </View>
         </Container>
      )
   return (
      <View className="flex-1">
         {filtered && (
            <TouchableOpacity
               onPress={() => {
                  setFiltered(false)
                  setFilteredAppointments([])
                  setSelectedStatuses([])
               }}
            >
               <Text className="text-center text-sm my-1 text-blue-600">
                  Clear Filters
               </Text>
            </TouchableOpacity>
         )}
         <SegmentedControl
            values={VALUES}
            fontStyle={{
               fontSize: 16,
               color: isDarkColorScheme ? '#ffffff' : '#212121'
            }}
            tintColor={COLORS.light.accent}
            activeFontStyle={{
               color: '#ffffff',
               fontWeight: '700',
               fontSize: 18
            }}
            style={{
               backgroundColor: colors.card,
               height: 40,
               width: '70%',
               alignSelf: 'center'
            }}
            selectedIndex={selectedIndex}
            onChange={(event) => {
               setSelectedIndex(event.nativeEvent.selectedSegmentIndex)
            }}
         />
         <View className="flex-1 p-3">
            <FlashList
               data={
                  selectedIndex === 0 ? upcomingAppointments : pastAppointmens
               }
               estimatedItemSize={102}
               showsVerticalScrollIndicator={false}
               ItemSeparatorComponent={() => (
                  <View className="h-[1px] w-full bg-accent  opacity-30" />
               )}
               ListEmptyComponent={
                  <View className="mx-3 gap-10">
                     <Text className=" mt-10 text-center text-xl text-muted">
                        No Appointments Scheduled-
                     </Text>
                     {selectedIndex === 1 && (
                        <View className="w-1/2 self-center">
                           <Button
                              title="Book Appointment"
                              onPress={() => router.push('/quick-booking')}
                           />
                        </View>
                     )}
                  </View>
               }
               contentContainerClassName="p-2"
               renderItem={({ item, index }) => (
                  <SwipleableAppoimentListItem
                     disabled
                     onPress={() => {
                        router.push({
                           pathname: '/appointment',
                           params: { appointmentId: item.id }
                        })
                     }}
                     index={index}
                     item={item}
                     showDate
                  />
               )}
            />
         </View>
         <ConfettiComponent
            ref={confettiRef} // <reference path="" />
         />
      </View>
   )
}

export default AppointmentsPage
