import { FontAwesome5 } from '@expo/vector-icons'
import { addMinutes, format, formatDistanceToNow, isPast } from 'date-fns'
import { router, useLocalSearchParams } from 'expo-router'
import {
   Alert,
   Image,
   Pressable,
   ScrollView,
   TouchableOpacity,
   View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { updateAppointmentInDatabase } from '~/actions/appointments'
import { Button } from '~/components/Button'
import CommunicationButtons from '~/components/CommunicationButtons'
import { Container } from '~/components/Container'
import MapHeader from '~/components/MapHeader'
import { Text } from '~/components/nativewindui/Text'
import { useTranslate } from '~/hooks/useTranslation'
import { useColorScheme } from '~/lib/useColorScheme'
import { useAppointmentStore } from '~/providers/useAppointmentStore'
import { useBarbersStore } from '~/providers/useBarbersStore'
import { getAppointmentDuration } from '~/utils/getAppointmentDuration'
import { getBookingDate } from '~/utils/getBookingDate'
import { openMapWithNavigation } from '~/utils/openMapWithNavigation'

type ParamsProps = {
   appointmentId: string
}
const AppointmentDetails = () => {
   const translate = useTranslate()
   const { bottom } = useSafeAreaInsets()
   const { appointmentId } = useLocalSearchParams<ParamsProps>()
   const { getAppointment } = useAppointmentStore()
   const appointment = getAppointment(appointmentId)
   const getBarberById = useBarbersStore((s) => s.getBarberById)
   const duration = getAppointmentDuration(appointment.services)
   const price = appointment.services.reduce((acc, curr) => acc + curr.price, 0)
   const { isDarkColorScheme } = useColorScheme()
   const barber = getBarberById(appointment.barber.id)

   const handleCancelAppointment = async () => {
      try {
         if (!appointment) return
         await updateAppointmentInDatabase({
            ...appointment,
            status: 'cancelled',
            changesMadeBy: 'customer'
         })
      } catch (error) {
         console.log('Error updating appointment', error)
      }
   }

   if (!barber)
      return (
         <Container>
            <View className="flex-1 justify-center items-center gap-4">
               <Text>Barber not found</Text>
               <Button
                  title="Go Back"
                  textStyle={{ paddingHorizontal: 12 }}
                  onPress={() => router.back()}
               />
            </View>
         </Container>
      )

   return (
      <View style={{ flex: 1 }}>
         <MapHeader shouldGoBack barberInfo={barber} />
         <ScrollView style={{ flex: 0.6 }}>
            <View className="m-2 rounded-lg bg-card p-4 shadow-sm">
               <View className="flex-row items-center justify-between">
                  <Text variant="title3">
                     {translate('appointment.details.main')}
                  </Text>
                  <TouchableOpacity
                     className="rounded-full bg-card px-3 py-2"
                     onPress={() =>
                        openMapWithNavigation(
                           barber.profile?.coords?.lat!,
                           barber.profile?.coords?.lng!
                        )
                     }
                  >
                     <View className="flex-row items-center gap-2">
                        <FontAwesome5
                           name="directions"
                           size={22}
                           color={isDarkColorScheme ? 'white' : 'black'}
                        />
                        <Text className="text-sm font-semibold text-muted dark:text-white">
                           Directions
                        </Text>
                     </View>
                  </TouchableOpacity>
               </View>
               <View className="mt-2 flex-row items-center justify-between gap-3">
                  <Pressable
                     onPress={() =>
                        router.push({
                           pathname: '/barber',
                           params: { barberId: barber.id }
                        })
                     }
                  >
                     <Image
                        source={
                           barber.image
                              ? { uri: barber.image }
                              : require('~/assets/images/banner.png')
                        }
                        className="h-20 w-20 rounded-full object-cover"
                     />
                  </Pressable>
                  <View className="flex-grow">
                     <Text variant="heading">{barber.name}</Text>
                     <Text className="text-muted dark:text-white">
                        {barber.profile?.address.split(',')[0]}
                     </Text>
                     <Text className="text-muted dark:text-white">
                        {barber.phone}
                     </Text>
                  </View>

                  <CommunicationButtons phone={barber.phone} />
               </View>
            </View>
            <View className="m-2 gap-1 rounded-lg bg-card p-4 shadow-sm">
               <Text variant="title3">
                  {translate('appointment.details.title')}
               </Text>
               <View>
                  {appointment.services.map((s, index) => (
                     <Text
                        variant="heading"
                        className="text-muted dark:text-white"
                        key={s.id}
                     >
                        {s.name} {s.quantity > 1 ? `x ${s.quantity}` : ''}
                        {index !== appointment.services.length - 1 && ','}
                     </Text>
                  ))}
               </View>
               <View className="mt-2 flex-row items-center gap-3">
                  <Text className="text-muted dark:text-white">
                     {duration} mins
                  </Text>
                  <View className="h-1 w-1 rounded-full bg-slate-400" />
                  <Text className="text-muted dark:text-white">${price} </Text>
               </View>
               <Text className="text-muted dark:text-white">
                  {translate(`days.${format(appointment.date, 'E')}`)},{' '}
                  {format(appointment.date, 'PPP')}
               </Text>
               <Text className="text-muted dark:text-white">
                  {appointment.startTime} -{' '}
                  {format(
                     addMinutes(
                        getBookingDate(
                           new Date(appointment.date),
                           appointment.startTime
                        ),
                        duration || 40
                     ),
                     'p'
                  )}
               </Text>
               <Text className="text-sm text-muted dark:text-white">
                  ({formatDistanceToNow(new Date(appointment.date))}){' '}
                  {isPast(new Date(appointment.date)) ? 'ago' : 'from now'}
               </Text>
            </View>
            <View className="my-2 w-1/2 self-center rounded-full bg-card px-3 shadow-sm">
               <Text
                  className={`my-2 text-center text-xl font-bold capitalize  ${appointment.status === 'pending' ? 'text-orange-400' : appointment.status === 'confirmed' ? 'text-green-400' : appointment.status === 'cancelled' ? 'text-red-500' : 'text-slate-600'}`}
               >
                  {translate(
                     `appointment.filter.${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}`
                  )}
               </Text>
            </View>
         </ScrollView>
         {appointment.status === 'pending' ||
            (appointment.status === 'confirmed' && (
               <View
                  style={{ paddingBottom: bottom }}
                  className="flex-row justify-evenly"
               >
                  <Button
                     textStyle={{ color: 'orange', paddingHorizontal: 12 }}
                     style={{
                        backgroundColor: '#fff'
                     }}
                     title={translate('button.cancel')}
                     onPress={() =>
                        Alert.alert(
                           translate('appointment.confirmation.cancel.title'),
                           translate('appointment.confirmation.cancel.message'),

                           [
                              {
                                 text: 'No',
                                 style: 'cancel'
                              },
                              {
                                 text: translate(
                                    'appointment.confirmation.cancel.yes'
                                 ),
                                 style: 'destructive',
                                 onPress: handleCancelAppointment
                                 // Perform cancellation logic here
                              }
                           ]
                        )
                     }
                  />
                  <Button
                     title={translate('button.reschedule')}
                     iconName="calendar-o"
                     textStyle={{ paddingHorizontal: 12 }}
                     style={{ paddingHorizontal: 30 }}
                     onPress={() => {
                        router.push({
                           pathname: '/booking',
                           params: {
                              appointmentId: appointmentId.toString(),
                              barberId: appointment.barber.id.toString()
                           }
                        })
                     }}
                  />
               </View>
            ))}
      </View>
   )
}

export default AppointmentDetails
