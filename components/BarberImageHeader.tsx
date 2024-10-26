import { Feather, FontAwesome } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { ImageBackground } from 'expo-image'
import { router } from 'expo-router'
import { Platform, Pressable, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import CommunicationButtons from './CommunicationButtons'
import { Text } from './nativewindui/Text'

import { updateUser } from '~/actions/users'
import { SIZES } from '~/constants'
import { useReviews } from '~/hooks/useReviews'
import { useTranslate } from '~/hooks/useTranslation'
import { useUser } from '~/hooks/useUser'
import { toastMessage } from '~/lib/toast'
import { useColorScheme } from '~/lib/useColorScheme'
import { useAuth } from '~/providers/AuthContext'
import { Barber } from '~/shared/types'
import { shareBarberLink } from '~/utils/shareBarberLink'
import { useMemo } from 'react'
import { barberRating } from '~/utils/barberRating'
import { LinearGradient } from 'expo-linear-gradient'

type Props = {
   barber: Barber
   onPressBack: () => void
   showBookingButton?: boolean
   showTopControl?: boolean
   showFavoriteButton?: boolean
}

const BarberImageHeader = ({
   barber,
   onPressBack,
   showBookingButton,
   showTopControl = true,
   showFavoriteButton = true
}: Props) => {
   const { top } = useSafeAreaInsets()
   const translate = useTranslate()
   useUser()
   const { colors } = useColorScheme()
   const { user } = useAuth()
   const { reviews } = useReviews()
   const rating = barberRating(reviews, barber.id)

   const barberReviews = reviews.filter((r) => r.barberId === barber.id)

   const address = barber.profile?.address

   const toggleFavorite = async () => {
      if (!user) {
         toastMessage({
            title: 'Error',

            message: 'You not logged in',
            preset: 'error'
         })
      }
      if (!user || !barber) return
      if (user.isBarber) return

      try {
         await updateUser({
            ...user,
            favoriteBarber: user.favoriteBarber ? null : barber.id
         })
      } catch (error) {
         console.log(error)
      }
   }

   return (
      <Pressable
         disabled={showTopControl}
         onPress={() =>
            router.push({
               pathname: '/barber',
               params: { barberId: barber.id }
            })
         }
      >
         <ImageBackground
            contentFit="cover"
            transition={300}
            style={{
               height: SIZES.height * 0.28,
               borderRadius: 20,
               backgroundColor: colors.card,
               overflow: 'hidden'
            }}
            source={
               barber.image
                  ? { uri: barber.image }
                  : require('~/assets/images/banner.png')
            }
         >
            {showTopControl && (
               <View className="absolute left-3 right-3 z-30 flex-row justify-between">
                  <TouchableOpacity
                     onPress={onPressBack}
                     className="z-30 rounded-full bg-slate-300 p-1"
                     style={{ top }}
                  >
                     <Feather
                        name="chevron-left"
                        size={30}
                        color={colors.accent}
                     />
                  </TouchableOpacity>
                  <TouchableOpacity
                     onPress={() => shareBarberLink(barber.id)}
                     className="rounded-full bg-slate-300 p-1"
                     style={{ top }}
                  >
                     <Feather name="share" size={30} color={colors.accent} />
                  </TouchableOpacity>
               </View>
            )}
            {Platform.OS === 'android' && (
               <LinearGradient
                  // intensity={70}
                  // tint="prominent"
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  start={{ y: 0, x: 0 }}
                  end={{
                     y: 0.5,
                     x: 0
                  }}
                  className="absolute bottom-0 left-0 right-0 z-10  overflow-hidden rounded-b-2xl p-3"
               >
                  <View className="mb-2 flex-row items-center justify-between gap-2">
                     <View className="flex-row items-center justify-between gap-2">
                        <Text
                           variant="title2"
                           className="text-white dark:text-slate-200"
                        >
                           {barber.name}
                        </Text>

                        {showFavoriteButton && (
                           <TouchableOpacity onPress={toggleFavorite}>
                              <FontAwesome
                                 name={
                                    !user?.isBarber &&
                                    user?.favoriteBarber &&
                                    user.favoriteBarber === barber.id
                                       ? 'heart'
                                       : 'heart-o'
                                 }
                                 color="red"
                                 size={26}
                              />
                           </TouchableOpacity>
                        )}
                     </View>
                     {showBookingButton && (
                        <TouchableOpacity
                           onPress={() =>
                              router.push({
                                 pathname: '/booking',
                                 params: { barberId: barber.id }
                              })
                           }
                           className="mr-3 rounded-md bg-accent px-3 py-1 dark:bg-primary"
                        >
                           <Text className="font-bold text-white">
                              {translate('button.book')}
                           </Text>
                        </TouchableOpacity>
                     )}
                  </View>
                  {barber.profile && address && (
                     <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        className="font-roboto text-sm text-white dark:text-slate-200"
                     >
                        {address && address.includes('USA')
                           ? address.slice(0, address.length - 5)
                           : address}
                     </Text>
                  )}
                  <View className="flex-row items-center justify-between">
                     <View className="flex-row items-center gap-1">
                        <FontAwesome name="star" color="orange" size={20} />
                        <Text className="text-sm text-white dark:text-slate-200">
                           {rating === 0 ? (
                              translate('barber.no_review')
                           ) : (
                              <Text className="text-white text-sm dark:text-slate-200">
                                 {rating.toFixed(1)}{' '}
                                 {translate('barber.rating')}
                              </Text>
                           )}
                        </Text>
                        {barberReviews.length > 0 && (
                           <Text className="text-sm text-white dark:text-slate-200">
                              ({barberReviews.length}{' '}
                              {translate('barber.review')})
                           </Text>
                        )}
                     </View>
                     <View className="w-1/3  flex-row self-end">
                        <CommunicationButtons
                           phone={barber.phone}
                           color="#ffffff"
                        />
                     </View>
                  </View>
               </LinearGradient>
            )}
            {Platform.OS === 'ios' && (
               <BlurView
                  intensity={70}
                  tint="prominent"
                  className="absolute bottom-0 left-0 right-0 z-10  overflow-hidden rounded-b-2xl p-3"
               >
                  <View className="mb-2 flex-row items-center justify-between gap-2">
                     <View className="flex-row items-center justify-between gap-2">
                        <Text
                           variant="title2"
                           className="text-slate-700 dark:text-slate-200"
                        >
                           {barber.name}
                        </Text>

                        {showFavoriteButton && (
                           <TouchableOpacity onPress={toggleFavorite}>
                              <FontAwesome
                                 name={
                                    !user?.isBarber &&
                                    user?.favoriteBarber &&
                                    user.favoriteBarber === barber.id
                                       ? 'heart'
                                       : 'heart-o'
                                 }
                                 color="red"
                                 size={26}
                              />
                           </TouchableOpacity>
                        )}
                     </View>
                     {showBookingButton && (
                        <TouchableOpacity
                           onPress={() =>
                              router.push({
                                 pathname: '/booking',
                                 params: { barberId: barber.id }
                              })
                           }
                           className="mr-3 rounded-md bg-accent px-3 py-1 dark:bg-primary"
                        >
                           <Text className="font-bold text-white">
                              {translate('button.book')}
                           </Text>
                        </TouchableOpacity>
                     )}
                  </View>
                  {barber.profile && address && (
                     <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        className="font-roboto text-sm text-slate-800 dark:text-slate-200"
                     >
                        {address && address.includes('USA')
                           ? address.slice(0, address.length - 5)
                           : address}
                     </Text>
                  )}
                  <View className="flex-row items-center justify-between">
                     <View className="flex-row items-center gap-1">
                        <FontAwesome name="star" color="orange" size={20} />
                        <Text className="text-sm text-slate-700 dark:text-slate-200">
                           {rating === 0 ? (
                              translate('barber.no_review')
                           ) : (
                              <Text className="text-slate-700 text-sm dark:text-slate-200">
                                 {rating.toFixed(1)}{' '}
                                 {translate('barber.rating')}
                              </Text>
                           )}
                        </Text>
                        {barberReviews.length > 0 && (
                           <Text className="text-sm text-slate-700 dark:text-slate-200">
                              ({barberReviews.length}{' '}
                              {translate('barber.review')})
                           </Text>
                        )}
                     </View>
                     <View className="w-1/3  flex-row self-end">
                        <CommunicationButtons phone={barber.phone} />
                     </View>
                  </View>
               </BlurView>
            )}
         </ImageBackground>
      </Pressable>
   )
}

export default BarberImageHeader
