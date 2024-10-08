import { Feather } from '@expo/vector-icons'
import {
   addDays,
   addMinutes,
   differenceInDays,
   format,
   isPast,
   isToday
} from 'date-fns'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useMemo, Fragment } from 'react'
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import AnimatedNumber from '~/components/AnimatedNumber'
import { Button } from '~/components/Button'
import ProgressBar from '~/components/ProgressBar'
import SwipleableAppoimentListItem from '~/components/SwipleableAppoimentListItem'
import { Text } from '~/components/nativewindui/Text'
import { useServices } from '~/hooks/useServices'
import { useStatusBarColor } from '~/hooks/useStatusBarColor'
import { useColorScheme } from '~/lib/useColorScheme'
import { useAuth } from '~/providers/AuthContext'
import { useAppointmentStore } from '~/providers/useAppointmentStore'
import { calculateEarningsByFilter } from '~/utils/calculateEarningByFilter'
import { convertMinutesToHours } from '~/utils/convertMinutesIntoHours'
import { shareBarberLink } from '~/utils/shareBarberLink'

const DAYS = process.env.EXPO_PUBLIC_FREE_TRIAL_DAYS!

const BarberHome = () => {
   const { user } = useAuth()
   const { colors } = useColorScheme()
   const daysRemaining = differenceInDays(
      addDays(user?.createdAt!, +DAYS),
      new Date()
   )
   const { top } = useSafeAreaInsets()
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
      (a) => a.status === 'pending' && !isPast(addMinutes(a.date, 30))
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
   const completedAppointments = todayAppoinments.filter(
      (appointment) => appointment.status === 'completed'
   )
   const confirmedAppointments = todayAppoinments.filter(
      (appointment) =>
         appointment.status === 'confirmed' &&
         isPast(addMinutes(appointment.date, 30))
   )

   const donePercentage =
      (completedAppointments.length / todayAppoinments.length) * 100

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
            <View
               style={{
                  paddingTop: top,
                  height: '45%',
                  shadowOffset: { height: 3, width: 0 },
                  shadowColor: colors.grey,
                  shadowOpacity: 0.5,
                  shadowRadius: 5,
                  elevation: 5
               }}
               className="rounded-3xl bg-accent p-2"
            >
               <View className="flex-row items-center justify-between">
                  <TouchableOpacity
                     onPress={() => router.replace('/barber-profile')}
                  >
                     <Image
                        source={
                           user?.image
                              ? { uri: user.image }
                              : require('~/assets/images/banner.png')
                        }
                        style={{
                           height: 60,
                           width: 60,
                           borderRadius: 30,
                           objectFit: 'cover'
                        }}
                     />
                  </TouchableOpacity>
                  <Text className="font-raleway text-2xl text-white">
                     Hi {user?.name?.split(' ')[0]}
                  </Text>
                  {user && (
                     <TouchableOpacity
                        onPress={() => shareBarberLink(user?.id!)}
                        className="h-10 w-10 items-center justify-center rounded-full bg-slate-200 p-1"
                     >
                        <Feather name="share" size={26} color={colors.accent} />
                     </TouchableOpacity>
                  )}
               </View>
               <Text className="mt-2 text-center text-white">
                  {new Date().toDateString()}
               </Text>
               {services.length > 0 && (
                  <View className="mt-2 flex-1 items-center justify-center gap-4 p-2">
                     <Text className="text-white" variant="title3">
                        Today's Estimated
                     </Text>
                     <AnimatedNumber
                        textStyle={{ fontSize: 32, color: 'white' }}
                        value={allAppointments}
                     />
                     <View className="w-full flex-row justify-evenly">
                        <View className="items-center justify-center">
                           <Text className="text-slate-300">Pending</Text>
                           <AnimatedNumber
                              value={allAppointments - confirmedTotal}
                              textStyle={{ color: 'white' }}
                           />
                        </View>
                        <View className="items-center justify-center">
                           <Text className="text-muted text-slate-300">
                              Earned
                           </Text>
                           <AnimatedNumber
                              value={confirmedTotal}
                              textStyle={{ color: 'white' }}
                           />
                        </View>
                     </View>
                     <Text className="text-white font-roboto-bold">
                        Total Hrs: {convertMinutesToHours(totalHours)}
                     </Text>
                  </View>
               )}
            </View>
            <ScrollView
               className="flex-1"
               contentContainerStyle={{ marginBottom: 16, gap: 16 }}
               showsVerticalScrollIndicator={false}
            >
               {todayAppoinments.length > 0 && (
                  <View className="w-full p-2">
                     <Text className="text-center">
                        Completed {completedAppointments.length} out of{' '}
                        {todayAppoinments.length}
                     </Text>
                     <ProgressBar
                        value={donePercentage > 0 ? donePercentage : 0.0}
                     />
                  </View>
               )}
               {user?.isBarber &&
                  user.isActive &&
                  user.subscriptionStatus !== 'active' && (
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
               {services.length === 0 && (
                  <View className="mt-5 w-full items-center justify-center gap-2 p-1">
                     <Text className="text-center text-2xl text-muted dark:text-slate-300 mb-3">
                        No services available
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
                  <View>
                     <View className="bg-card p-2">
                        <Text variant="title3">Next Appointment</Text>
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
                                 No Appointments Scheduled
                              </Text>
                           </View>
                        )}
                     </View>

                     <View className="rounded-md bg-card p-2 shadow-sm mb-3">
                        <Text variant="title3">
                           Waiting for confirmation (
                           {waitinfForConfirmation.length})
                        </Text>
                        <FlatList
                           data={waitinfForConfirmation.sort((a, b) =>
                              a.date > b.date ? 1 : -1
                           )}
                           horizontal
                           showsHorizontalScrollIndicator={false}
                           ListEmptyComponent={
                              <View className="p-2">
                                 <Text className="text-muted capitalize dark:text-slate-300">
                                    All appointments have been confirmed
                                 </Text>
                              </View>
                           }
                           renderItem={({ item }) => {
                              return (
                                 <TouchableOpacity
                                    onPress={() =>
                                       router.push({
                                          pathname: '/barber-appointment-view',
                                          params: {
                                             appointmentId: item.id
                                          }
                                       })
                                    }
                                    className="m-2 items-center justify-center rounded-md bg-background p-2 shadow-sm"
                                 >
                                    <Text className="font-semibold">
                                       {format(item.date, 'eee')} (
                                       <Text className="text-sm text-muted dark:text-slate-400">
                                          {' '}
                                          {format(item.date, 'dd')})
                                       </Text>
                                    </Text>
                                    <Text>{item.startTime}</Text>
                                 </TouchableOpacity>
                              )
                           }}
                        />
                     </View>
                     {confirmedAppointments.length > 0 && (
                        <View className="rounded-md bg-card p-2 shadow-sm">
                           <Text variant="title3">
                              Waiting to cash out (
                              {confirmedAppointments.length})
                           </Text>
                           <FlatList
                              data={confirmedAppointments.sort((a, b) =>
                                 a.date > b.date ? 1 : -1
                              )}
                              horizontal
                              contentContainerClassName="mb-3"
                              ListEmptyComponent={
                                 <View className="p-2">
                                    <Text className="text-muted dark:text-slate-300">
                                       No data
                                    </Text>
                                 </View>
                              }
                              renderItem={({ item }) => {
                                 return (
                                    <TouchableOpacity
                                       onPress={() =>
                                          router.push({
                                             pathname:
                                                '/barber-appointment-view',
                                             params: {
                                                appointmentId: item.id
                                             }
                                          })
                                       }
                                       className="m-2 items-center justify-center rounded-md bg-background p-2 shadow-sm"
                                    >
                                       <Text className="font-semibold">
                                          {format(item.date, 'eee')} (
                                          <Text className="text-sm text-muted dark:text-slate-400">
                                             {' '}
                                             {format(item.date, 'dd')})
                                          </Text>
                                       </Text>
                                       <Text>{item.startTime}</Text>
                                    </TouchableOpacity>
                                 )
                              }}
                           />
                        </View>
                     )}
                  </View>
               )}
            </ScrollView>
         </View>
      </View>
   )
}

export default BarberHome
