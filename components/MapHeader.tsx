import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { Image, ImageBackground } from 'expo-image'
import { router } from 'expo-router'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View, ViewStyle } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Loading from './Loading'
import { Text } from './nativewindui/Text'

import { useLocation } from '~/hooks/useLocation'
import { customMapStyle } from '~/lib/customMapStyle'
import { useColorScheme } from '~/lib/useColorScheme'
import { useAuth } from '~/providers/AuthContext'
import { useBarbersStore } from '~/providers/useBarbersStore'
import { Barber } from '~/shared/types'
import ViewNotificationButton from './ViewNotificationButton'

type Props = {
   shouldGoBack: boolean
   containerStyle?: ViewStyle
   barberInfo?: Barber
}

const MapHeader = ({ shouldGoBack, containerStyle, barberInfo }: Props) => {
   const mapRef = useRef<MapView>(null)
   const { isDarkColorScheme } = useColorScheme()
   const { user } = useAuth()
   const { top } = useSafeAreaInsets()
   const { t } = useTranslation()

   const { getBarberById } = useBarbersStore()
   const { location, loading } = useLocation()
   const barberId = user && !user.isBarber && user.favoriteBarber
   const barber =
      barberInfo !== undefined ? barberInfo : getBarberById(barberId as string)
   const coords = barber && barber.profile?.coords && barber.profile.coords

   useEffect(() => {
      if (!coords) return
      mapRef.current?.animateToRegion({
         longitude: coords?.lng!,
         latitude: coords?.lat!,
         latitudeDelta: 0.002, // Smaller value for closer zoom
         longitudeDelta: 0.002
      })
      mapRef.current?.animateCamera({
         center: { longitude: coords?.lng!, latitude: coords?.lat! },
         pitch: 70,
         heading: 90,
         altitude: 140
      })
   }, [mapRef, user, coords])

   if (loading) return <Loading />

   return (
      <View style={[{ flex: 0.5 }, containerStyle]}>
         {(location && barber && !user?.isBarber && user?.favoriteBarber) ||
         barberInfo !== undefined ? (
            <MapView
               ref={mapRef}
               customMapStyle={customMapStyle}
               style={{ flex: 1 }}
               region={{
                  longitude: coords?.lng!,
                  latitude: coords?.lat!,
                  latitudeDelta: 0.002, // Smaller value for closer zoom
                  longitudeDelta: 0.002
               }}
               initialRegion={{
                  longitude: coords?.lng!,
                  latitude: coords?.lat!,
                  latitudeDelta: 0.002, // Smaller value for closer zoom
                  longitudeDelta: 0.002
               }}
            >
               <Marker
                  coordinate={{
                     longitude: coords?.lng!,
                     latitude: coords?.lat!
                  }}
                  identifier="barber"
                  description={barber.profile?.address}
                  title={barber.profile?.barbershopName}
               />
            </MapView>
         ) : (
            <ImageBackground
               source={require('~/assets/images/banner.png')}
               style={{ width: '100%', height: '100%' }}
            />
         )}
         <View
            style={{
               top: top - 10,
               position: 'absolute',
               zIndex: 20,
               padding: 4,
               left: 0,
               right: 0,
               width: '100%',
               flexDirection: 'row',
               alignItems: 'center',
               paddingHorizontal: 16,
               justifyContent: 'space-between'
            }}
         >
            {shouldGoBack ? (
               <TouchableOpacity
                  className="rounded-full p-2"
                  onPress={router.back}
               >
                  <FontAwesome
                     name="chevron-left"
                     size={26}
                     color={isDarkColorScheme ? 'white' : 'black'}
                  />
               </TouchableOpacity>
            ) : (
               <Image
                  style={{
                     width: 60,
                     height: 60,
                     borderRadius: 30,
                     objectFit: 'cover',
                     backgroundColor: 'white'
                  }}
                  source={
                     user?.image
                        ? { uri: user.image }
                        : require('~/assets/images/banner.png')
                  }
               />
            )}
            {user && !barberInfo ? (
               <Text className="font-raleway-bold text-2xl text-white">
                  {t('welcome', { name: user?.name?.split(' ')[0] })}
               </Text>
            ) : (
               <Text className="font-raleway-bold text-2xl text-accent">
                  Location
               </Text>
            )}
            {coords && !user?.isBarber && user?.favoriteBarber ? (
               <View className="flex-row items-center gap-4">
                  <ViewNotificationButton />
                  <TouchableOpacity
                     onPress={() => {
                        mapRef.current?.animateCamera({
                           center: {
                              longitude: coords?.lng!,
                              latitude: coords?.lat!
                           },
                           pitch: 60,
                           heading: 90,
                           altitude: 100
                        })
                     }}
                  >
                     <MaterialIcons
                        name="location-searching"
                        size={28}
                        color={isDarkColorScheme ? 'white' : 'black'}
                     />
                  </TouchableOpacity>
               </View>
            ) : (
               <View className="mr-2">
                  <ViewNotificationButton iconColor={'#ffffff'} />
               </View>
            )}
         </View>
      </View>
   )
}

export default MapHeader
