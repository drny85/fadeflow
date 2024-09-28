import { Feather } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Map, { Marker } from 'react-native-maps'

import BarbersListMapView from './BarbersListMapView'
import { Sheet, useSheetRef } from './nativewindui/Sheet'

import { SIZES } from '~/constants'
import { useLocation } from '~/hooks/useLocation'
import { useColorScheme } from '~/lib/useColorScheme'
import { useBarbersStore } from '~/providers/useBarbersStore'

const BarbersMap = () => {
   const { colors } = useColorScheme()
   const [index, setIndex] = useState(0)
   const { loading, location } = useLocation()
   const snapPoints = useMemo(() => ['100%'], [])
   const { barbers } = useBarbersStore()
   const bottomSheetRef = useSheetRef()

   const mapRef = useRef<Map>(null)
   const centerMap = () => {
      mapRef.current?.fitToSuppliedMarkers(
         barbers.map((b) => b.id),
         { edgePadding: { top: 50, right: 80, bottom: 50, left: 80 } }
      )
   }

   useEffect(() => {
      let timeout: NodeJS.Timeout
      if (barbers.length > 0) {
         timeout = setTimeout(() => {
            centerMap()
         }, 1000)
      }
      return () => clearTimeout(timeout)
   }, [barbers.length])

   if (loading || !location) return null
   return (
      <View className="flex-1">
         <TouchableOpacity onPress={() => bottomSheetRef.current?.present()}>
            <Feather size={24} name="map" color={colors.accent} />
         </TouchableOpacity>
         <Sheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            index={0}
            enablePanDownToClose
         >
            <View
               style={{
                  position: 'absolute',
                  flexDirection: 'row',
                  justifyContent: 'space-between',

                  top: SIZES.statusBarHeight - 20,
                  width: '100%',
                  zIndex: 200
               }}
            >
               <TouchableOpacity
                  onPress={() => bottomSheetRef.current?.close()}
               >
                  <Feather
                     style={{ padding: 10 }}
                     name="chevron-left"
                     size={28}
                  />
               </TouchableOpacity>
               <TouchableOpacity onPress={centerMap}>
                  <Feather name="map-pin" style={{ padding: 10 }} size={26} />
               </TouchableOpacity>
            </View>

            <Map
               ref={mapRef}
               initialRegion={{
                  latitude: location?.coords.latitude,
                  longitude: location?.coords.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421
               }}
               style={{ flex: 0.7 }}
            >
               {barbers.map((barber, index) => (
                  <Marker
                     key={barber.id}
                     identifier={barber.id}
                     onPress={() => setIndex(index)}
                     coordinate={{
                        latitude: barber.profile?.coords?.lat!,
                        longitude: barber.profile?.coords?.lng!
                     }}
                     title={barber.name}
                     description={barber.profile?.address}
                  >
                     <TouchableOpacity
                        onPress={() =>
                           mapRef.current?.animateToRegion({
                              latitude: barber.profile?.coords?.lat!,
                              longitude: barber.profile?.coords?.lng!,
                              latitudeDelta: 0.0922,
                              longitudeDelta: 0.0421
                           })
                        }
                     >
                        <Image
                           style={{
                              height: 60,
                              width: 60,
                              borderRadius: 30,
                              objectFit: 'cover'
                           }}
                           source={
                              barber.image
                                 ? { uri: barber.image }
                                 : require('~/assets/images/banner.png')
                           }
                        />
                     </TouchableOpacity>
                  </Marker>
               ))}
            </Map>
            <View style={{ flex: 0.3 }}>
               <BarbersListMapView
                  barbers={barbers}
                  mapRef={mapRef}
                  index={index}
               />
            </View>
         </Sheet>
      </View>
   )
}

export default BarbersMap
