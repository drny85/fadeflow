import React, { useState } from 'react'
import {
   View,
   TouchableOpacity,
   StyleSheet,
   ScrollView,
   Switch,
   Platform,
   Alert
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { addHours, format, parse, startOfDay } from 'date-fns'
import Animated, { SlideInLeft, SlideOutRight } from 'react-native-reanimated'
import { Text } from '../nativewindui/Text'
import { Days, Schedule } from '~/shared/types'
import { Sheet, useSheetRef } from '../nativewindui/Sheet'
import ScheduleView from './ScheduleView'
import { useColorScheme } from '~/lib/useColorScheme'

const days: Record<Days, string> = {
   Sun: 'Sunday',
   Mon: 'Monday',
   Tue: 'Tuesday',
   Wed: 'Wednesday',
   Thu: 'Thursday',
   Fri: 'Friday',
   Sat: 'Saturday'
}

const initialSchedule: Schedule = {
   Sun: {
      isOff: true,
      lunchBreak: { start: '', end: '' },
      startTime: '',
      endTime: ''
   },
   Mon: {
      isOff: false,
      lunchBreak: { start: '12:00 PM', end: '01:00 PM' },
      startTime: '09:00 AM',
      endTime: '05:00 PM'
   },
   Tue: {
      isOff: false,
      lunchBreak: { start: '12:00 PM', end: '01:00 PM' },
      startTime: '09:00 AM',
      endTime: '05:00 PM'
   },
   Wed: {
      isOff: false,
      lunchBreak: { start: '12:00 PM', end: '01:00 PM' },
      startTime: '09:00 AM',
      endTime: '05:00 PM'
   },
   Thu: {
      isOff: false,
      lunchBreak: { start: '12:00 PM', end: '01:00 PM' },
      startTime: '09:00 AM',
      endTime: '05:00 PM'
   },
   Fri: {
      isOff: false,
      lunchBreak: { start: '12:00 PM', end: '01:00 PM' },
      startTime: '09:00 AM',
      endTime: '05:00 PM'
   },
   Sat: {
      isOff: true,
      lunchBreak: { start: '', end: '' },
      startTime: '',
      endTime: ''
   }
}
const daysOfWeek: Days[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
type Props = {
   defaultSchedule: Schedule
}

export default function ScheduleComponent({ defaultSchedule }: Props) {
   const [selectedDay, setSelectedDay] = useState<Days>('Sun')
   const { colors, isDarkColorScheme } = useColorScheme()
   const bottomSheetRef = useSheetRef()
   const [schedule, setSchedule] = useState<Schedule>(
      defaultSchedule || initialSchedule
   )
   const [showPicker, setShowPicker] = useState<{
      field: string | null
      mode: 'time'
   }>({ field: null, mode: 'time' })
   const [pickerValue, setPickerValue] = useState<Date | null>(null)

   // Function to validate lunch break time
   const isLunchBreakValid = (startTime: string, endTime: string) => {
      if (!startTime || !endTime) return true
      const parsedStartTime = parse(startTime, 'hh:mm a', new Date())
      const parsedEndTime = parse(endTime, 'hh:mm a', new Date())
      return parsedStartTime <= parsedEndTime
   }

   // Handle input changes for startTime, endTime, and lunchBreak
   const handleTimeChange = (
      day: Days,
      field: string,
      selectedDate: Date | undefined
   ) => {
      if (selectedDate) {
         const formattedTime = format(selectedDate, 'hh:mm a') // 12-hour format with AM/PM

         if (field.startsWith('lunch')) {
            const lunchField = field.split('.')[1]
            const newLunchBreak = {
               ...schedule[day].lunchBreak,
               [lunchField]: formattedTime
            }

            setSchedule((prev) => ({
               ...prev,
               [day]: { ...prev[day], lunchBreak: newLunchBreak }
            }))
         } else {
            setSchedule((prev) => ({
               ...prev,
               [day]: { ...prev[day], [field]: formattedTime }
            }))
         }
      }
   }

   // Toggle for isOff
   const handleToggleIsOff = (day: Days) => {
      setSchedule((prev) => ({
         ...prev,
         [day]: { ...prev[day], isOff: !prev[day].isOff }
      }))
   }

   return (
      <View style={styles.container}>
         {/* Day Selector */}
         <ScrollView
            horizontal
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            style={styles.daySelector}
         >
            {daysOfWeek.map((day) => (
               <TouchableOpacity
                  key={day}
                  onPress={() => setSelectedDay(day)}
                  style={[
                     {
                        ...styles.dayButton,
                        backgroundColor: colors.card
                     },
                     selectedDay === day && { backgroundColor: colors.primary }
                  ]}
               >
                  <Text style={selectedDay === day && styles.activeDayText}>
                     {day.substring(0, 3)}
                  </Text>
               </TouchableOpacity>
            ))}
         </ScrollView>
         <View className="self-center mb-2">
            <TouchableOpacity
               className="px-4 py-1 bg-primary rounded-md shadow-md"
               onPress={() => bottomSheetRef.current?.present()}
            >
               <Text variant={'title3'} className="text-white">
                  View Schedule
               </Text>
            </TouchableOpacity>
         </View>

         {/* Schedule Editor */}
         <Animated.View
            entering={SlideInLeft}
            exiting={SlideOutRight}
            style={styles.scheduleContainer}
         >
            <Text style={styles.dayTitle}>{days[selectedDay]}</Text>

            {/* Toggle for isOff */}
            <View style={styles.switchContainer}>
               <Text style={styles.switchLabel}>Day Off: </Text>
               <Switch
                  value={schedule[selectedDay].isOff}
                  onValueChange={() => handleToggleIsOff(selectedDay)}
                  thumbColor={
                     schedule[selectedDay].isOff ? '#f44336' : '#3D5AFE'
                  }
                  trackColor={{ false: '#767577', true: '#ff7961' }}
               />
            </View>

            {/* If the day is not off, show the editable schedule */}
            {!schedule[selectedDay].isOff ? (
               <>
                  <View className="flex-row items-center justify-between w-full gap-3 ">
                     {/* Start Time */}
                     <View className="flex-1">
                        <Text>Start Time</Text>
                        <TouchableOpacity
                           onPress={() =>
                              setShowPicker({
                                 field: 'startTime',
                                 mode: 'time'
                              })
                           }
                           style={styles.input}
                        >
                           <Text>
                              {schedule[selectedDay].startTime ||
                                 'Select Start Time'}
                           </Text>
                        </TouchableOpacity>
                     </View>

                     {/* End Time */}
                     <View className="flex-1">
                        <Text>End Time</Text>
                        <TouchableOpacity
                           onPress={() =>
                              setShowPicker({ field: 'endTime', mode: 'time' })
                           }
                           style={styles.input}
                        >
                           <Text>
                              {schedule[selectedDay].endTime ||
                                 'Select End Time'}
                           </Text>
                        </TouchableOpacity>
                     </View>
                  </View>

                  {/* Lunch Break */}
                  <View style={styles.lunchContainer}>
                     <Text style={styles.lunchLabel}>Lunch Break</Text>
                     <View className="flex-row items-center justify-between w-full gap-3 ">
                        <View className="flex-1">
                           <Text>Start Time</Text>
                           <TouchableOpacity
                              onPress={() =>
                                 setShowPicker({
                                    field: 'lunch.start',
                                    mode: 'time'
                                 })
                              }
                              style={styles.input}
                           >
                              <Text>
                                 {schedule[selectedDay].lunchBreak.start ||
                                    'Select Lunch Start Time'}
                              </Text>
                           </TouchableOpacity>
                        </View>
                        <View className="flex-1">
                           <Text>End Time</Text>
                           <TouchableOpacity
                              onPress={() =>
                                 setShowPicker({
                                    field: 'lunch.end',
                                    mode: 'time'
                                 })
                              }
                              style={styles.input}
                           >
                              <Text>
                                 {schedule[selectedDay].lunchBreak.end ||
                                    'Select Lunch End Time'}
                              </Text>
                           </TouchableOpacity>
                        </View>
                     </View>
                  </View>
               </>
            ) : (
               <Text style={styles.offText}>This day is marked as off.</Text>
            )}
         </Animated.View>

         {/* DateTimePicker Modal */}
         {showPicker.field && (
            <View>
               <TouchableOpacity
                  onPress={() => setShowPicker({ field: null, mode: 'time' })}
                  className="self-end p-2"
               >
                  <Text className="text-end text-blue-600 font-roboto-bold">
                     Done
                  </Text>
               </TouchableOpacity>
               <DateTimePicker
                  value={pickerValue || addHours(startOfDay(new Date()), 8)}
                  mode="time"
                  minuteInterval={15}
                  maximumDate={addHours(startOfDay(new Date()), 23)}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  is24Hour={false} // Ensures the picker is in 12-hour format
                  onChange={(event, selectedDate) =>
                     handleTimeChange(
                        selectedDay,
                        showPicker.field!,
                        selectedDate!
                     )
                  }
               />
            </View>
         )}
         <Sheet snapPoints={['80%']} ref={bottomSheetRef}>
            <TouchableOpacity className="self-end p-2 mr-2">
               <Text className="text-red-600 font-roboto-bold">Close</Text>
            </TouchableOpacity>
            <View className="items-center h-1/2">
               <Text variant={'largeTitle'}>Schedule View</Text>
               <Text variant={'subhead'} className="my-2">
                  This is the client's view
               </Text>
               <ScheduleView schedule={schedule} />
            </View>
         </Sheet>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 10
   },
   daySelector: {
      flexDirection: 'row',
      marginBottom: 20,
      maxHeight: 80
   },
   dayButton: {
      paddingHorizontal: 10,
      paddingVertical: 10,
      marginHorizontal: 5,
      borderRadius: 5
   },
   activeDay: {
      backgroundColor: '#3D5AFE'
   },

   activeDayText: {
      color: '#fff',
      fontSize: 16
   },
   scheduleContainer: {
      padding: 20,

      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5
   },
   dayTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center'
   },
   switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20
   },
   switchLabel: {
      fontSize: 16,
      fontWeight: '600',
      marginRight: 10
   },
   input: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 15,
      borderRadius: 5,
      marginBottom: 10
   },
   lunchContainer: {
      marginTop: 10
   },
   lunchLabel: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 5
   },
   offText: {
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 'bold',
      color: '#ff6347'
   }
})
