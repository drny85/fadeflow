import { View, Text, Animated } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { StyleSheet } from 'nativewind'
import Constants from 'expo-constants'

import * as SplashScreen from 'expo-splash-screen'
const image = require('~/assets/images/banner.png')

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
            source={image}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
         />
      </Animated.View>
   )
}

export default Index
