import { addDays, differenceInDays, format, isPast, isToday } from 'date-fns'
import { router } from 'expo-router'
import { useMemo } from 'react'
import { ScrollView, View } from 'react-native'
import WaitingAppoinmentCard from '~/components/Appointment/WaitingAppoinmentCard'
import { Button } from '~/components/Button'
import HomeBarberHeader from '~/components/HomeBarberHeader'
import ProgressBar from '~/components/ProgressBar'
import SwipleableAppoimentListItem from '~/components/SwipleableAppoimentListItem'
import { Text } from '~/components/nativewindui/Text'
import { useServices } from '~/hooks/useServices'
import { useStatusBarColor } from '~/hooks/useStatusBarColor'
import { useTranslate } from '~/hooks/useTranslation'
import { translation } from '~/locales/translate'
import { useAuth } from '~/providers/AuthContext'
import { useAppointmentStore } from '~/providers/useAppointmentStore'
import { calculateEarningsByFilter } from '~/utils/calculateEarningByFilter'

const DAYS = process.env.EXPO_PUBLIC_FREE_TRIAL_DAYS!

const BarberHome = () => {
   const translate = useTranslate()
   const { user } = useAuth()
   const daysRemaining = differenceInDays(
      addDays(user?.createdAt!, +DAYS),
      new Date()
   )

   const { services, loading } = useServices(user?.id!)
   const data = useAppointmentStore((s) => s.appointments)
   const appointments = data.filter(
      (a) =>
         a.status !== 'cancelled' && a.status !== 'completed' && !isPast(a.date)
   )
   const appointmentsData = useMemo(
      () => data.filter((a) => a.status !== 'cancelled'),
      [data]
   )

   const myNextAppointment = appointments.sort((a, b) =>
      new Date(a.date) > new Date(b.date) ? 1 : -1
   )[0]

   const waitinfForConfirmation = appointmentsData.filter(
      (a) => a.status === 'pending'
   )
   const todayAppoinments = useMemo(() => {
      return data
         .filter((appointment) => {
            return (
               appointment.status !== 'cancelled' && isToday(appointment.date)
            )
         })
         .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
         )
   }, [data])

   const totalHours = todayAppoinments.reduce((total, appointment) => {
      const serviceDuration = appointment.services.reduce(
         (duration, service) => duration + service.duration,
         0
      )
      return total + serviceDuration
   }, 0)
   const completedAppointments = appointmentsData.filter(
      (appointment) =>
         appointment.status === 'completed' && isPast(appointment.date)
   )
   const confirmedAppointments = appointmentsData.filter(
      (a) => a.status === 'confirmed' && isPast(a.date)
   )

   const waitingForCashout = appointmentsData.filter(
      (a) => a.status === 'completed'
   )

   const donePercentage =
      (completedAppointments.filter((a) => isToday(a.date)).length /
         todayAppoinments.length) *
      100

   const allAppointments = useMemo(() => {
      return data
         .filter((appointment) => {
            return (
               appointment.status !== 'cancelled' && isToday(appointment.date)
            )
         })
         .reduce((total, appointment) => {
            const serviceEarnings = appointment.services.reduce(
               (serviceTotal, service) => {
                  return serviceTotal + service.price * service.quantity
               },
               0
            )
            return total + serviceEarnings
         }, 0)
   }, [data])

   const confirmedTotal = calculateEarningsByFilter(
      appointmentsData,
      'today',
      'completed'
   )
   useStatusBarColor('light')

   if (!appointmentsData || loading) return

   return (
      <View className="flex-1 bg-background">
         <View className="flex-1 gap-2">
            <HomeBarberHeader
               totalHours={totalHours}
               confirmedTotal={confirmedTotal}
               allAppointments={allAppointments}
            />
            <ScrollView
               className="flex-1"
               contentContainerStyle={{ marginBottom: 16, gap: 16 }}
               showsVerticalScrollIndicator={false}
            >
               {todayAppoinments.length > 0 && (
                  <View className="w-full p-2">
                     <Text className="text-center">
                        {translation('appointment', 'filter', 'Completed')}{' '}
                        {
                           completedAppointments.filter((a) => isToday(a.date))
                              .length
                        }{' '}
                        out of {todayAppoinments.length}
                     </Text>
                     <ProgressBar
                        value={
                           donePercentage > 0 ? +donePercentage.toFixed(1) : 0.0
                        }
                     />
                  </View>
               )}
               {user?.isBarber &&
                  user.isActive &&
                  user.subscriptionStatus === 'trialing' && (
                     <View className="gap-2 rounded-md bg-card p-2 shadow-sm">
                        <Text className="mb-2 text-center font-roboto-bold text-xl">
                           {daysRemaining > 0
                              ? `Your account is on ${DAYS} days Free-trial`
                              : 'Your Free-Trial Expired'}
                        </Text>
                        <Text className="text-center text-sm text-muted">
                           created at: {format(user.createdAt, 'PPpp')}
                        </Text>
                        <Text className="text-center">
                           Remainging Days {daysRemaining}
                        </Text>
                        <View className="self-center">
                           <Button
                              title="Subscribe Now"
                              textStyle={{ paddingHorizontal: 12 }}
                              onPress={() => router.push('/subscription')}
                           />
                        </View>
                     </View>
                  )}
               {user?.isBarber &&
                  user.isActive &&
                  user.subscriptionStatus !== 'trialing' &&
                  user.subscriptionStatus !== 'active' && (
                     <View className="gap-2 rounded-md bg-card p-2 py-3">
                        <Text className="mb-2 text-center font-roboto-bold">
                           You must subscribe in order to get appointments
                        </Text>
                        <View className="self-center animate-pulse">
                           <Button
                              title="Subscribe Now"
                              textStyle={{ paddingHorizontal: 12 }}
                              onPress={() => router.push('/subscription')}
                           />
                        </View>
                     </View>
                  )}
               {services.length === 0 && (
                  <View className="mt-5 w-full items-center justify-center gap-2 p-1">
                     <Text className="text-center text-2xl text-muted dark:text-slate-300 mb-3">
                        {translation('barber', 'no_services')}
                     </Text>
                     <View className="p-2">
                        <Text variant="footnote" className="text-lg">
                           Please add services to get started. You wont be able
                           to receive appointments if you dont have at least a
                           service listed.
                        </Text>
                     </View>

                     <View className="animate-bounce">
                        <Button
                           textStyle={{ paddingHorizontal: 20 }}
                           title="Add Service"
                           onPress={() => {
                              router.push({
                                 pathname: '/(barber-tabs)/gallery',
                                 params: { show: 'true' }
                              })
                           }}
                        />
                     </View>
                  </View>
               )}
               {services.length > 0 && (
                  <View className="gap-3">
                     <View className="bg-card p-2">
                        <Text variant="title3">
                           {translation('home', 'appointment', 'upcoming')}
                        </Text>
                        {myNextAppointment ? (
                           <SwipleableAppoimentListItem
                              index={0}
                              showDate
                              item={myNextAppointment}
                              dateTextStyle={{ color: 'grey' }}
                              onPress={() => {
                                 router.push({
                                    pathname: '/barber-appointment-view',
                                    params: {
                                       appointmentId: myNextAppointment.id
                                    }
                                 })
                              }}
                           />
                        ) : (
                           <View className="p-2">
                              <Text className="text-muted dark:text-slate-300">
                                 {translation(
                                    'home',
                                    'appointment',
                                    'no_appointment'
                                 )}
                              </Text>
                           </View>
                        )}
                     </View>
                     <WaitingAppoinmentCard
                        title={translation('home', 'waiting', 'confirmation')}
                        appointments={waitinfForConfirmation}
                     />

                     <WaitingAppoinmentCard
                        title={translation('home', 'waiting', 'cashout')}
                        appointments={confirmedAppointments}
                     />
                  </View>
               )}
            </ScrollView>
         </View>
      </View>
   )
}

export default BarberHome
