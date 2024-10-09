import { format } from 'date-fns'
import { AnimatePresence, MotiView } from 'moti'
import { ScrollView, View } from 'react-native'

import TimeSlotPickerComponent from './TimeSlotsPicker'
import WeekSelector from './WeekSelectorComponent'
import { Button } from '../Button'
import { Text } from '../nativewindui/Text'

import { toastMessage } from '~/lib/toast'
import { useAppointmentFlowStore } from '~/providers/useAppoitmentFlowStore'
import { Barber } from '~/shared/types'

type Props = {
   onPress: () => void
   barber: Barber
}
const DateTimeAppointmentPicker = ({ onPress, barber }: Props) => {
   const { selectedDate, selectedTimeSlot } = useAppointmentFlowStore()

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
                  <Text className="text-center font-roboto-bold mb-5">
                     {format(selectedDate, 'E, PP')} at {selectedTimeSlot.time}
                  </Text>
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
