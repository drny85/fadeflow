import { format, isToday } from 'date-fns'
import React from 'react'
import { Alert, TextStyle, TouchableOpacity, View } from 'react-native'
import Animated, { SlideInLeft } from 'react-native-reanimated'

import SwipeableComponent from './SwipeableComponent'
import { Text } from './nativewindui/Text'

import { handleAppointmentUpdates } from '~/actions/appointments'
import { useTranslate } from '~/hooks/useTranslation'
import { translation } from '~/locales/translate'
import { useAuth } from '~/providers/AuthContext'
import { Appointment } from '~/shared/types'
import { getAppointmentDuration } from '~/utils/getAppointmentDuration'

type Props = {
   item: Appointment
   index: number
   onPress: () => void
   disabled?: boolean
   showDate?: boolean
   dateTextStyle?: TextStyle
}

const SwipleableAppoimentListItem = ({
   item,
   index,
   onPress,
   showDate = false,
   disabled = false,
   dateTextStyle
}: Props) => {
   const { user } = useAuth()
   const translate = useTranslate()
   const handleCancelBack = async (): Promise<boolean> => {
      try {
         if (item.status === 'pending') {
            Alert.alert(
               translation('alerts', 'cancel', 'title'),
               translation('alerts', 'cancel', 'message'),
               [
                  {
                     text: translation('button', 'cancel'),
                     style: 'cancel'
                  },
                  {
                     text: translation('alerts', 'cancel', 'yes'),
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

   const statusColor =
      item.status === 'cancelled'
         ? 'border-l-red-500'
         : item.status === 'pending'
           ? 'border-l-orange-400'
           : 'border-l-green-500'

   return (
      <Animated.View
         entering={SlideInLeft.delay(index * 200)}
         style={{ marginVertical: 4 }}
      >
         <Text style={dateTextStyle} className="font-roboto-bold ml-2">
            {showDate
               ? `${isToday(item.date) ? translation('appointment', 'today') : format(item.date, 'PP')} at ${item.startTime}`
               : item.startTime}
         </Text>
         <SwipeableComponent
            disabled={item.status === 'cancelled' || disabled}
            status={item.status}
            onCancel={handleCancelBack}
            onConfirm={async () => {
               return await handleAppointmentUpdates(item)
            }}
         >
            <TouchableOpacity
               onPress={onPress}
               className={`bg-card mb-1 p-2 rounded-md border-l-4 flex-row justify-between items-center ${statusColor}`}
            >
               <View className="bg-card p-2 rounded-md gap-1">
                  <View className="flex-row items-center gap-2">
                     <Text className="font-raleway">
                        {user && user.isBarber
                           ? item.customer.name
                           : item.barber.name}
                     </Text>
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
                     {translate(
                        `appointment.filter.${item.status.charAt(0).toUpperCase() + item.status.slice(1)}`
                     )}
                  </Text>
               </View>
            </TouchableOpacity>
         </SwipeableComponent>
      </Animated.View>
   )
}

export default SwipleableAppoimentListItem
