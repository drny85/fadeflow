import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
   useAnimatedStyle,
   useSharedValue,
   withTiming
} from 'react-native-reanimated'

import { useColorScheme } from '~/lib/useColorScheme'
import { Text } from './nativewindui/Text'

type Props = {
   value: number
   height?: number
}

const ProgressBar = ({ value, height = 20 }: Props) => {
   const { colors } = useColorScheme()
   const progress = useSharedValue(0)
   const animateView = useAnimatedStyle(() => {
      return {
         width: `${progress.value}%`
      }
   })

   useEffect(() => {
      progress.value = withTiming(value)
   }, [value])

   return (
      <View
         style={[styles.progressBar, { backgroundColor: colors.grey, height }]}
      >
         <Animated.View
            style={[
               styles.progress,
               { backgroundColor: colors.accent, height },
               animateView
            ]}
         />
         <Text
            style={{
               fontSize: height * 0.8,
               fontWeight: '700',
               textAlign: 'center'
            }}
         >
            {value}%
         </Text>
      </View>
   )
}

export default ProgressBar

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20
   },
   progressBar: {
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      justifyContent: 'center',

      marginTop: 8
   },
   progress: {
      height: '100%',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0
   }
})
