import React, { useMemo } from 'react'
import { Button, StyleSheet, TouchableOpacity, View } from 'react-native'

import { Sheet, useSheetRef } from '../nativewindui/Sheet'
import { Text } from '../nativewindui/Text'

import { Image } from 'expo-image'
import { useColorScheme } from '~/lib/useColorScheme'
import { useAppointmentStore } from '~/providers/useAppointmentStore'
import { useAuth } from '~/providers/AuthContext'
import FilterItems from './FilterItems'

const FilterAppointments = () => {
   const { user } = useAuth()
   const { appointments } = useAppointmentStore()
   const { colors, isDarkColorScheme } = useColorScheme()

   const snapPoints = useMemo(() => ['70%'], [])
   const bottomSheetRef = useSheetRef()

   const applyFilter = () => {
      bottomSheetRef.current?.close()
   }
   if (!user) return null
   return (
      <View>
         <View className="flex-row items-center gap-3">
            <TouchableOpacity
               onPress={() => {
                  bottomSheetRef.current?.present()
               }}
            >
               <Image
                  tintColor={isDarkColorScheme ? '#ffffff' : '#212121'}
                  source={require('~/assets/Icons/filter.png')}
                  style={{ width: 34, height: 34, marginRight: 12 }}
               />
            </TouchableOpacity>
         </View>

         {/* Bottom Sheet */}
         <Sheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            index={0}
            enablePanDownToClose
         >
            <View className="flex-1 p-6 justify-center">
               <Text variant="title2">Filter Appointments</Text>

               <FilterItems appointments={appointments} onPress={applyFilter} />
            </View>
         </Sheet>
      </View>
   )
}

const styles = StyleSheet.create({
   filterRow: {
      marginBottom: 20
   },
   slider: {
      width: '100%',
      height: 40
   }
})

export default FilterAppointments
