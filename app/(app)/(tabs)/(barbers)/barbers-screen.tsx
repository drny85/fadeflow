import { useSegments } from 'expo-router'
import { useMemo } from 'react'
import { FlatList, Platform, ScrollView, View } from 'react-native'
import Animated, { SlideInLeft } from 'react-native-reanimated'

import BarberImageHeader from '~/components/BarberImageHeader'
import BarbersSkelenton from '~/components/Skeletons/BarbersSkeleton'
import { Text } from '~/components/nativewindui/Text'
import { SIZES } from '~/constants'
import { useLocation } from '~/hooks/useLocation'
import { useNavigationSearch } from '~/hooks/useNavigationSeach'
import { useReviews } from '~/hooks/useReviews'
import { useStatusBarColor } from '~/hooks/useStatusBarColor'
import { useTranslate } from '~/hooks/useTranslation'
import { useColorScheme } from '~/lib/useColorScheme'
import { useBarbersStore } from '~/providers/useBarbersStore'
import { Barber, BarbersFiltered } from '~/shared/types'
import { getReviews } from '~/utils'
import { getDistanceFromLatLonInMeters } from '~/utils/getDistanceBetweenLocations'

type BarberWithDistance = Barber & {
   distance: number | null
}

const BarbersPage = () => {
   const segment = useSegments()
   const translate = useTranslate()
   const { location, loading: locationLoading } = useLocation()
   const { barbers: data, barbersFilter } = useBarbersStore()
   const { isDarkColorScheme, colors } = useColorScheme()
   const { reviews } = useReviews()

   const search = useNavigationSearch({
      searchBarOptions: {
         placeholder: translate('barber.search'),
         tintColor: isDarkColorScheme ? '#dedede' : colors.accent
      }
   })
   const barbers: BarberWithDistance[] | BarbersFiltered[] = useMemo(() => {
      if (!location) return data.map((b) => ({ ...b, distance: null }))
      return data
         .map((b) => {
            const distance = getDistanceFromLatLonInMeters(
               {
                  lat: location.coords.latitude,
                  lng: location.coords.longitude
               },
               { lat: b.profile?.coords?.lat!, lng: b.profile?.coords?.lng! }
            )
            return { ...b, distance }
         })
         .sort((a, b) => a.distance! - b.distance!)
   }, [data, location])

   const searchData = useMemo(() => {
      if ((!search && barbersFilter === null) || !location) return barbers
      let filteredBarbers: BarbersFiltered[] = []
      if (barbersFilter !== null) {
         const { distance, isAvailable, rating } = barbersFilter

         filteredBarbers = barbers
            .map((b) => {
               return {
                  ...b,
                  distance,
                  rating: getReviews(b.id, reviews)
               }
            })
            .filter(
               (barber) =>
                  barber.distance <= distance && barber.rating >= rating
            ) as BarbersFiltered[]

         if (isAvailable) {
            filteredBarbers = filteredBarbers.filter(
               (barber) => barber.isAvailable
            )
         }

         return filteredBarbers
      }

      return barbers.filter((b) =>
         b.name.toLowerCase().includes(search.toLowerCase())
      )
   }, [search, barbers, barbersFilter])

   useStatusBarColor('dark')
   //if (locationLoading) return null
   if (locationLoading) return <BarbersSkelenton />
   return (
      <ScrollView
         contentInsetAdjustmentBehavior="automatic"
         showsVerticalScrollIndicator={false}
         contentContainerStyle={{
            paddingTop:
               Platform.OS === 'android' && segment[2] !== 'quick-booking'
                  ? SIZES.statusBarHeight + 40
                  : undefined
         }}
      >
         <FlatList
            data={searchData}
            scrollEnabled={false}
            ListEmptyComponent={
               <View className="mt-10 flex-1 items-center justify-center">
                  <Text className="text-xl text-muted">
                     {translate('barber.no_barber')}
                  </Text>
               </View>
            }
            // contentContainerClassName="p-2 mb-3"
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
               <Animated.View
                  style={{ margin: 6 }}
                  entering={SlideInLeft.delay(index * 150)}
               >
                  <BarberImageHeader
                     showTopControl={false}
                     barber={item}
                     showBookingButton
                     onPressBack={() => {}}
                  />
                  {item.distance && (
                     <View className="p-1 absolute top-3 right-2 z-20">
                        <Text className="text-white font-bold">
                           {item.distance.toFixed(1)} m
                        </Text>
                     </View>
                  )}
               </Animated.View>
               // <BarberCard barber={item} index={index} isOwner={false} />
            )}
         />
      </ScrollView>
   )
}

export default BarbersPage
