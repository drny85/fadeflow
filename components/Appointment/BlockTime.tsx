import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { CalendarList } from 'react-native-calendars'
import { addHours, format, startOfDay } from 'date-fns'
import { ScrollView } from 'react-native-gesture-handler'
import { Container } from '../Container'
import { useColorScheme } from '~/lib/useColorScheme'
import { Text } from '../nativewindui/Text'
import { BlockTimeParams } from '~/shared/types'
import { Toggle } from '../nativewindui/Toggle'

type Props = {
   initialBlockTimes: BlockTimeParams[] // array of BlockTime
   onBlockTimeChange: (updatedBlockTimes: BlockTimeParams[]) => void // callback to return updated BlockTimes
}

const BlockTime = ({ initialBlockTimes, onBlockTimeChange }: Props) => {
   const { colors, isDarkColorScheme } = useColorScheme()
   const [selectedDate, setSelectedDate] = useState<string>(
      format(new Date(), 'yyyy-MM-dd')
   )
   const [startTime, setStartTime] = useState<Date>(
      addHours(startOfDay(new Date()), 8)
   )
   const [endTime, setEndTime] = useState<Date>(
      addHours(startOfDay(new Date()), 23)
   )
   const [allDay, setAllDay] = useState(false)

   const [showStartTimePicker, setShowStartTimePicker] = useState(false)
   const [showEndTimePicker, setShowEndTimePicker] = useState(false)
   // State to store block times
   const [blockTimes, setBlockTimes] =
      useState<BlockTimeParams[]>(initialBlockTimes)
   // Handle selecting a date from the swipeable calendar
   const onDateSelect = (date: string) => {
      setSelectedDate(date)
   }

   const onStartTimeChange = (event: any, selectedTime?: Date) => {
      setShowStartTimePicker(false)
      if (selectedTime) setStartTime(selectedTime)
   }

   const onEndTimeChange = (event: any, selectedTime?: Date) => {
      setShowEndTimePicker(false)
      if (selectedTime) setEndTime(selectedTime)
   }

   const handleBlockTime = () => {
      if (!allDay && startTime >= endTime) {
         alert('End time must be greater than start time.')
         return
      }
      let newBlockTime: BlockTimeParams
      if (allDay) {
         newBlockTime = {
            allDay: true,
            date: new Date(selectedDate)
         }
      } else {
         newBlockTime = {
            allDay: false,
            date: new Date(selectedDate),
            startTime,
            endTime
         }
      }
      // Add the new block time to the array
      const updatedBlockTimes = [...blockTimes, newBlockTime]

      setBlockTimes(updatedBlockTimes)

      // Call the callback to return the updated array
      onBlockTimeChange(updatedBlockTimes)
   }

   useEffect(() => {
      const blockTimeForDate = blockTimes.find(
         (blockTime) => format(blockTime.date, 'yyyy-MM-dd') === selectedDate
      )

      if (blockTimeForDate) {
         setAllDay(blockTimeForDate.allDay)
         if (!blockTimeForDate.allDay) {
            setStartTime(blockTimeForDate.startTime)
            setEndTime(blockTimeForDate.endTime)
         }
      } else {
         // Reset to default if no block time for selected date
         setAllDay(false)
         setStartTime(new Date())
         setEndTime(new Date())
      }
   }, [selectedDate, blockTimes])

   return (
      <Container>
         <ScrollView style={styles.container}>
            <Text variant={'title1'} className="text-center">
               BLOCK TIME-FRAME
            </Text>

            {/* Swipeable Calendar for selecting the week */}
            <CalendarList
               style={{ borderRadius: 20 }}
               current={selectedDate}
               onDayPress={(day) => onDateSelect(day.dateString)}
               pastScrollRange={12}
               futureScrollRange={12}
               horizontal
               pagingEnabled
               calendarWidth={Dimensions.get('window').width}
               theme={{
                  backgroundColor: colors.card,
                  calendarBackground: colors.background,
                  dayTextColor: isDarkColorScheme ? '#ffffff' : '#212121',
                  selectedDayBackgroundColor: colors.primary,
                  selectedDayTextColor: '#fff',
                  textDisabledColor: '#555',
                  monthTextColor: isDarkColorScheme ? '#ffffff' : '#212121',
                  textMonthFontWeight: 'bold',

                  textDayFontWeight: '500'
               }}
               markedDates={{
                  [selectedDate]: {
                     selected: true,
                     marked: true,
                     dotColor: colors.primary
                  }
               }}
               firstDay={0} // Set Monday as the first day of the week (optional)
            />

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
               <>
                  <TouchableOpacity
                     onPress={() => setShowStartTimePicker(true)}
                     style={[
                        styles.timeButton,
                        { backgroundColor: colors.accent }
                     ]}
                  >
                     <Text className="text-white font-roboto-bold">
                        Start Time: {format(startTime, 'p')}
                     </Text>
                  </TouchableOpacity>
                  {showStartTimePicker && (
                     <DateTimePicker
                        value={startTime}
                        mode="time"
                        minuteInterval={15}
                        is24Hour={false}
                        display="default"
                        onChange={onStartTimeChange}
                     />
                  )}

                  <TouchableOpacity
                     onPress={() => setShowEndTimePicker(true)}
                     style={[
                        styles.timeButton,
                        { backgroundColor: colors.accent }
                     ]}
                  >
                     <Text className="text-white font-roboto-bold">
                        End Time: {format(endTime, 'p')}
                     </Text>
                  </TouchableOpacity>
                  {showEndTimePicker && (
                     <View className="self-start">
                        <DateTimePicker
                           value={endTime}
                           mode="time"
                           minuteInterval={15}
                           is24Hour={false}
                           display="default"
                           onChange={onEndTimeChange}
                        />
                     </View>
                  )}
               </>
            )}

            {/* Block Button */}
            <TouchableOpacity
               onPress={handleBlockTime}
               style={[styles.blockButton, { backgroundColor: colors.primary }]}
            >
               <Text style={styles.blockButtonText}>BLOCK</Text>
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
