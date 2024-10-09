import { format, addMinutes } from 'date-fns'
import React, { useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'

import { Picker, PickerItem } from '../nativewindui/Picker'

const MinuteIntervalPicker = () => {
   const [selectedMinute, setSelectedMinute] = useState<number>(15)
   const [availableTimes, setAvailableTimes] = useState<string[]>([])

   const generateTimes = (minuteInterval: number) => {
      const startHour = new Date()
      startHour.setHours(10, 0, 0, 0) // Start at 10:00 AM

      const timesArray: string[] = []

      // Generate times for the current hour (example: 10:00 AM)
      for (let i = 0; i < 60; i += minuteInterval) {
         const newTime = addMinutes(startHour, i)
         timesArray.push(format(newTime, 'h:mm a'))
      }

      setAvailableTimes(timesArray)
   }

   const onMinuteChange = (minute: number) => {
      console.log(minute)
      setSelectedMinute(minute)
      generateTimes(minute)
   }

   return (
      <View style={styles.container}>
         <Text style={styles.heading}>Select Minute Interval::</Text>
         {/* List of Available Times */}
         <FlatList
            data={availableTimes}
            keyExtractor={(item) => item}
            horizontal
            renderItem={({ item }) => (
               <View style={styles.timeItem}>
                  <Text style={styles.timeText}>{item}</Text>
               </View>
            )}
            ListEmptyComponent={
               <Text style={styles.emptyText}>
                  Select an interval to see times.
               </Text>
            }
         />

         {/* Picker for Minute Interval */}
         <Picker selectedValue={selectedMinute} onValueChange={onMinuteChange}>
            <PickerItem label="10 Minutes" value={10} />
            <PickerItem label="15 Minutes" value={15} />
            <PickerItem label="30 Minutes" value={30} />
            <PickerItem label="45 Minutes" value={45} />
            <PickerItem label="00 Minutes" value={0} />
         </Picker>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      backgroundColor: '#fff',
      padding: 20
   },
   heading: {
      fontSize: 18,
      marginBottom: 10
   },
   picker: {
      height: 50,
      marginBottom: 20
   },
   timeItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc'
   },
   timeText: {
      fontSize: 16
   },
   emptyText: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16
   }
})

export default MinuteIntervalPicker
