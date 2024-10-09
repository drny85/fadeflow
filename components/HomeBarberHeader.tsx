import { Feather } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'
import { Image, ImageBackground } from 'expo-image'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useServices } from '~/hooks/useServices'
import { useColorScheme } from '~/lib/useColorScheme'
import { useAuth } from '~/providers/AuthContext'
import { convertMinutesToHours } from '~/utils/convertMinutesIntoHours'
import { shareBarberLink } from '~/utils/shareBarberLink'
import AnimatedNumber from './AnimatedNumber'
import { Text } from './nativewindui/Text'

type Props = {
   confirmedTotal: number
   allAppointments: number
   totalHours: number
}

const HomeBarberHeader = ({
   allAppointments,
   confirmedTotal,
   totalHours
}: Props) => {
   const { user } = useAuth()
   const [opacity, setOpacity] = useState(0.5)
   const { colors } = useColorScheme()
   const { top } = useSafeAreaInsets()
   const { services } = useServices(user?.id!)
   return (
      <View
         style={{
            paddingTop: top,
            height: '48%',
            shadowOffset: { height: 3, width: 0 },
            //shadowColor: colors.grey,
            shadowOpacity: 0.5,
            shadowRadius: 3,
            borderRadius: 24,
            overflow: 'hidden',
            elevation: 5
         }}
         className="rounded-3xl bg-accent p-2"
      >
         {user?.image && (
            <View
               style={{
                  left: 0,
                  right: 0,
                  bottom: 0,
                  top: 0,
                  position: 'absolute',
                  zIndex: -2
               }}
            >
               <ImageBackground
                  source={user?.image}
                  blurRadius={0.0}
                  style={{
                     opacity,
                     borderRadius: 24,
                     width: '100%',
                     height: '100%'
                  }}
               />
            </View>
         )}
         {user?.image && (
            <Slider
               style={{
                  position: 'absolute',
                  bottom: 0,
                  zIndex: 2,
                  left: 10,
                  right: 10
               }}
               minimumValue={0.1}
               maximumValue={1}
               step={0.1}
               value={opacity}
               onValueChange={(value) => setOpacity(value)}
               minimumTrackTintColor={colors.primary}
               maximumTrackTintColor="#d3d3d3"
               thumbTintColor={'#ffffff'}
            />
         )}
         <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.replace('/barber-profile')}>
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
         {services.length > 0 &&
            user?.isBarber &&
            (user.subscriptionStatus === 'active' ||
               user.subscriptionStatus === 'trialing') && (
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
                  {totalHours > 0 && (
                     <Text className="text-white font-roboto-bold">
                        Total Hrs: {convertMinutesToHours(totalHours)}
                     </Text>
                  )}
               </View>
            )}
      </View>
   )
}

export default HomeBarberHeader
