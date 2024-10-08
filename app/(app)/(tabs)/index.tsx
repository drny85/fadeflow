import { isPast } from 'date-fns'
import { BlurView } from 'expo-blur'
import Constants from 'expo-constants'
import { router } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

import AppointmentCard from '~/components/Appointment/AppointmentCard'
import BarberCard from '~/components/BarberCard'
import { Button } from '~/components/Button'
import MapHeader from '~/components/MapHeader'
import ParallaxScrollView from '~/components/ParallaxScrollView'
import HomeSkelenton from '~/components/Skeletons/HomeSkeleton'
import { Text } from '~/components/nativewindui/Text'
import { useLocation } from '~/hooks/useLocation'
import { useStatusBarColor } from '~/hooks/useStatusBarColor'
import { useAuth } from '~/providers/AuthContext'
import { useAppointmentStore } from '~/providers/useAppointmentStore'
import { useBarbersStore } from '~/providers/useBarbersStore'
import { COLORS } from '~/theme/colors'
import { getDistanceFromLatLonInMeters } from '~/utils/getDistanceBetweenLocations'
import { useTranslation } from 'react-i18next'

const Home = () => {
   const { t } = useTranslation()
   const { user, loading: loadingUser } = useAuth()
   const { location, loading } = useLocation()
   const favoriteBarber =
      !user?.isBarber && user?.favoriteBarber ? user?.favoriteBarber : undefined
   const { getBarberById } = useBarbersStore()
   const barber = getBarberById(favoriteBarber!)
   const distance =
      location &&
      barber &&
      barber.profile &&
      barber.profile.coords &&
      !loading &&
      getDistanceFromLatLonInMeters(barber.profile.coords, {
         lat: location?.coords.latitude,
         lng: location?.coords.longitude
      })

   const apppoitments = useAppointmentStore((state) =>
      state.appointments.filter((a) => a.customer.id === user?.id)
   )
   const appointment = apppoitments
      .filter(
         (app) =>
            app.status !== 'completed' &&
            app.status !== 'cancelled' &&
            !isPast(app.date)
      )
      .sort((a, b) => (a.date > b.date ? 1 : -1))

   useStatusBarColor('light')
   if (loading || loadingUser) return <HomeSkelenton />
   return (
      <View className="flex-1">
         <ParallaxScrollView
            headerBackgroundColor={{
               light: COLORS.light.background,
               dark: COLORS.dark.background
            }}
            headerImage={
               <>
                  <MapHeader
                     shouldGoBack={false}
                     containerStyle={{ flex: 1 }}
                  />
                  <BlurView
                     tint="light"
                     className="absolute bottom-0 left-0 right-0 z-10 gap-1 overflow-hidden rounded-md  px-2 py-3"
                     intensity={40}
                  >
                     {favoriteBarber && barber && distance ? (
                        <View>
                           <View className="flex-row items-center justify-between">
                              <Text
                                 variant="title3"
                                 className="text-slate-700 dark:text-slate-300"
                              >
                                 {barber.profile?.barbershopName}
                              </Text>
                              {distance && (
                                 <Text className="text-slate-700 font-roboto-bold dark:text-slate-300">
                                    {distance.toFixed(1)} {t('home.miles')}
                                 </Text>
                              )}
                           </View>
                           <Text className=" text-sm text-slate-700 dark:text-white">
                              {barber.profile?.address.slice(
                                 0,
                                 barber.profile.address.length - 5
                              )}
                           </Text>
                        </View>
                     ) : (
                        <View className="p-3">
                           <Text className="font-raleway-bold text-2xl text-slate-300 dark:text-slate-400">
                              {Constants.expoConfig?.name}
                           </Text>
                        </View>
                     )}
                  </BlurView>
               </>
            }
         >
            <View className=" gap-2 rounded-lg bg-card p-2 shadow-sm">
               <Text variant="title2">{t('home.appointment.upcoming')}</Text>
               {appointment.length > 0 ? (
                  <AppointmentCard
                     appointmentId={appointment[0].id!}
                     onPress={(apt) => {
                        router.push({
                           pathname: '/appointment',
                           params: { appointmentId: apt.id }
                        })
                     }}
                  />
               ) : (
                  <View className="gap-3">
                     <Text className="text-muted dark:text-slate-400">
                        {t('home.appointment.no_appointment')}
                     </Text>
                     <View className="w-1/2 self-center">
                        <Button
                           title={t('button.book')}
                           onPress={() => router.push('/quick-booking')}
                        />
                     </View>
                  </View>
               )}
            </View>
            <View className="gap-2 rounded-l bg-card p-2 shadow-sm">
               <Text variant="title2">{t('home.my_barber')}</Text>
               {!user?.isBarber && user?.favoriteBarber && barber ? (
                  <BarberCard barber={barber} index={0} isOwner={false} />
               ) : (
                  <View className="gap-3">
                     <Text className="text-muted dark:text-slate-400">
                        {t('home.appointment.no_barber')}
                     </Text>
                     <View className="w-1/2 self-center">
                        <Button
                           title={t('home.find_barber')}
                           onPress={() => router.push('/quick-booking')}
                        />
                     </View>
                  </View>
               )}
            </View>
            {!user && (
               <View className="gap-4 rounded-l bg-card p-2 shadow-sm">
                  <Text variant="title3">{t('home.signup')}</Text>
                  <View className="w-1/2 self-center">
                     <Button
                        title={t('home.signup_title')}
                        onPress={() =>
                           router.push({
                              pathname: '/login',
                              params: {
                                 mode: 'register',
                                 isBarber: 'true'
                              }
                           })
                        }
                     />
                  </View>
               </View>
            )}
         </ParallaxScrollView>
      </View>
   )
}

export default Home
