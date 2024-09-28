import { View, Text, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { Icon } from '@roninoss/icons'
import { Sheet, useSheetRef } from './nativewindui/Sheet'
import { SIZES } from '~/constants'
import { SymbolView } from 'expo-symbols'
import { useColorScheme } from '~/lib/useColorScheme'
import { Octicons } from '@expo/vector-icons'

const BroadcastMessageScreen = () => {
   const bottomSheetRef = useSheetRef()
   const { colors, isDarkColorScheme } = useColorScheme()
   return (
      <View>
         <TouchableOpacity onPress={() => bottomSheetRef.current?.present()}>
            {Platform.OS === 'ios' ? (
               <SymbolView
                  name="message.badge.waveform"
                  size={32}
                  tintColor={isDarkColorScheme ? '#ffffff' : colors.primary}
                  colors={isDarkColorScheme ? '#ffffff' : colors.primary}
               />
            ) : (
               <Octicons
                  name="broadcast"
                  size={32}
                  color={isDarkColorScheme ? '#ffffff' : colors.primary}
               />
            )}
         </TouchableOpacity>
         <Sheet
            snapPoints={['100%']}
            topInset={SIZES.statusBarHeight}
            ref={bottomSheetRef}
         >
            <View className="flex-1">
               <Text>BroadcastMessageScreen</Text>
            </View>
         </Sheet>
      </View>
   )
}

export default BroadcastMessageScreen
