import { Image } from 'expo-image'
import React, { useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'

import FilterItems from './FilterItems'
import { Sheet, useSheetRef } from '../nativewindui/Sheet'
import { Text } from '../nativewindui/Text'

import { useTranslate } from '~/hooks/useTranslation'
import { useColorScheme } from '~/lib/useColorScheme'
import { useAuth } from '~/providers/AuthContext'
import { useAppointmentStore } from '~/providers/useAppointmentStore'

const FilterAppointments = () => {
   const translate = useTranslate()
   const { user } = useAuth()
   const appointments = useAppointmentStore((data) =>
      data.appointments.filter((a) => a.customer.id === user?.id)
   )
   const { isDarkColorScheme } = useColorScheme()

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
               <Text variant="title2">
                  {translate('appointment.filter.title')}
               </Text>

               <FilterItems appointments={appointments} onPress={applyFilter} />
            </View>
         </Sheet>
      </View>
   )
}

export default FilterAppointments
