import { FlashList } from '@shopify/flash-list'
import { useSegments } from 'expo-router'
import React, { useMemo } from 'react'
import { Platform, ScrollView, Text } from 'react-native'
import BarberCard from '~/components/BarberCard'
import { SIZES } from '~/constants'
import { useBarbers } from '~/hooks/useBarbers'
import { useNavigationSearch } from '~/hooks/useNavigationSeach'
import { useColorScheme } from '~/lib/useColorScheme'
import { useBarbersStore } from '~/providers/useBarbersStore'

const AdminBarbers = () => {
   useBarbers(true)
   const { isDarkColorScheme, colors } = useColorScheme()
   const segment = useSegments()
   const { barbers } = useBarbersStore()

   const search = useNavigationSearch({
      searchBarOptions: {
         placeholder: 'Search Barbers',
         tintColor: isDarkColorScheme ? '#dedede' : colors.accent
      }
   })
   const data = useMemo(() => {
      if (!search) return barbers
      return barbers.filter((barber) =>
         barber.name.toLowerCase().includes(search.toLowerCase())
      )
   }, [search, barbers])

   return (
      <ScrollView
         contentInsetAdjustmentBehavior="automatic"
         showsVerticalScrollIndicator={false}
         contentContainerStyle={{
            paddingTop:
               Platform.OS === 'android' && segment[2] !== 'admin-barbers'
                  ? SIZES.statusBarHeight + 36
                  : undefined
         }}
      >
         <FlashList
            data={data}
            scrollEnabled={false}
            estimatedItemSize={100}
            renderItem={({ item, index }) => (
               <BarberCard barber={item} index={index} isOwner={false} />
            )}
         />
      </ScrollView>
   )
}

export default AdminBarbers
