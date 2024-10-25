import React, { useState, useEffect } from 'react'
import { View, Button } from 'react-native'
import Animated, {
   useSharedValue,
   useAnimatedStyle,
   withTiming
} from 'react-native-reanimated'
import { updateUser } from '~/actions/users'

import { i18n } from '~/locales/i18n'
import { useAuth } from '~/providers/AuthContext'
import { setStoredLanguage, getStoredLanguage } from '~/providers/languague'
import { Languague } from '~/shared/types'

const LanguageSwitcher = () => {
   const { user } = useAuth()
   const lng = getStoredLanguage()
   const [language, setLanguage] = useState(lng)

   // Shared value for the button animation
   const animationValue = useSharedValue(1)

   // Set the language in MMKV and animate
   const changeLanguage = async (lang: Languague) => {
      // Trigger animation
      animationValue.value = 0.5
      setLanguage(lang)
      setStoredLanguage(lang)
      i18n.changeLanguage(lang)

      // Animate back to normal
      animationValue.value = withTiming(1, { duration: 500 })
      if (user) {
         await updateUser({ ...user, languague: lang })
      }
   }

   useEffect(() => {
      const storedLang = getStoredLanguage()
      if (storedLang && storedLang !== language) {
         changeLanguage(storedLang)
      }
   }, [])

   // Animation style for buttons
   const animatedStyle = useAnimatedStyle(() => {
      return {
         transform: [{ scale: animationValue.value }],
         opacity: animationValue.value
      }
   })

   return (
      <View className="flex-row gap-3">
         {/* Animated English Button */}
         <Animated.View style={animatedStyle}>
            <Button
               title="English"
               onPress={() => changeLanguage('en')}
               disabled={language === 'en'}
            />
         </Animated.View>

         {/* Animated Spanish Button */}
         <Animated.View style={animatedStyle}>
            <Button
               title="Español"
               onPress={() => changeLanguage('es')}
               disabled={language === 'es'}
            />
         </Animated.View>
      </View>
   )
}

export default LanguageSwitcher
