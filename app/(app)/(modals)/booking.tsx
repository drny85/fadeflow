import { Feather, FontAwesome } from '@expo/vector-icons'
import { BottomSheetTextInput, TouchableOpacity } from '@gorhom/bottom-sheet'
import { format, isPast, isSameDay } from 'date-fns'
import * as Haptics from 'expo-haptics'
import { router, useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useCallback, useEffect, useState } from 'react'
import { Alert, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { updateAppointmentInDatabase } from '~/actions/appointments'
import { updateUser } from '~/actions/users'
import AnimatedNumber from '~/components/AnimatedNumber'
import AppointmentDatePicker from '~/components/Appointment/AppointmentDatePicker'
import DateTimeAppointmentPicker from '~/components/Appointment/DateTimeAppointmentPicker'
import ServicePicker from '~/components/Appointment/ServicePicker'
import BarberImageHeader from '~/components/BarberImageHeader'
import { Button } from '~/components/Button'
import { Sheet, useSheetRef } from '~/components/nativewindui/Sheet'
import { Text } from '~/components/nativewindui/Text'
import { useServices } from '~/hooks/useServices'
import { useUser } from '~/hooks/useUser'
import { toastAlert, toastMessage } from '~/lib/toast'
import { useColorScheme } from '~/lib/useColorScheme'
import { useAuth } from '~/providers/AuthContext'
import { useAppointmentStore } from '~/providers/useAppointmentStore'
import { useAppointmentFlowStore } from '~/providers/useAppoitmentFlowStore'
import { useBarbersStore } from '~/providers/useBarbersStore'
import { Appointment } from '~/shared/types'
import { appointmentsConflict } from '~/utils/appointmentsConflict'
import { objectsAreDifferent } from '~/utils/compareTwoObjects'
import { formatPhone } from '~/utils/formatPhone'
import { getAppointmentDuration } from '~/utils/getAppointmentDuration'
import { getAppointmentPrice } from '~/utils/getAppointmentPrice'
import { getBookingDate } from '~/utils/getBookingDate'

type ParamProps = {
   barberId: string
   appointmentId?: string
}

const BookingPage = () => {
   useUser()
   const { barberId, appointmentId } = useLocalSearchParams<ParamProps>()
   const { loading, services } = useServices(barberId)
   const { colors, isDarkColorScheme } = useColorScheme()
   const barbers = useBarbersStore((state) => state.barbers)
   const { user } = useAuth()

   const barber = barbers.find((barber) => barber.id === barberId)
   const [phone, setPhone] = useState(user?.phone)
   const bottomSheetModalRef = useSheetRef()
   const bottomSheetModalRef2 = useSheetRef()
   const bottomSheetModalRefConfirm = useSheetRef()
   const {
      setSelectedTimeSlot,
      setIndex,
      selectedServices,
      selectedTimeSlot,
      setSelectedDate,
      setServices,
      selectedDate
   } = useAppointmentFlowStore()
   const { addNewAppointment, getAppointment, appointments } =
      useAppointmentStore()
   const { bottom } = useSafeAreaInsets()
   const alreadyHaveAnAppointmentToday =
      appointments.findIndex(
         (appointment) =>
            appointment.customer.id === user?.id &&
            appointment.status !== 'cancelled' &&
            !isPast(appointment.date) &&
            isSameDay(appointment.date, selectedDate)
      ) !== -1

   const handleSchuduleAppointment = async () => {
      if (selectedServices.length === 0) {
         Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
         toastAlert({
            title: 'Service Required',
            message: 'You must select a service to book an appointment',
            preset: 'custom',
            duration: 3,
            iconName: 'hand.raised.slash'
         })
         return
      }
      if (!selectedDate || !selectedTimeSlot) {
         bottomSheetModalRef.current?.present()
         return
      }
      if (!user) {
         console.log(barberId, appointmentId)
         router.push({
            pathname: '/(auth)/login',
            params: {
               returnUrl: `/booking?barberId=${barberId}`
            }
         })
         return
      }
      if (phone?.length !== 14) {
         bottomSheetModalRef2.current?.present()
         return
      }

      if (alreadyHaveAnAppointmentToday && !appointmentId) {
         Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
         toastAlert({
            title: 'Appointment Conflict',
            message: `You already have an appointment on ${format(selectedDate, 'PP')}\nPlease just update that appointmet or cancel and book another one`,
            preset: 'custom',
            duration: 5,
            iconName: 'hand.raised.slash'
         })
         return
      }

      if (appointmentId) {
         const app = getAppointment(appointmentId)
         const updatedAppointment = {
            ...app,
            services: selectedServices,
            //updatedCount: app.updatedCount ? app.updatedCount + 1 : 1,
            date: selectedDate.toISOString(),
            startTime: selectedTimeSlot.time
         }

         const isThereAnyChanges = objectsAreDifferent(app, updatedAppointment)

         if (!isThereAnyChanges) {
            Alert.alert('No changes made')
            router.back()
            return
         }

         // const thereIsConflict = appointmentsConflict(
         //    appointments,
         //    updatedAppointment.date,
         //    getAppointmentDuration(updatedAppointment.services)
         // );

         // if (thereIsConflict) {
         //    return toastAlert({
         //       title: 'Appointment Conflict',
         //       message: 'Please consider changing the time or services',
         //       preset: 'custom',
         //       duration: 3,
         //       iconName: 'hand.raised.slash',
         //    });
         // }

         const isStillAvailable =
            await checkIfApppointmentIsStillAvailable(updatedAppointment)
         if (!isStillAvailable) {
            return toastMessage({
               title: 'Already Taken',
               message: `${updatedAppointment.startTime} not available`,
               preset: 'custom',
               duration: 3,
               iconName: 'nosign.app.fill'
            })
         }

         const updated = await updateAppointmentInDatabase({
            ...updatedAppointment,
            updatedCount: app.updatedCount + 1
         })
         if (updated) {
            toastMessage({
               title: 'Appointment updated',
               message: 'Your appointment has been updated',
               preset: 'done',
               duration: 2
            })
            bottomSheetModalRef.current?.close()
            router.back()
         }

         return
      }
      try {
         if (!barber || !user) return
         const d = getBookingDate(selectedDate, selectedTimeSlot?.time)
         const appointment: Appointment = {
            barber: {
               id: barber.id,
               name: barber.name,
               image: barber.image,
               phone: barber.phone,
               pushToken: barber.pushToken
            },
            reminderSent: false,
            customer: {
               id: user.id,
               name: user.name,
               image: user.image,
               phone: user.phone,
               pushToken: user.pushToken || null
            },
            services: selectedServices,
            updatedCount: 0,
            date: d.toISOString(),
            startTime: selectedTimeSlot?.time,
            status: 'pending',
            changesMadeBy: 'customer'
         }

         const thereIsConflict = appointmentsConflict(
            appointments,
            appointment.date,
            getAppointmentDuration(appointment.services),
            user.id!
         )

         if (thereIsConflict) {
            return toastAlert({
               title: 'Appointment Conflict',
               message: 'Please consider changing the time or services',
               preset: 'custom',
               duration: 3,

               iconName: 'hand.raised.slash'
            })
         }
         const isStillAvailable =
            await checkIfApppointmentIsStillAvailable(appointment)
         if (!isStillAvailable) {
            return toastMessage({
               title: 'Already Taken',
               message: `${appointment.startTime} not available`,
               preset: 'custom',
               duration: 3,
               iconName: 'nosign.app.fill'
            })
         }
         const saved = await addNewAppointment(appointment)
         await cleanUpAfterSave(saved)
      } catch (error) {
         console.log(
            '��� ~ file: #barber.tsx:58 ~ handleSchuduleAppointment ~ error:',
            error
         )
      }
   }

   const checkIfApppointmentIsStillAvailable = async (
      appointment: Appointment
   ): Promise<boolean> => {
      const isAvailable =
         appointments.findIndex(
            (item) =>
               item.barber.id === appointment.barber.id &&
               item.startTime === appointment.startTime &&
               isSameDay(appointment.date, item.date)
         ) === -1
      return Promise.resolve(isAvailable)
   }

   const cleanUpAfterSave = async (saved: boolean) => {
      if (saved) {
         setSelectedTimeSlot(null)
         setIndex(0)
         setSelectedDate(new Date())
         setServices([])
         toastMessage({
            title: 'Appointment booked',
            message: 'Your appointment has been booked',
            preset: 'done',
            duration: 2
         })
         if (user && phone) {
            await updateUser({ ...user, phone })
         }

         bottomSheetModalRef.current?.close()
         router.canDismiss() && router.dismiss()
         router.replace({
            pathname: '/appointments',
            params: { confetti: 'yes' }
         })
      }
   }

   const handleSheetChanges = useCallback((index: number) => {
      if (index === -1) {
         setIndex(0)
      }
   }, [])

   useEffect(() => {
      if (appointmentId) {
         const appointment = getAppointment(appointmentId)

         if (appointment) {
            setSelectedTimeSlot({
               time: appointment.startTime,
               isBooked: true
            })
            setSelectedDate(new Date(appointment.date))
            setServices(appointment.services)
            // setSelectedServiceOrRemoveService(appointment);
         }
      }
   }, [appointmentId])

   useEffect(() => {
      if (user?.phone) setPhone(user.phone)
   }, [user?.phone])

   if (!barber || loading) return null

   return (
      <View className="flex-1 justify-between">
         <StatusBar style="light" />
         <BarberImageHeader
            //toggleFavorite={toggleFavorite}
            barber={barber}
            onPressBack={() => {
               setSelectedDate(new Date())
               setServices([])
               setSelectedTimeSlot(null)
               router.canGoBack()
                  ? router.back()
                  : router.replace('/(barbers)/barbers-screen')
            }}
         />
         <ScrollView showsVerticalScrollIndicator={false} className="my-2">
            {services.length > 0 && barber.isAvailable && (
               <ServicePicker services={services} isBarber={false} />
            )}
            {barber.isAvailable && services.length > 0 && (
               <AppointmentDatePicker
                  onPress={() => {
                     if (selectedServices.length === 0) {
                        Haptics.notificationAsync(
                           Haptics.NotificationFeedbackType.Error
                        )
                        toastAlert({
                           title: 'Service Required',
                           message:
                              'You must select a service to book an appointment',
                           preset: 'custom',
                           duration: 3,
                           iconName: 'hand.raised.slash'
                        })
                        return
                     }
                     bottomSheetModalRef.current?.present()
                  }}
               />
            )}
            {services.length === 0 && (
               <View className="mt-10 flex-1 items-center justify-center p-2">
                  <Text className="text-center text-xl text-muted">
                     {barber.name} has not listed any services yet. Please let
                     him know!
                  </Text>
               </View>
            )}
            {!barber.isAvailable && (
               <View className="flex-1 items-center justify-center">
                  <Text className="text-center text-xl text-muted">
                     {barber.name} is not available today
                  </Text>
               </View>
            )}
         </ScrollView>

         <View
            className="shas rounded-3xl bg-card"
            style={{
               marginBottom: bottom,
               shadowOffset: { width: -2, height: -2 },
               shadowRadius: 3,
               shadowOpacity: 0.5,
               shadowColor: colors.grey
            }}
         >
            {/* {selectedDate && selectedTimeSlot && (
          <Text className="py-2 text-center text-sm font-semibold text-muted">
            {format(getBookingDate(selectedDate, selectedTimeSlot?.time), 'PPP p')}
          </Text>
        )} */}
            <View className="my-3 flex-row items-start gap-2 self-center">
               <FontAwesome name="money" size={24} color="grey" />
               <Text className="text-center text-muted dark:text-white">
                  $
                  {selectedServices.length > 0 &&
                     getAppointmentPrice(selectedServices)}{' '}
                  Cash Only
               </Text>
            </View>
            <View className="w-[80%] self-center">
               <Button
                  disabled={!barber.isAvailable || services.length === 0}
                  title={appointmentId ? 'Update Appointment' : 'Continue'}
                  style={{
                     opacity:
                        !barber.isAvailable || services.length === 0 ? 0.5 : 1
                  }}
                  onPress={() => {
                     if (!selectedTimeSlot) {
                        bottomSheetModalRef.current?.present()
                        return
                     }
                     bottomSheetModalRefConfirm.current?.present()
                  }}
               />
            </View>
         </View>
         <Sheet ref={bottomSheetModalRef2} snapPoints={['60%']}>
            <View className="flex-1 gap-4 p-3">
               <Text variant="title3" className="ml-2">
                  Phone Number is required
               </Text>
               <BottomSheetTextInput
                  className={`m-2 border-b-[1px] border-slate-300 bg-card p-2 text-black dark:text-slate-100 font-roboto text-lg ${phone?.length === 14 ? 'border-green-600' : 'border-slate-300'}`}
                  placeholder="(646) 555-4444"
                  keyboardType="numeric"
                  value={phone}
                  onChangeText={(text) => setPhone(formatPhone(text))}
               />
               <Button
                  disabled={phone?.length !== 14}
                  title="Save"
                  style={{ opacity: phone?.length === 14 ? 1 : 0.5 }}
                  onPress={() => bottomSheetModalRef2.current?.close()}
               />
            </View>
         </Sheet>
         <Sheet
            ref={bottomSheetModalRef}
            handleIndicatorStyle={{ backgroundColor: colors.primary }}
            snapPoints={['70%']}
            onChange={handleSheetChanges}
         >
            <View className="mt-5 flex-1 items-center justify-center bg-card pb-8">
               <TouchableOpacity
                  onPress={() => bottomSheetModalRef.current?.close()}
                  style={{
                     justifyContent: 'flex-end',
                     alignSelf: 'flex-end',
                     marginRight: 20
                  }}
               >
                  <Text className="text-muted dark:text-slate-300">Cancel</Text>
               </TouchableOpacity>
               <DateTimeAppointmentPicker
                  barber={barber}
                  onPress={() => bottomSheetModalRef.current?.close()}
               />
            </View>
         </Sheet>
         <Sheet snapPoints={['85%']} ref={bottomSheetModalRefConfirm}>
            <View className="flex-1 bg-card pb-8">
               <Text
                  onPress={() => bottomSheetModalRefConfirm.current?.close()}
                  className="text-right mr-2 p-2 text-slate-600 dark:text-slate-200"
               >
                  Cancel
               </Text>
               <ScrollView className="flex-1" contentContainerClassName="p-3">
                  <Text variant="largeTitle" className="text-center">
                     Review & Confirm
                  </Text>
                  <View className="h-[1px] w-2/3 bg-slate-400 self-center my-2" />

                  <Text className="my-2 text-xl">
                     {format(selectedDate, 'E, PP')} at {selectedTimeSlot?.time}
                  </Text>
                  <Text variant="title2">{barber.profile?.barbershopName}</Text>

                  <Text className="text-slate-400 font-roboto-bold text-lg dark:text-slate-300">
                     {barber.name}
                  </Text>

                  <Text className="text-slate-500 dark:text-slate-300">
                     {barber.profile?.address}
                  </Text>
                  <View className="p-2 bg-card shadow-sm rounded-md my-2">
                     {selectedServices.map((s, index) => (
                        <Text
                           className="font-roboto-bold text-muted dark:text-white"
                           key={s.id}
                        >
                           {s.name} {s.quantity > 1 ? `x ${s.quantity}` : ''}{' '}
                           {index !== selectedServices.length - 1 && ','}
                        </Text>
                     ))}
                  </View>
                  <View className="flex-row items-center gap-1 p-2">
                     <Text>Duration:</Text>
                     <Text>
                        {getAppointmentDuration(selectedServices)} mins
                     </Text>
                     <Feather
                        name="clock"
                        size={22}
                        color={isDarkColorScheme ? '#ffffff' : '#212121'}
                     />
                  </View>

                  <View className="flex-row p-2 justify-between">
                     <Text variant="title1">Total</Text>
                     <AnimatedNumber
                        textStyle={{
                           color: isDarkColorScheme ? '#ffffff' : '#212121',
                           fontSize: 26,
                           fontFamily: 'Roboto-Bold'
                        }}
                        value={getAppointmentPrice(selectedServices)}
                     />
                  </View>
                  <Text className="text-muted text-center mt-3 dark:text-slate-400">
                     Payment will be make in cash after service complition.
                  </Text>
               </ScrollView>
               <View className="w-2/3 self-center">
                  <Button
                     title="Confirm & Book"
                     onPress={handleSchuduleAppointment}
                  />
               </View>
            </View>
         </Sheet>
      </View>
   )
}

export default BookingPage
