import { FlashList } from '@shopify/flash-list'
import { useSegments } from 'expo-router'
import React, { useMemo } from 'react'
import { Platform, ScrollView } from 'react-native'
import BarberCard from '~/components/BarberCard'
import { SIZES } from '~/constants'
import { useBarbers } from '~/hooks/useBarbers'
import { useNavigationSearch } from '~/hooks/useNavigationSeach'
import { useColorScheme } from '~/lib/useColorScheme'
import { useBarbersStore } from '~/providers/useBarbersStore'
import { useSettingsStore } from '~/providers/useSettingsStore'

const AdminBarbers = () => {
   useBarbers(true)
   const index = useSettingsStore((s) => s.showAllIndex)
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
      if (!search) return barbers.sort((a, b) => a.name.localeCompare(b.name))
      return barbers.filter((barber) =>
         barber.name.toLowerCase().includes(search.toLowerCase())
      )
   }, [search, barbers])
   const finalData = useMemo(() => {
      if (index === 1) return data
      return data.filter(
         (b) =>
            b.subscriptionStatus === 'active' ||
            b.subscriptionStatus === 'trialing'
      )
   }, [index, data])

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
            data={finalData}
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
