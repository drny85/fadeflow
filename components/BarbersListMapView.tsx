import React, { useEffect, useRef } from 'react'
import { Animated, FlatList, Platform, TouchableOpacity } from 'react-native'
import MapView from 'react-native-maps'

import BarberImageHeader from './BarberImageHeader'

import { SIZES } from '~/constants'
import { useColorScheme } from '~/lib/useColorScheme'
import { Barber } from '~/shared/types'

const CARD_HEIGHT = 220
const CARD_WIDTH = SIZES.width * 0.8
const INSET = SIZES.width * 0.1 - 10
let TIME_OUT: NodeJS.Timeout
const DELTA = {
   latitudeDelta: 0.0922,
   longitudeDelta: 0.0421
}

type Props = {
   index: number
   barbers: Barber[]
   mapRef: React.RefObject<MapView>
}

const BarbersListMapView = ({ index, barbers, mapRef }: Props) => {
   const { colors } = useColorScheme()
   const animatedX = new Animated.Value(0)
   const flatListRef = useRef<FlatList>(null)
   let mapIndex = 0

   useEffect(() => {
      const sub = animatedX.addListener(({ value }) => {
         let i = Math.floor(value / CARD_WIDTH + 0.3)

         if (i > barbers.length) {
            i = barbers.length - 1
         }
         if (i < 0) {
            i = 0
         }
         clearTimeout(TIME_OUT)

         TIME_OUT = setTimeout(() => {
            if (mapIndex !== i) {
               mapIndex = i
               const { coords } = barbers[i].profile!
               mapRef.current?.animateToRegion(
                  {
                     latitude: coords?.lat!,
                     longitude: coords?.lng!,
                     ...DELTA
                  },
                  350
               )
            }
         }, 350)
      })

      return () => {
         animatedX.removeListener(sub)
      }
   })

   useEffect(() => {
      console.log('index', index)
      flatListRef.current?.scrollToIndex({
         index,
         animated: true,
         viewOffset: index === 0 ? 20 : 10,
         viewPosition: 0.5
      })

      // mapRef.current?.animateToRegion();
   }, [index])

   if (barbers.length === 0) return null
   return (
      <Animated.FlatList
         ref={flatListRef}
         data={[...barbers]}
         contentContainerStyle={{
            paddingRight: Platform.OS === 'android' ? INSET : 0,
            gap: 8,
            height: CARD_HEIGHT,
            // width: CARD_WIDTH,
            backgroundColor: colors.background
         }}
         pagingEnabled
         contentInset={{
            left: INSET,
            right: INSET,
            top: 0,
            bottom: 0
         }}
         onScroll={Animated.event(
            [
               {
                  nativeEvent: {
                     contentOffset: { x: animatedX }
                  }
               }
            ],
            { useNativeDriver: true }
         )}
         snapToAlignment="center"
         snapToInterval={CARD_WIDTH + 30}
         decelerationRate="fast"
         bounces={false}
         initialScrollIndex={0}
         showsHorizontalScrollIndicator={false}
         horizontal
         //style={styles.scrollView}
         keyExtractor={(item, index) => index.toString() + item.id}
         renderItem={({ item, index }) => (
            <TouchableOpacity
               style={{ width: CARD_WIDTH + 30 }}
               onPress={() => {
                  console.log('index', index)
                  mapRef.current?.animateToRegion(
                     {
                        latitude: item.profile?.coords?.lat!,
                        longitude: item.profile?.coords?.lng!,
                        ...DELTA
                     },
                     600
                  )
               }}
            >
               <BarberImageHeader
                  barber={item}
                  showFavoriteButton={false}
                  onPressBack={() => {}}
                  showBookingButton
                  showTopControl={false}
               />
            </TouchableOpacity>
         )}
      />
   )
}

export default BarbersListMapView
