import { View, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { Appointment } from '~/shared/types'
import Animated, { SlideInLeft } from 'react-native-reanimated'
import SwipeableComponent from './SwipeableComponent'
import { router } from 'expo-router'
import { getAppointmentDuration } from '~/utils/getAppointmentDuration'
import { Text } from './nativewindui/Text'
import { handleAppointmentUpdates } from '~/actions/appointments'

type Props = {
   item: Appointment
   index: number
}

const SwipleableAppoimentListItem = ({ item, index }: Props) => {
   const statusColor =
      item.status === 'cancelled'
         ? 'border-l-red-500'
         : item.status === 'pending'
           ? 'border-l-orange-400'
           : 'border-l-green-500'

   const handleCancelBack = async (): Promise<boolean> => {
      try {
         if (item.status === 'pending') {
            Alert.alert(
               'Cancel Appointment',
               'Are you sure you want to cancel this appointment?',
               [
                  {
                     text: 'Cancel',
                     onPress: () => console.log('Cancel Pressed'),
                     style: 'cancel'
                  },
                  {
                     text: 'Yes, Cancel it',
                     style: 'destructive',
                     onPress: async () => {
                        await handleAppointmentUpdates(item, true)
                     }
                  }
               ]
            )
            return true
         }
         return true
      } catch (error) {
         console.log(error)
         return false
      }
   }

   return (
      <Animated.View entering={SlideInLeft.delay(index * 200)}>
         <Text className="font-roboto-bold ml-2">{item.startTime}</Text>
         <SwipeableComponent
            disable={item.status === 'cancelled'}
            status={item.status}
            onCancel={handleCancelBack}
            onConfirm={async () => {
               return await handleAppointmentUpdates(item)
            }}
         >
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
                     <Text className="font-raleway">{item.customer.name}</Text>
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
                           {s.name} {s.quantity > 1 ? `x ${s.quantity}` : ''}{' '}
                           {index !== item.services.length - 1 && ','}
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
         </SwipeableComponent>
      </Animated.View>
   )
}

export default SwipleableAppoimentListItem
