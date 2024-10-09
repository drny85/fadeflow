import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { addHours, addMonths, format, isPast, startOfDay } from 'date-fns'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { ScrollView } from 'react-native-gesture-handler'

import { Container } from '../Container'
import { Text } from '../nativewindui/Text'
import { Toggle } from '../nativewindui/Toggle'

import { useColorScheme } from '~/lib/useColorScheme'
import { useAppointmentStore } from '~/providers/useAppointmentStore'
import { BlockTimeParams, MarkedDate } from '~/shared/types'

type Props = {
   initialBlockTimes: BlockTimeParams[] // array of BlockTime
   onBlockTimeChange: (updatedBlockTimes: BlockTimeParams[]) => void // callback to return updated BlockTimes
}
type Params = {
   date?: string
}

const BlockTime = ({ initialBlockTimes, onBlockTimeChange }: Props) => {
   const { date } = useLocalSearchParams<Params>()
   const { colors, isDarkColorScheme } = useColorScheme()
   const appointments = useAppointmentStore((s) =>
      s.appointments.filter((a) => a.status === 'confirmed' && !isPast(a.date))
   )
   const [editing, setEditing] = useState(false)
   const [selectedDate, setSelectedDate] = useState<string>(
      format(new Date(), 'yyyy-MM-dd')
   )
   const [startTime, setStartTime] = useState<string>(
      new Date(addHours(startOfDay(new Date()), 9)).toISOString()
   )
   const [endTime, setEndTime] = useState<string>(
      new Date(addHours(startOfDay(new Date()), 9)).toISOString()
   )
   const [allDay, setAllDay] = useState(false)

   // State to store block times
   const [blockTimes, setBlockTimes] =
      useState<BlockTimeParams[]>(initialBlockTimes)
   // Handle selecting a date from the swipeable calendar
   const onDateSelect = (date: string) => {
      setSelectedDate(date)
   }

   const onStartTimeChange = (event: any, selectedTime?: Date) => {
      if (selectedTime) setStartTime(selectedTime.toISOString())
   }

   const onEndTimeChange = (event: any, selectedTime?: Date) => {
      if (selectedTime) setEndTime(selectedTime.toISOString())
   }

   const handleBlockTime = () => {
      if (!allDay && startTime > endTime) {
         alert('End time must be greater than start time.')
         return
      }
      let newBlockTime: BlockTimeParams
      if (allDay) {
         newBlockTime = {
            allDay: true,
            date: selectedDate
         }
      } else {
         newBlockTime = {
            allDay: false,
            date: selectedDate,
            start: startTime,
            end: endTime
         }
      }
      // Add the new block time to the array
      if (editing) {
         const updatedBlockTimes = blockTimes.map((blockTime) => {
            if (blockTime.date === selectedDate) {
               return newBlockTime
            }
            return blockTime
         })
         setBlockTimes(updatedBlockTimes)
         onBlockTimeChange(updatedBlockTimes)
         return
      }
      const updatedBlockTimes = [...blockTimes, newBlockTime]

      Alert.alert(
         'Blocking Date',
         `You have blocked ${allDay ? selectedDate : `${selectedDate} from ${format(new Date(startTime), 'hh:mm a')} to ${format(new Date(endTime), 'hh:mm a')}`}`,
         [
            {
               text: 'Block',
               style: 'destructive',
               onPress: () => {
                  setBlockTimes(updatedBlockTimes)
                  onBlockTimeChange(updatedBlockTimes)
               }
            },
            { text: 'Cancel', style: 'cancel' }
         ]
      )

      // Call the callback to return the updated array
   }
   const markedDates = useMemo(() => {
      const marked: MarkedDate = {}
      const markedDatesFromAppointments = appointments.reduce(
         (acc, appointment) => {
            acc[appointment.date.split('T')[0]] = {
               selected: true,
               disabled: true,
               selectedColor: colors.destructive,
               disableTouchEvent: true
            }
            return acc
         },
         {} as MarkedDate
      )
      blockTimes.forEach((blockTime) => {
         console.log(blockTime)
         marked[blockTime.date] = {
            selected: !blockTime.allDay && blockTime.start !== blockTime.end,
            selectedColor: blockTime.allDay ? colors.accent : colors.grey3
            // markedColor: colors.accent
         }
      })
      return { ...marked, ...markedDatesFromAppointments }
   }, [blockTimes, appointments])

   useEffect(() => {
      const blockTimeForDate = blockTimes.find((blockTime) => {
         return blockTime.date === selectedDate
      })

      if (blockTimeForDate) {
         setAllDay(blockTimeForDate.allDay)
         if (!blockTimeForDate.allDay) {
            setStartTime(blockTimeForDate.start)
            setEndTime(blockTimeForDate.end)
         }
         setEditing(true)
      } else {
         // Reset to default if no block time for selected date
         setAllDay(false)
         setStartTime(
            new Date(addHours(startOfDay(new Date()), 9)).toISOString()
         )
         setEndTime(new Date(addHours(startOfDay(new Date()), 9)).toISOString())
         setEditing(false)
      }
   }, [selectedDate, blockTimes])

   useEffect(() => {
      if (date) setSelectedDate(date)
   }, [date])

   return (
      <Container>
         <ScrollView style={styles.container}>
            <View className="flex-row items-center justify-between mb-2 w-full">
               <TouchableOpacity
                  className="p-2"
                  onPress={() => {
                     setSelectedDate(format(new Date(), 'yyyy-MM-dd'))
                     router.back()
                  }}
               >
                  <Ionicons
                     name="chevron-back"
                     size={28}
                     color={colors.primary}
                  />
               </TouchableOpacity>
               <Text variant="title1">BLOCK TIME-FRAME</Text>
               <Text />
            </View>

            {/* Swipeable Calendar for selecting the week */}

            <Calendar
               style={{ borderRadius: 18 }}
               current={selectedDate}
               onDayPress={(day: any) => {
                  onDateSelect(day.dateString)
               }}
               pastScrollRange={12}
               futureScrollRange={12}
               maxDate={
                  new Date(addMonths(new Date(), 2)).toISOString().split('T')[0]
               }
               minDate={new Date().toISOString().split('T')[0]}
               horizontal
               pagingEnabled
               enableSwipeMonths
               theme={{
                  backgroundColor: colors.card,
                  calendarBackground: colors.background,
                  dayTextColor: isDarkColorScheme ? '#ffffff' : '#212121',
                  selectedDayBackgroundColor: colors.primary,
                  selectedDayTextColor: '#fffddd',
                  textDisabledColor: '#555',
                  monthTextColor: isDarkColorScheme ? '#ffffff' : '#212121',
                  textMonthFontWeight: 'bold',

                  textDayFontWeight: '500'
               }}
               markedDates={{
                  [selectedDate]: {
                     selected: true,
                     selectedColor: colors.primary
                  },
                  ...markedDates
               }}
               firstDay={0} // Set Monday as the first day of the week (optional)
            />
            <Text className="text-center text-muted dark:text-slate-400 mt-2">
               Legend
            </Text>
            <View className="p-2 shadow-sm bg-card rounded-md flex-row items-center justify-evenly">
               <View className="flex-row items-center gap-1">
                  <View className="h-6 w-6 rounded-full bg-primary" />
                  <Text className="text-sm">Selected</Text>
               </View>
               <View className="flex-row items-center gap-1">
                  <View className="h-6 w-6 rounded-full bg-destructive" />
                  <Text className="text-sm">Booking</Text>
               </View>
               <View className="flex-row items-center gap-1">
                  <View className="h-6 w-6 rounded-full bg-gray-300" />
                  <Text className="text-sm">Times Blocked</Text>
               </View>
            </View>

            {/* Time Block */}
            <Text className="mt-2" style={styles.label}>
               TIME
            </Text>

            {/* All Day Toggle */}
            <View style={styles.row}>
               <Text style={styles.rowText}>All Day</Text>
               <Toggle value={allDay} onValueChange={setAllDay} />
            </View>

            {/* Time Picker */}
            {!allDay && (
               <View className="flex-row items-center gap-2 justify-between">
                  <View>
                     <TouchableOpacity
                        style={[
                           styles.timeButton,
                           {
                              backgroundColor: colors.card,
                              flexDirection: 'row',
                              alignItems: 'center'
                           }
                        ]}
                     >
                        <Text className="font-roboto-bold">Start:</Text>
                        <View className="flex-grow">
                           <DateTimePicker
                              value={new Date(startTime)}
                              mode="time"
                              textColor="#ffffff"
                              minuteInterval={15}
                              is24Hour={false}
                              display="default"
                              onChange={onStartTimeChange}
                           />
                        </View>
                     </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                     style={[
                        styles.timeButton,
                        {
                           backgroundColor: colors.card,
                           flexDirection: 'row',
                           alignItems: 'center'
                        }
                     ]}
                  >
                     <Text className="font-roboto-bold">End:</Text>
                     <View className="w-18">
                        <DateTimePicker
                           value={new Date(endTime)}
                           mode="time"
                           minuteInterval={15}
                           is24Hour={false}
                           display="default"
                           onChange={onEndTimeChange}
                        />
                     </View>
                  </TouchableOpacity>
               </View>
            )}
            {date && (
               <View className="flex-row items-center justify-center gap-2">
                  <Text style={styles.rowText}>Date</Text>
                  <Text>{date}</Text>
               </View>
            )}

            {/* Block Button */}
            <TouchableOpacity
               onPress={handleBlockTime}
               style={[styles.blockButton, { backgroundColor: colors.primary }]}
            >
               <Text style={styles.blockButtonText}>
                  {!editing ? 'BLOCK' : 'UPDATE'}
               </Text>
            </TouchableOpacity>
         </ScrollView>
      </Container>
   )
}

export default BlockTime

const styles = StyleSheet.create({
   container: {
      flex: 1,
      //backgroundColor: '#000',
      paddingHorizontal: 16,
      paddingVertical: 8
   },
   title: {
      fontSize: 24,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 20
   },
   label: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 4
   },
   row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 12
   },
   rowText: {
      fontSize: 16
   },
   rowValue: {
      color: '#ccc',
      fontSize: 16
   },
   timeButton: {
      padding: 10,
      borderRadius: 8,
      marginBottom: 16
   },
   timeText: {
      fontSize: 16
   },
   blockButton: {
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20
   },
   blockButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
   }
})
