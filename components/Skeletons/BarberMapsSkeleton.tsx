import { MotiView } from 'moti'
import { Skeleton } from 'moti/skeleton'
import { StyleSheet, View } from 'react-native'

import { SIZES } from '~/constants'
import { useColorScheme } from '~/lib/useColorScheme'

export default function BarbersMapSkelenton() {
   const { colors, colorScheme } = useColorScheme()

   return (
      <MotiView
         transition={{
            duration: 1000
         }}
         style={[styles.container, { backgroundColor: colors.background }]}
         animate={{ backgroundColor: colors.card }}
      >
         <View style={{ flex: 0.7 }}>
            <Skeleton
               colorMode={colorScheme}
               width="100%"
               height={SIZES.height * 0.7}
            />
         </View>

         <Spacer height={10} />
         <View
            style={{ gap: 2, flex: 0.25, flexDirection: 'row', width: '100%' }}
         >
            <Skeleton
               colorMode={colorScheme}
               width="80%"
               height={SIZES.height * 0.25}
               radius={10}
            />
            <Skeleton
               colorMode={colorScheme}
               width="100%"
               height={SIZES.height * 0.25}
               radius={10}
            />
            <Skeleton
               colorMode={colorScheme}
               width="80%"
               height={SIZES.height * 0.25}
               radius={10}
            />
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
