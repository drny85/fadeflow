import { addMinutes, format } from 'date-fns'
import { AnimatePresence, MotiView } from 'moti'
import { ScrollView, View } from 'react-native'

import TimeSlotPickerComponent from './TimeSlotsPicker'
import WeekSelector from './WeekSelectorComponent'
import { Button } from '../Button'
import { Text } from '../nativewindui/Text'

import { toastMessage } from '~/lib/toast'
import { useAppointmentFlowStore } from '~/providers/useAppoitmentFlowStore'
import { Barber } from '~/shared/types'
import { getBookingDate } from '~/utils/getBookingDate'
import { getAppointmentDuration } from '~/utils/getAppointmentDuration'

type Props = {
   onPress: () => void
   barber: Barber
}
const DateTimeAppointmentPicker = ({ onPress, barber }: Props) => {
   const { selectedDate, selectedTimeSlot, selectedServices } =
      useAppointmentFlowStore()

   return (
      <View className="bg-card">
         <ScrollView contentContainerClassName="gap-3 p-2 mt-3 bg-card">
            <View>
               <Text className="mb-1 ml-2 text-lg font-semibold text-slate-600 dark:text-white">
                  Date
               </Text>
               <WeekSelector
                  schedule={barber.schedule}
                  blockedDays={barber.blockedTimes || []}
               />
            </View>

            <View className="mt-3">
               <Text
                  variant="subhead"
                  className="mb-1 ml-2 text-lg font-semibold text-slate-600 dark:text-white"
               >
                  Time
               </Text>
               <TimeSlotPickerComponent barber={barber} />
            </View>
         </ScrollView>
         <AnimatePresence>
            {selectedDate && selectedTimeSlot && (
               <MotiView
                  from={{ opacity: 0, translateY: -20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing' }}
                  exit={{ opacity: 0, translateY: -20 }}
               >
                  <View className="gap-2 items-center mb-3">
                     <Text className="text-center font-roboto-bold text-muted dark:text-slate-300">
                        {format(selectedDate, 'E, PP')}
                     </Text>
                     <Text className="font-roboto-bold text-muted dark:text-slate-300">
                        {selectedTimeSlot.time} -
                        {format(
                           addMinutes(
                              getBookingDate(
                                 new Date(selectedDate),
                                 selectedTimeSlot.time
                              ),
                              getAppointmentDuration(selectedServices)
                           ),
                           'p'
                        )}
                     </Text>
                  </View>
               </MotiView>
            )}
         </AnimatePresence>
         <View className="mx-4">
            <Button
               iconName="save"
               style={{ paddingHorizontal: 20, marginBottom: 10 }}
               title="Save Appointment"
               disabled={!selectedDate}
               onPress={() => {
                  if (selectedDate && selectedTimeSlot) {
                     onPress()
                  }
                  if (!selectedTimeSlot) {
                     toastMessage({
                        preset: 'error',
                        title: 'Error',
                        message: 'Please select a time slot',
                        duration: 2
                     })
                  }
               }}
            />
         </View>
      </View>
   )
}

export default DateTimeAppointmentPicker
