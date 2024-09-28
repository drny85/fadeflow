import { useMemo } from 'react'
import { FlatList, ScrollView, View } from 'react-native'
import Animated, { SlideInLeft } from 'react-native-reanimated'

import BarberImageHeader from '~/components/BarberImageHeader'
import BarbersSkelenton from '~/components/Skeletons/BarbersSkeleton'
import { Text } from '~/components/nativewindui/Text'
import { useLocation } from '~/hooks/useLocation'
import { useNavigationSearch } from '~/hooks/useNavigationSeach'
import { useStatusBarColor } from '~/hooks/useStatusBarColor'
import { useColorScheme } from '~/lib/useColorScheme'
import { useBarbersStore } from '~/providers/useBarbersStore'
import { Barber } from '~/shared/types'
import { getDistanceFromLatLonInMeters } from '~/utils/getDistanceBetweenLocations'

type BarberWithDistance = Barber & {
   distance: number | null
}

const BarbersPage = () => {
   const { location, loading: locationLoading } = useLocation()
   const { barbers: data, loading } = useBarbersStore()
   const { isDarkColorScheme, colors } = useColorScheme()

   const search = useNavigationSearch({
      searchBarOptions: {
         placeholder: 'Search Barbers',
         tintColor: isDarkColorScheme ? '#dedede' : colors.accent
      }
   })
   const barbers: BarberWithDistance[] = useMemo(() => {
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
      if (!search) return barbers
      return barbers.filter((b) =>
         b.name.toLowerCase().includes(search.toLowerCase())
      )
   }, [search, barbers])

   useStatusBarColor('dark')

   if (loading || locationLoading) return <BarbersSkelenton />
   return (
      <ScrollView
         contentInsetAdjustmentBehavior="automatic"
         showsVerticalScrollIndicator={false}
      >
         <FlatList
            data={searchData}
            scrollEnabled={false}
            ListEmptyComponent={
               <View className="mt-10 flex-1 items-center justify-center">
                  <Text className="text-xl text-muted">No Barbers Found</Text>
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
