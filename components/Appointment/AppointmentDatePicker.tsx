import { Feather } from '@expo/vector-icons'
import { addMinutes, format } from 'date-fns'
import React from 'react'
import { View, TouchableOpacity } from 'react-native'

import { Text } from '../nativewindui/Text'

import { useTranslate } from '~/hooks/useTranslation'
import { useAppointmentFlowStore } from '~/providers/useAppoitmentFlowStore'
import { getBookingDate } from '~/utils/getBookingDate'
import { translation } from '~/locales/translate'

type Props = {
   onPress: () => void
}
const AppointmentDatePicker = ({ onPress }: Props) => {
   const translate = useTranslate()
   const { selectedDate, selectedTimeSlot, selectedServices } =
      useAppointmentFlowStore()
   const duration = selectedServices?.reduce(
      (acc, curr) => acc + curr.duration * curr.quantity,
      0
   )
   return (
      <TouchableOpacity
         onPress={onPress}
         className="m-2 rounded-xl bg-card p-2 px-4 shadow-sm"
      >
         <View className="flex-row items-center  justify-between">
            <View className="gap-1">
               <Text className="font-roboto-bold">
                  {selectedDate && selectedTimeSlot
                     ? `${translate(
                          `longDays.${format(
                             getBookingDate(
                                selectedDate,
                                selectedTimeSlot?.time
                             ),
                             'cccc'
                          )}`
                       )}, ${format(
                          getBookingDate(selectedDate, selectedTimeSlot?.time),
                          'PP'
                       )}`
                     : translation('booking', 'no_date_title')}
               </Text>
               {selectedTimeSlot && (
                  <View>
                     <View className="flex-row items-center gap-x-2">
                        <Text className="text-lg font-semibold text-muted dark:text-white">
                           {selectedTimeSlot.time}
                        </Text>
                        {selectedServices.length > 0 && (
                           <Text className="text-lg font-semibold text-muted dark:text-white">
                              -{' '}
                              {format(
                                 addMinutes(
                                    getBookingDate(
                                       selectedDate,
                                       selectedTimeSlot?.time
                                    ),
                                    duration
                                 ),
                                 'p'
                              )}
                           </Text>
                        )}
                     </View>
                     {selectedServices.length > 0 && (
                        <Text className="text-sm text-muted dark:text-white">
                           Duration: {duration} mins
                        </Text>
                     )}
                  </View>
               )}
               {!selectedTimeSlot && (
                  <Text className="text-lg font-normal text-muted dark:text-white dark:opacity-70">
                     {translation('booking', 'no_date_message')}
                  </Text>
               )}
            </View>
            <View>
               <Feather name="edit" size={22} color="grey" />
            </View>
         </View>
      </TouchableOpacity>
   )
}

export default AppointmentDatePicker
