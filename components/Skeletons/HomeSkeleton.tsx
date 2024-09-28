import { MotiView } from 'moti'
import { Skeleton } from 'moti/skeleton'
import { StyleSheet, View } from 'react-native'

import { SIZES } from '~/constants'
import { useColorScheme } from '~/lib/useColorScheme'

export default function HomeSkelenton() {
   const { colors, colorScheme } = useColorScheme()

   return (
      <MotiView
         transition={{
            duration: 1000
         }}
         style={[styles.container, { backgroundColor: colors.background }]}
         animate={{ backgroundColor: colors.card }}
      >
         <View style={{ flex: 0.4 }}>
            <Skeleton
               colorMode={colorScheme}
               width={'100%'}
               height={SIZES.height * 0.35}
            />
         </View>

         <Spacer height={20} />
         <View style={{ gap: 10, flex: 0.6 }}>
            {[...Array(3)].map((_, index) => (
               <View key={index}>
                  <Skeleton
                     colorMode={colorScheme}
                     width="100%"
                     height={SIZES.height * 0.15}
                     radius={10}
                  />
                  <View
                     style={{
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 16
                     }}
                  >
                     <Skeleton
                        colorMode={colorScheme}
                        height={42}
                        width={SIZES.width / 3}
                        radius={35}
                     />
                  </View>
               </View>
            ))}
         </View>
         {/* <Spacer height={20} />
         <View style={{ gap: 12 }}>
            {[...Array(3)].map((_, index) => (
               <Skeleton
                  key={index}
                  colorMode={colorScheme}
                  width={'100%'}
                  height={SIZES.height * 0.2}
               />
            ))}
         </View> */}
      </MotiView>
   )
}

const Spacer = ({ height = 16 }) => <View style={{ height }} />

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center'
   },
   padded: {
      padding: 10
   }
})
