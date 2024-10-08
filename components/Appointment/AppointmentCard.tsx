import { format } from 'date-fns'
import { Image } from 'expo-image'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { Text } from '../nativewindui/Text'

import { useTranslate } from '~/hooks/useTranslation'
import { useAuth } from '~/providers/AuthContext'
import { useAppointmentStore } from '~/providers/useAppointmentStore'
import { Appointment } from '~/shared/types'
import { getAppointmentDuration } from '~/utils/getAppointmentDuration'
import { getAppointmentPrice } from '~/utils/getAppointmentPrice'

type Props = {
   appointmentId: string
   onPress: (item: Appointment) => void
   actionsButton?: React.ReactNode
}
const AppointmentCard = ({ appointmentId, onPress, actionsButton }: Props) => {
   const translate = useTranslate()
   const { user } = useAuth()
   const { getAppointment } = useAppointmentStore()
   const item = getAppointment(appointmentId)
   const duration = getAppointmentDuration(item?.services || [])

   if (!item) return null

   return (
      <View className="my-1 items-center gap-2 rounded-md bg-card p-2">
         <TouchableOpacity
            onPress={() => onPress(item)}
            className="my-1 flex-row items-center gap-2"
         >
            <View style={{ width: '35%' }}>
               <Image
                  source={
                     item.customer.image
                        ? { uri: item.customer.image }
                        : require('~/assets/images/banner.png')
                  }
                  contentFit="cover"
                  style={{ width: 100, height: 100, borderRadius: 50 }}
               />
               <View
                  className={`${item.status === 'confirmed' ? 'bg-green-400' : item.status === 'pending' ? 'bg-orange-400' : item.status === 'cancelled' ? 'bg-primary' : 'bg-gray-400'} absolute -bottom-1 left-0 right-0 w-[80%] rounded-2xl p-1 px-2`}
               >
                  <Text className="text-center text-sm font-semibold capitalize text-white">
                     {translate(
                        `appointment.filter.${item.status.charAt(0).toUpperCase() + item.status.slice(1)}`
                     )}
                  </Text>
               </View>
            </View>
            <View className="flex-1">
               <Text variant="heading">
                  {user?.isBarber ? item.customer.name : item.barber.name}
               </Text>
               <View>
                  {item.services.map((s, index) => (
                     <Text
                        className="font-raleway-bold text-muted dark:text-white"
                        key={s.id}
                     >
                        {s.name} {s.quantity > 1 ? `x ${s.quantity}` : ''}{' '}
                        {index !== item.services.length - 1 && ','}
                     </Text>
                  ))}
               </View>
               <Text className="text-muted dark:text-white">
                  Price: ${getAppointmentPrice(item.services)}
               </Text>
               <View className="flex-row items-center gap-2">
                  <Text className="text-sm text-muted dark:text-white">
                     At {item.startTime}
                  </Text>
                  <View className="h-1 w-1 rounded-full bg-muted dark:bg-slate-300" />
                  <Text className="text-sm text-muted dark:text-white">
                     {duration} mins
                  </Text>
               </View>
               <Text className="text-sm text-muted dark:text-white">
                  Price: ${getAppointmentPrice(item.services)}
               </Text>
               <Text className="text-sm text-muted dark:text-white">
                  {translate(`days.${format(item.date, 'ccc')}`)} -{' '}
                  {format(item.date, 'PPP')}
               </Text>
               {/* <Text className="text-sm text-muted dark:text-white">
                  ({formatDistanceToNow(new Date(item.date))}){' '}
                  {isPast(new Date(item.date)) ? 'ago' : 'from now'}
               </Text> */}
            </View>
         </TouchableOpacity>
         {actionsButton && actionsButton}
      </View>
   )
}

export default AppointmentCard
