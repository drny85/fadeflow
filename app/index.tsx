import Constants from 'expo-constants'
import { router } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StyleSheet } from 'nativewind'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Animated } from 'react-native'

const Index = () => {
   const [isAppReady, setAppReady] = useState(false)
   const animation = useMemo(() => new Animated.Value(1), [])
   const [isSplashAnimationComplete, setAnimationComplete] = useState(false)

   const onImageLoaded = useCallback(async () => {
      try {
         await SplashScreen.hideAsync()
         // Load stuff
      } catch (e) {
         // handle errors
      } finally {
         setAppReady(true)
      }
   }, [])
   useEffect(() => {
      if (isAppReady) {
         Animated.timing(animation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true
         }).start(() => setAnimationComplete(true))
      }
   }, [isAppReady])

   useEffect(() => {
      if (isSplashAnimationComplete) {
         router.replace('/(app)/(tabs)')
      }
   }, [isSplashAnimationComplete])

   console.log('rendering')
   return (
      <Animated.View
         pointerEvents="none"
         style={[
            StyleSheet.absoluteFill,
            {
               backgroundColor: Constants.expoConfig?.splash?.backgroundColor,
               opacity: animation
            }
         ]}
      >
         <Animated.Image
            style={{
               width: '100%',
               height: '100%',
               resizeMode:
                  Constants.expoConfig?.splash?.resizeMode || 'contain',
               transform: [
                  {
                     scale: animation
                  }
               ]
            }}
            source={require('~/assets/images/banner.png')}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
         />
      </Animated.View>
   )
}

export default Index
