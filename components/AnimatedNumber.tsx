import React, { useEffect } from 'react'
import { TextInput, Animated, Easing, TextStyle } from 'react-native'

import { useColorScheme } from '~/lib/useColorScheme'

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

type Props = {
   value: number
   fontSize?: number
   prefix?: string
   fixed?: boolean
   textStyle?: TextStyle
}
const AnimatedNumber = ({
   value,
   fontSize = 20,
   prefix = '$',
   fixed = true,
   textStyle
}: Props) => {
   const inputRef = React.useRef<TextInput>(null)
   const animated = React.useRef(new Animated.Value(0)).current
   const { colors, isDarkColorScheme } = useColorScheme()
   const animation = (toValue: number) => {
      return Animated.timing(animated, {
         delay: 200,
         toValue,
         duration: 500,
         useNativeDriver: true,
         easing: Easing.out(Easing.ease)
      }).start()
   }

   useEffect(() => {
      animation(value)
      animated.addListener(({ value }) => {
         if (inputRef.current) {
            inputRef.current.setNativeProps({
               text: fixed
                  ? `${prefix}${value.toFixed(2)}`
                  : `${prefix}${Math.ceil(value)}`
            })
         }
      })
      return () => {
         animated.removeAllListeners()
      }
   }, [value, fixed])

   return (
      <AnimatedTextInput
         ref={inputRef}
         underlineColorAndroid="transparent"
         editable={false}
         defaultValue="0"
         style={[
            {
               fontSize: fontSize,
               color: isDarkColorScheme ? '#dedede' : colors.accent
            },
            textStyle
         ]}
      />
   )
}

export default AnimatedNumber
