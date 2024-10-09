import { Feather } from '@expo/vector-icons'
import { Icon } from '@roninoss/icons'
import { addMinutes, format, formatDistanceToNow, isPast } from 'date-fns'
import { BlurView } from 'expo-blur'
import { Redirect, router, useLocalSearchParams } from 'expo-router'
import { useCallback } from 'react'
import {
   Alert,
   ImageBackground,
   ScrollView,
   TouchableOpacity,
   View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
   handleAppointmentUpdates,
   updateAppointmentInDatabase
} from '~/actions/appointments'
import { Button } from '~/components/Button'
import CommunicationButtons from '~/components/CommunicationButtons'
import { Text } from '~/components/nativewindui/Text'
import { useTranslate } from '~/hooks/useTranslation'
import { toastAlert, toastMessage } from '~/lib/toast'
import { useColorScheme } from '~/lib/useColorScheme'
import { translation } from '~/locales/translate'
import { useAuth } from '~/providers/AuthContext'
import { useAppointmentStore } from '~/providers/useAppointmentStore'
import { getAppointmentDuration } from '~/utils/getAppointmentDuration'
import { getAppointmentPrice } from '~/utils/getAppointmentPrice'
import { getBookingDate } from '~/utils/getBookingDate'

type ParamsProps = {
   appointmentId: string
}
const BarberAppointmentView = () => {
   const translate = useTranslate()
   const { user } = useAuth()
   const { isDarkColorScheme } = useColorScheme()
   const { bottom, top } = useSafeAreaInsets()
   const { appointmentId } = useLocalSearchParams<ParamsProps>()
   const { getAppointment } = useAppointmentStore()
   const appointment = getAppointment(appointmentId)

   const handleCancelAppointment = async () => {
      try {
         if (!appointment) return
         await updateAppointmentInDatabase({
            ...appointment,
            status: 'cancelled',
            changesMadeBy: 'barber'
         })
      } catch (error) {
         console.log('Error updating appointment', error)
      }
   }

   const markAsNoShow = useCallback(() => {
      if (!isPast(appointment.date)) {
         return toastAlert({
            title: 'Cannot mark as no show',
            message: 'You can only mark appointments as no show in the past',
            preset: 'custom',
            duration: 3,

            iconName: 'hand.raised.slash'
         })
      }
      Alert.alert(
         'Mark as No Show',
         'Are you sure you want to mark this appointment as no show?',
         [
            {
               text: 'Cancel',
               style: 'cancel'
            },
            {
               text: 'Yes',
               onPress: async () => {
                  try {
                     if (!appointment) return
                     await updateAppointmentInDatabase({
                        ...appointment,
                        status: 'no-show',
                        changesMadeBy: 'barber'
                     })
                  } catch (error) {
                     console.log('Error updating appointment', error)
                  }
               }
            }
         ]
      )
   }, [])
   if (!appointment) return null

   if (!user?.isBarber) return <Redirect href="/(app)/(tabs)" />
   return (
      <View style={{ flex: 1 }}>
         <ImageBackground
            source={
               appointment.customer.image
                  ? { uri: appointment.customer.image }
                  : require('~/assets/images/banner.png')
            }
            style={{ flex: 0.5, overflow: 'hidden', borderRadius: 30 }}
            resizeMode="cover"
         >
            <TouchableOpacity
               onPress={router.back}
               style={{ top }}
               className="absolute left-2 z-30 rounded-full bg-slate-300 p-1"
            >
               <Feather name="chevron-left" size={30} color="blue" />
            </TouchableOpacity>
            <BlurView
               intensity={40}
               tint="prominent"
               className="absolute bottom-0 left-0 right-0 z-10 gap-1 overflow-hidden p-4"
            >
               <View className="flex-row items-center justify-between gap-4 ">
                  <Text
                     variant="title2"
                     className=" text-slate-900  dark:text-white"
                  >
                     {appointment.customer.name}
                  </Text>
                  <View className="w-1/3  flex-row self-end">
                     <CommunicationButtons
                        phone={appointment.customer.phone!}
                     />
                  </View>
               </View>
            </BlurView>
         </ImageBackground>
         <ScrollView style={{ flex: 0.6 }}>
            <View className="m-2 gap-1 rounded-lg bg-card p-4 shadow-sm">
               <Text className="text-xl font-semibold">
                  {translation('appointment', 'details', 'title')}
               </Text>
               <View>
                  {appointment.services.map((s, index) => (
                     <Text
                        className="font-raleway-bold text-muted  dark:text-white"
                        key={s.id}
                     >
                        {s.name} {s.quantity > 1 ? `x ${s.quantity}` : ''}
                        {index !== appointment.services.length - 1 && ','}
                     </Text>
                  ))}
               </View>
               <View className="flex-row items-center gap-3">
                  <Text className="text-muted dark:text-white">
                     {getAppointmentDuration(appointment.services)} mins
                  </Text>
                  <View className="h-1 w-1 rounded-full bg-slate-400" />
                  <Text className="text-muted  dark:text-white">
                     ${getAppointmentPrice(appointment.services)}
                  </Text>
               </View>
               <Text className="text-muted  dark:text-white">
                  {format(appointment.date, 'PPP')}
               </Text>
               <Text className="text-muted  dark:text-white">
                  {appointment.startTime} -{' '}
                  {format(
                     addMinutes(
                        getBookingDate(
                           new Date(appointment.date),
                           appointment.startTime
                        ),
                        getAppointmentDuration(appointment.services) || 40
                     ),
                     'p'
                  )}
               </Text>
               <Text className="text-sm text-muted  dark:text-white">
                  ({formatDistanceToNow(new Date(appointment.date))}){' '}
                  {isPast(new Date(appointment.date)) ? 'ago' : 'from now'}
               </Text>
               {appointment.updatedCount > 0 && (
                  <Text className="py-2 text-center text-sm font-semibold text-muted">
                     Changes Made {appointment.updatedCount}
                  </Text>
               )}
            </View>
            <Text className="text-center text-lg text-muted  dark:text-white">
               {translation('appointment', 'status')}
            </Text>
            <View className="my-2 w-1/2 self-center rounded-full bg-card px-3 shadow-sm">
               <Text
                  className={`my-2 text-center text-xl font-bold capitalize ${appointment.status === 'pending' ? 'text-orange-400' : appointment.status === 'confirmed' ? 'text-green-400' : appointment.status === 'cancelled' ? 'text-red-500' : 'text-slate-600'}`}
               >
                  {translate(
                     `appointment.filter.${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}`
                  )}
               </Text>
            </View>
         </ScrollView>
         {appointment.status === 'pending' && (
            <View
               style={{ paddingBottom: bottom }}
               className="flex-row justify-evenly"
            >
               <Button
                  textStyle={{ color: 'orange', paddingHorizontal: 12 }}
                  style={{
                     backgroundColor: '#fff'
                  }}
                  title="Cancel"
                  onPress={() =>
                     Alert.alert(
                        'Are you sure you want to cancel this appointment?',
                        'This action cannot be undone.',
                        [
                           {
                              text: 'Cancel',
                              style: 'cancel'
                           },
                           {
                              text: 'Yes, Cancel it',
                              style: 'destructive',
                              onPress: handleCancelAppointment
                              // Perform cancellation logic here
                           }
                        ]
                     )
                  }
               />
               <Button
                  title="Confirm"
                  iconName="thumbs-up"
                  style={{ paddingHorizontal: 10 }}
                  textStyle={{ paddingHorizontal: 20 }}
                  onPress={async () => {
                     const updated = await updateAppointmentInDatabase({
                        ...appointment,
                        status: 'confirmed',
                        changesMadeBy: 'barber'
                     })

                     if (updated) {
                        toastMessage({
                           title: 'Confirmed',
                           message: 'The appointment has been confirmed',
                           preset: 'done',
                           duration: 2
                        })

                        router.back()
                     }
                  }}
               />
            </View>
         )}
         {appointment.status === 'confirmed' && (
            <View
               style={{ paddingBottom: bottom }}
               className="flex-row items-center justify-between mx-3 gap-3"
            >
               <TouchableOpacity
                  onPress={markAsNoShow}
                  className="flex-row gap-2 items-center bg-card shadow-sm rounded-full px-3 p-2"
               >
                  <Icon
                     name="clock-remove-outline"
                     size={24}
                     color={isDarkColorScheme ? '#ffffff' : '#212121'}
                  />
                  <Text className="text-center text-lg text-muted dark:text-slate-400">
                     {translate('appointment.filter.No-show')}
                  </Text>
               </TouchableOpacity>
               <View className="flex-1">
                  <Button
                     title={translation('appointment', 'mark_completed')}
                     onPress={() => handleAppointmentUpdates(appointment)}
                  />
               </View>
            </View>
         )}
      </View>
   )
}

export default BarberAppointmentView
