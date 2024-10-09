import { MaterialIcons } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'
import { AnimatePresence, MotiView } from 'moti'
import React, { useMemo, useState } from 'react'
import {
   Button,
   StyleSheet,
   Switch,
   TouchableOpacity,
   View
} from 'react-native'

import { Sheet, useSheetRef } from '../nativewindui/Sheet'
import { Text } from '../nativewindui/Text'

import { useTranslate } from '~/hooks/useTranslation'
import { useColorScheme } from '~/lib/useColorScheme'
import { useBarbersStore } from '~/providers/useBarbersStore'

const FilterComponent = () => {
   const { colors, isDarkColorScheme } = useColorScheme()
   const { barbersFilter, setBarbersFilter } = useBarbersStore()
   const translate = useTranslate()
   const snapPoints = useMemo(() => ['75%'], [])
   const bottomSheetRef = useSheetRef()
   const [distance, setDistance] = useState(3)
   const [rating, setRating] = useState(4)
   const [isAvailable, setIsAvailable] = useState(false)

   const applyFilter = () => {
      console.log({ distance, isAvailable, rating })
      setBarbersFilter({ distance, isAvailable, rating })
      bottomSheetRef.current?.close()
   }

   return (
      <View>
         <View className="flex-row items-center gap-3">
            <AnimatePresence>
               {barbersFilter !== null && (
                  <MotiView
                     from={{ opacity: 0, scale: 0 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ type: 'timing' }}
                     exit={{ opacity: 0, scale: 0 }}
                  >
                     <TouchableOpacity onPress={() => setBarbersFilter(null)}>
                        <Text className="font-bold text-blue-500">
                           {translate('barber.clear')}
                        </Text>
                     </TouchableOpacity>
                  </MotiView>
               )}
            </AnimatePresence>
            <TouchableOpacity
               onPress={() => {
                  bottomSheetRef.current?.present()
               }}
            >
               <MaterialIcons
                  name={
                     barbersFilter !== null ? 'filter-alt' : 'filter-alt-off'
                  }
                  size={26}
                  color={isDarkColorScheme ? '#ffffff' : colors.accent}
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
            <View className="flex-1 justify-evenly p-6">
               <Text variant="title2">{translate('barber.filter')}</Text>

               {/* Distance Filter */}
               <View style={styles.filterRow}>
                  <Text className="text-lg">
                     {translate('barber.distance')} (miles): {distance}
                  </Text>
                  <Slider
                     style={styles.slider}
                     minimumValue={1}
                     maximumValue={30}
                     step={1}
                     value={distance}
                     onValueChange={(value) => setDistance(value)}
                     minimumTrackTintColor={colors.accent}
                     maximumTrackTintColor="#d3d3d3"
                     thumbTintColor={colors.accent}
                  />
               </View>

               {/* Rating Filter */}
               <View style={styles.filterRow}>
                  <Text className="text-lg">
                     {translate('barber.rating')}: {rating}
                  </Text>
                  <Slider
                     style={styles.slider}
                     minimumValue={1}
                     maximumValue={5}
                     step={1}
                     value={rating}
                     onValueChange={(value) => setRating(value)}
                     minimumTrackTintColor={colors.accent}
                     maximumTrackTintColor="#d3d3d3"
                     thumbTintColor={colors.accent}
                  />
               </View>

               {/* Availability Filter */}
               <View style={styles.filterRow}>
                  <Text className="text-lg mb-1">
                     {translate('barber.available')}:
                  </Text>
                  <Switch
                     value={isAvailable}
                     onValueChange={setIsAvailable}
                     trackColor={{ false: '#767577', true: colors.primary }}
                     thumbColor={isAvailable ? colors.accent : colors.accent}
                  />
               </View>

               {/* Apply Filter Button */}
               <Button
                  title={translate('appointment.filter.button')}
                  onPress={applyFilter}
               />
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

export default FilterComponent
