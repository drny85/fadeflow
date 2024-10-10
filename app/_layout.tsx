import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { Slot } from 'expo-router'

import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'

import 'react-native-get-random-values'
import { AuthProvider } from '~/providers/AuthContext'
import { useUpdates } from '~/hooks/useUpdates'

export default function Root() {
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
