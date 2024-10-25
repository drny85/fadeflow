import { format } from 'date-fns'
import { router } from 'expo-router'
import React from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'

import { Text } from '~/components/nativewindui/Text'

import { translation } from '~/locales/translate'
import { Appointment } from '~/shared/types'

type Props = {
   appointments: Appointment[]
   title: string
}

const WaitingAppoinmentCard = ({ appointments, title }: Props) => {
   return (
      <View className="rounded-md bg-card p-2 shadow-sm">
         <Text variant="title3">
            {title} ({appointments.length})
         </Text>
         <FlatList
            data={appointments.sort((a, b) => (a.date > b.date ? 1 : -1))}
            horizontal
            contentContainerClassName="mb-3"
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={
               <View className="p-2">
                  <Text className="text-muted dark:text-slate-300">
                     {translation('appointment', 'no_appointment')}
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
                     <Text className="font-roboto-bold text-muted dark:text-slate-300">
                        {format(item.date, 'eee')}
                        <Text className="text-sm text-muted dark:text-slate-400">
                           ({format(item.date, 'dd')})
                        </Text>
                     </Text>
                     <Text>{item.startTime}</Text>
                  </TouchableOpacity>
               )
            }}
         />
      </View>
   )
}

export default WaitingAppoinmentCard
