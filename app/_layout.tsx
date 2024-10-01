import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { Slot } from 'expo-router'
import { useUpdates } from 'expo-updates'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'

import { useLinking } from '~/hooks/useLinking'
import { AuthProvider } from '~/providers/AuthContext'

export default function Root() {
   useLinking()
   useUpdates()

   // useDevRoutes();
   // Set up the auth context and render our layout inside of it.
   return (
      <GestureHandlerRootView style={{ flex: 1 }}>
         <AuthProvider>
            <KeyboardProvider>
               <BottomSheetModalProvider>
                  <Slot />
               </BottomSheetModalProvider>
            </KeyboardProvider>
         </AuthProvider>
      </GestureHandlerRootView>
   )
}
