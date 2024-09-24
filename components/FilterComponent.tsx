import { Feather, MaterialIcons } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'
import React, { useMemo, useState } from 'react'
import {
   Button,
   StyleSheet,
   Switch,
   TouchableOpacity,
   View
} from 'react-native'

import { Sheet, useSheetRef } from './nativewindui/Sheet'
import { Text } from './nativewindui/Text'

import { useLocation } from '~/hooks/useLocation'
import { useReviews } from '~/hooks/useReviews'
import { useColorScheme } from '~/lib/useColorScheme'
import { useAppointmentStore } from '~/providers/useAppointmentStore'
import { useBarbersStore } from '~/providers/useBarbersStore'
import { Barber } from '~/shared/types'
import { getDistanceFromLatLonInMeters } from '~/utils/getDistanceBetweenLocations'

type BarberFiltered = Barber & {
   distance: number
   rating: number
}

const FilterComponent = () => {
   const { loading, location } = useLocation()
   const { colors, isDarkColorScheme } = useColorScheme()
   const { reviews } = useReviews()
   const snapPoints = useMemo(() => ['75%'], [])
   const bottomSheetRef = useSheetRef()
   const { barbers } = useBarbersStore()
   const [distance, setDistance] = useState(10)
   const [rating, setRating] = useState(4)
   const [isAvailable, setIsAvailable] = useState(false)
   const [isFiltered, setIsFiltred] = useState(false)

   const getReviews = (barber: Barber): number => {
      return (
         reviews
            .filter((r) => r.barberId === barber?.id)
            .reduce((acc, curr) => acc + curr.rating, 0) / reviews.length || 0
      )
   }

   const barbersCopy = useMemo(() => {
      if (!location)
         return barbers.map((b) => ({ ...barbers, distance: 0, rating: 0 }))
      return [
         ...barbers.map((barber) => {
            return {
               ...barber,
               distance: +getDistanceFromLatLonInMeters(
                  barber.profile?.coords!,
                  {
                     lat: location?.coords.latitude!,
                     lng: location?.coords.longitude
                  }
               ).toFixed(1),
               rating: getReviews(barber)
            }
         })
      ] as BarberFiltered[]
   }, [barbers, location])

   const applyFilter = () => {
      console.log({ distance, isAvailable, rating })
      const filtered = barbersCopy.filter((barber) => {
         return barber.distance <= distance && barber.rating >= rating
      })
      // Handle the filtering logic based on the current states
      console.log(JSON.stringify(filtered, null, 2))
      setIsFiltred((prev) => !prev)
      bottomSheetRef.current?.close()
   }

   if (loading) return null

   return (
      <View>
         <View className="flex-row items-center gap-3">
            <TouchableOpacity
               onPress={() => {
                  setIsFiltred(false)
                  bottomSheetRef.current?.present()
               }}
            >
               <MaterialIcons
                  name={isFiltered ? 'filter-alt' : 'filter-alt-off'}
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
               <Text variant="title2">Filter Barbers</Text>

               {/* Distance Filter */}
               <View style={styles.filterRow}>
                  <Text className="text-lg">Distance (miles): {distance}</Text>
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
                  <Text className="text-lg">Rating: {rating}</Text>
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
                  <Text className="text-lg mb-1">Available Now:</Text>
                  <Switch
                     value={isAvailable}
                     onValueChange={setIsAvailable}
                     trackColor={{ false: '#767577', true: colors.primary }}
                     thumbColor={isAvailable ? colors.accent : colors.accent}
                  />
               </View>

               {/* Apply Filter Button */}
               <Button title="Apply Filter" onPress={applyFilter} />
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
