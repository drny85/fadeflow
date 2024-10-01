import DateTimePicker from '@react-native-community/datetimepicker'
import { addHours, format, parse, startOfDay } from 'date-fns'
import React, { useEffect, useState } from 'react'
import {
   Alert,
   Platform,
   StyleSheet,
   Switch,
   TouchableOpacity,
   View
} from 'react-native'
import Animated, { SlideInLeft, SlideOutRight } from 'react-native-reanimated'

import { Button } from '../Button'
import { Sheet, useSheetRef } from '../nativewindui/Sheet'
import { Text } from '../nativewindui/Text'
import ScheduleView from './ScheduleView'

import { updateUser } from '~/actions/users'
import { toastMessage } from '~/lib/toast'
import { useColorScheme } from '~/lib/useColorScheme'
import { useAuth } from '~/providers/AuthContext'
import { dayOrder, Days, Schedule } from '~/shared/types'
import { days, DEFAULT_SCHEDULE } from '~/constants'

type Props = {
   defaultSchedule: Schedule
}

const title: Record<string, string> = {
   startTime: 'Start Time',
   endTime: 'End Time',
   'lunch.start': 'Lunch Start',
   'lunch.end': 'Lunch End'
}

export default function ScheduleComponent({ defaultSchedule }: Props) {
   const { user } = useAuth()
   const bottomSheetRef = useSheetRef()
   const bottomSheetRef2 = useSheetRef()
   const [selectedDay, setSelectedDay] = useState<Days>('Sun')
   const [invalidDays, setInvalidDays] = useState<Days[]>([])
   const [editing, setEditing] = useState(false)
   const [pickerValue, setPickerValue] = useState<Date | null>(null)
   const [schedule, setSchedule] = useState<Schedule>(
      defaultSchedule || DEFAULT_SCHEDULE
   )
   const { colors } = useColorScheme()

   const [showPicker, setShowPicker] = useState<{
      field: string | null
      mode: 'time'
   }>({ field: null, mode: 'time' })

   // Function to validate lunch break time

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
         setPickerValue(selectedDate)
      }
      setEditing(true)
   }

   const openPicker = (field: string) => {
      let existingTime = ''
      if (field.startsWith('lunch')) {
         const lunchField = field.split('.')[1]
         //@ts-ignore
         existingTime = schedule[selectedDay].lunchBreak[lunchField]
      } else {
         //@ts-ignore
         existingTime = schedule[selectedDay][field]
      }

      const defaultValue = existingTime
         ? parse(existingTime, 'hh:mm a', new Date())
         : new Date()
      setPickerValue(defaultValue)
      setShowPicker({ field, mode: 'time' })
   }

   // Toggle for isOff
   const handleToggleIsOff = (day: Days) => {
      setSchedule((prev) => ({
         ...prev,
         [day]: { ...prev[day], isOff: !prev[day].isOff }
      }))
      setEditing(true)
   }

   useEffect(() => {
      const values: Days[] = []
      Object.keys(schedule).forEach((day) => {
         const currentDay = schedule[day as Days]
         const d = day as Days
         const start = new Date(
            `1970-01-01T${parseTime12HourA(currentDay.startTime)}`
         )
         const end = new Date(
            `1970-01-01T${parseTime12HourA(currentDay.endTime)}`
         )
         const lunchStart = new Date(
            `1970-01-01T${parseTime12HourA(currentDay.lunchBreak.start)}`
         )
         const lunchEnd = new Date(
            `1970-01-01T${parseTime12HourA(currentDay.lunchBreak.end)}`
         )
         const validLunch = lunchEnd > lunchStart
         const validHours = end > start

         const valid = validHours && validLunch

         if (!valid) {
            values.push(d)
         }
         setInvalidDays(values)
      })
   }, [schedule])

   useEffect(() => {
      if (showPicker.field) {
         bottomSheetRef2.current?.present()
      } else {
         bottomSheetRef2.current?.close()
      }
   }, [showPicker.field])

   return (
      <View style={styles.container}>
         <View style={styles.daySelector}>
            {dayOrder.map((day) => (
               <TouchableOpacity
                  key={day}
                  onPress={() => setSelectedDay(day)}
                  style={[
                     {
                        ...styles.dayButton,
                        backgroundColor: colors.card,
                        borderWidth: invalidDays.includes(day) ? 1 : undefined,
                        borderColor: 'red'
                     },
                     selectedDay === day && { backgroundColor: colors.primary }
                  ]}
               >
                  <Text style={selectedDay === day && styles.activeDayText}>
                     {day.substring(0, 3)}
                  </Text>
               </TouchableOpacity>
            ))}
         </View>

         {/* Schedule Editor */}
         <Animated.View
            entering={SlideInLeft}
            exiting={SlideOutRight}
            style={[
               styles.scheduleContainer,
               {
                  backgroundColor: colors.card,
                  borderWidth: invalidDays.includes(selectedDay)
                     ? 2
                     : undefined,
                  borderColor: 'red'
               }
            ]}
         >
            <Text style={styles.dayTitle}>{days[selectedDay]}</Text>

            {/* Toggle for isOff */}
            <View style={styles.switchContainer}>
               <Text style={styles.switchLabel}>Day Off: </Text>
               <Switch
                  value={schedule[selectedDay].isOff}
                  onValueChange={() => handleToggleIsOff(selectedDay)}
                  thumbColor={
                     schedule[selectedDay].isOff
                        ? colors.accent
                        : colors.primary
                  }
                  trackColor={{ false: '#767577', true: colors.primary }}
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
                           onPress={() => {
                              openPicker('startTime')
                              setShowPicker({
                                 field: 'startTime',
                                 mode: 'time'
                              })
                           }}
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
                           onPress={() => {
                              openPicker('endTime')
                              setShowPicker({ field: 'endTime', mode: 'time' })
                           }}
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
                              onPress={() => {
                                 openPicker('lunch.start')
                                 setShowPicker({
                                    field: 'lunch.start',
                                    mode: 'time'
                                 })
                              }}
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
                              onPress={() => {
                                 openPicker('lunch.end')
                                 setShowPicker({
                                    field: 'lunch.end',
                                    mode: 'time'
                                 })
                              }}
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

            {editing && (
               <View className="mt-3">
                  <Button
                     title={
                        invalidDays.length === 0 ? 'Review Schedule' : 'Update'
                     }
                     onPress={async () => {
                        if (invalidDays.length > 0) {
                           Alert.alert(
                              'Invalid Schedule',
                              `Please check the schedule and try again.\nCheck for\n ${invalidDays.map((v) => `${v}\n`)}`
                           )
                           return
                        }

                        if (!user || !user.isBarber) return
                        bottomSheetRef.current?.present()
                     }}
                  />
               </View>
            )}
         </Animated.View>

         {/* DateTimePicker Modal */}
         {/* {showPicker.field && (
           
         )} */}
         <Sheet snapPoints={['40%']} ref={bottomSheetRef2}>
            <View className="flex-1">
               <View className="flex-row items-center justify-between">
                  <Text />
                  <Text className="text-center font-raleway-bold">
                     Select {days[selectedDay]}'{' '}
                     {title[showPicker.field as string]}
                  </Text>
                  <TouchableOpacity
                     onPress={() =>
                        setShowPicker({ field: null, mode: 'time' })
                     }
                     className="self-end p-2"
                  >
                     <Text className="text-end text-blue-600 font-roboto-bold mr-2">
                        Done
                     </Text>
                  </TouchableOpacity>
               </View>

               <DateTimePicker
                  value={pickerValue || addHours(startOfDay(new Date()), 8)}
                  mode="time"
                  style={{
                     backgroundColor: colors.primary,
                     borderRadius: 10,
                     overflow: 'hidden'
                  }}
                  minuteInterval={15}
                  textColor="white"
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
         </Sheet>

         <Sheet snapPoints={['80%']} ref={bottomSheetRef}>
            <TouchableOpacity
               className="self-end p-2 mr-2"
               onPress={() => bottomSheetRef.current?.close()}
            >
               <Text className="text-red-600 font-roboto-bold">Close</Text>
            </TouchableOpacity>
            <View className="items-center h-1/2">
               <Text variant="largeTitle">Schedule View</Text>
               <Text variant="subhead" className="my-2">
                  This is the client's view
               </Text>
               <ScheduleView schedule={schedule} />
               <View className="mt-4 self-center w-1/2">
                  <Button
                     title="Save"
                     onPress={async () => {
                        if (!user || !user.isBarber) return
                        await updateUser({ ...user, schedule })
                        toastMessage({
                           title: 'Success',
                           message: 'Schedule updated',
                           duration: 2
                        })
                        setEditing(false)
                        bottomSheetRef.current?.close()
                     }}
                  />
               </View>
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
      flexDirection: 'row', // Layout in a row
      justifyContent: 'space-around', // Ensure equal spacing around buttons
      marginBottom: 20,
      minHeight: 76
   },

   dayButton: {
      flex: 1, // Make sure each button takes equal width
      alignItems: 'center', // Center the text inside the button
      paddingVertical: 10, // Vertical padding for buttons
      marginHorizontal: 5, // Small space between buttons
      borderRadius: 5,

      minWidth: 40 // Ensures each button has a reasonable minimum size
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

const parseTime12HourA = (time: string): string => {
   const [timePart, period] = time.split(' ')
   let [hours, minutes] = timePart.split(':').map(Number)

   if (period === 'PM' && hours < 12) hours += 12
   if (period === 'AM' && hours === 12) hours = 0

   return `${hours}:${minutes.toString() === '0' ? '00' : minutes}`
}
