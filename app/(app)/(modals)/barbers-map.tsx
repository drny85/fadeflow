import { Feather } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import Map, { Marker, MarkerPressEvent } from 'react-native-maps'
import BarbersListMapView from '~/components/BarbersListMapView'
import { SIZES } from '~/constants'
import { useLocation } from '~/hooks/useLocation'
import { useColorScheme } from '~/lib/useColorScheme'
import { useBarbersStore } from '~/providers/useBarbersStore'

const INSET = SIZES.width * 0.1 - 10
const DELTA = {
   longitudeDelta: 0.005,
   latitudeDelta: 0.005
}

const BarbersMap = () => {
   const { colors } = useColorScheme()
   const { loading, location } = useLocation()
   const { barbers } = useBarbersStore()

   const [index, setIndex] = useState(0)

   const mapRef = useRef<Map>(null)

   const onMarkerPress = (e: MarkerPressEvent) => {
      const coords = e.nativeEvent.coordinate
      if (coords && coords.latitude) {
         mapRef.current?.animateToRegion(
            {
               latitude: coords.latitude,
               longitude: coords.longitude,
               latitudeDelta: 0.0922,
               longitudeDelta: 0.0421
            },
            600
         )
      }
   }

   const centerMap = useCallback(() => {
      mapRef.current?.fitToSuppliedMarkers([...barbers.map((r) => r.id!)], {
         edgePadding: {
            right: INSET,
            left: INSET,
            top: INSET,
            bottom: INSET
         },
         animated: true
      })
   }, [])

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
            <TouchableOpacity onPress={() => router.back()}>
               <Feather style={{ padding: 10 }} name="chevron-left" size={28} />
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
                  onPress={(e) => {
                     console.log(index)
                     setIndex(index)
                     onMarkerPress(e)
                  }}
                  identifier={barber.id}
                  coordinate={{
                     latitude: barber.profile?.coords?.lat!,
                     longitude: barber.profile?.coords?.lng!
                  }}
                  title={barber.name}
                  description={barber.profile?.address}
               >
                  <TouchableOpacity>
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
      </View>
   )
}

export default BarbersMap
