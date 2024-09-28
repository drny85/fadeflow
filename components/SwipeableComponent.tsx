import { Icon } from '@roninoss/icons'
import { useRef } from 'react'
import {
   Animated,
   Dimensions,
   StyleSheet,
   Text,
   TouchableOpacity,
   View
} from 'react-native'
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler'

import { AppointmentStatus } from '~/shared/types'

const SCREEN_WIDTH = Dimensions.get('window').width

type Props = {
   children: React.ReactNode
   onConfirm: () => Promise<boolean>
   onCancel: () => Promise<boolean>
   status: AppointmentStatus
   disabled?: boolean
}
const OPEN_SIZE = SCREEN_WIDTH * 0.6
const SwipeableComponent: React.FC<Props> = ({
   children,
   onConfirm,
   onCancel,
   status,
   disabled
}) => {
   const ref = useRef<Swipeable>(null)

   // Render right actions for Confirm and Cancel
   const renderRightActions = (progress: any, dragX: any) => {
      const transConfirm = dragX.interpolate({
         inputRange: [-OPEN_SIZE, 0],
         outputRange: [0, OPEN_SIZE]
      })
      //   const transCancel = dragX.interpolate({
      //      inputRange: [-200, -100, 0],
      //      outputRange: [0, 100, 100]
      //   })

      return (
         <View style={{ width: OPEN_SIZE, flexDirection: 'row' }}>
            <Animated.View
               style={[
                  styles.rightAction,
                  { transform: [{ translateX: transConfirm }] }
               ]}
            >
               <TouchableOpacity
                  onPress={async () => {
                     const canceled = await onCancel()
                     if (canceled) ref.current?.close()
                  }}
               >
                  {status === 'pending' ? (
                     <View className="flex-row items-center gap-1">
                        <Icon name="close" color="red" size={26} />
                        <Text className="text-red-500 font-roboto-bold">
                           Cancel
                        </Text>
                     </View>
                  ) : (
                     <Text className="text-red-500 font-roboto-bold">Back</Text>
                  )}
               </TouchableOpacity>
            </Animated.View>

            <Animated.View
               style={[
                  styles.confirmAction,
                  { transform: [{ translateX: transConfirm }] }
               ]}
            >
               <TouchableOpacity
                  onPress={async () => {
                     const confirmed = await onConfirm()
                     if (confirmed) ref.current?.close()
                  }}
               >
                  <View className="flex-row gap-2 items-center">
                     <Text className="font-roboto-bold text-slate-900 dark:text-slate-100">
                        {status === 'pending'
                           ? 'Confirm'
                           : status === 'confirmed'
                             ? 'Complete'
                             : 'No action'}
                     </Text>
                     <Icon name="check" color="green" size={26} />
                  </View>
               </TouchableOpacity>
            </Animated.View>
         </View>
      )
   }

   return (
      <GestureHandlerRootView style={styles.container}>
         {disabled ? (
            <View>{children}</View>
         ) : (
            <Swipeable
               ref={ref}
               friction={2}
               rightThreshold={40}
               overshootRight={false}
               renderRightActions={disabled ? undefined : renderRightActions}
            >
               {children}
            </Swipeable>
         )}
      </GestureHandlerRootView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1
   },
   rightAction: {
      width: OPEN_SIZE / 2,
      justifyContent: 'center',
      alignItems: 'flex-end',
      padding: 20
   },
   confirmAction: {
      width: OPEN_SIZE / 2,
      justifyContent: 'center',
      alignItems: 'flex-end',
      padding: 20
   }
})

export default SwipeableComponent
