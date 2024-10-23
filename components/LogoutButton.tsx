import { Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { translation } from '~/locales/translate'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '~/providers/AuthContext'
import { useColorScheme } from '~/lib/useColorScheme'

const LogoutButton = () => {
   const { user, logOut } = useAuth()
   const { colors } = useColorScheme()
   const handleSignOut = () => {
      Alert.alert('Signing Out', 'Are you sure you want to sign out?', [
         {
            text: 'Yes',
            style: 'destructive',
            onPress: logOut
         },
         { text: 'Cancel', style: 'cancel' }
      ])
   }

   return (
      <TouchableOpacity
         className="flex-row items-center gap-2"
         onPress={handleSignOut}
      >
         <Text
            className={`font-semibold mr-2 ${user?.image ? 'text-accent' : 'text-slate-200'}`}
         >
            {translation('profile', 'logout')}
         </Text>
         <Ionicons
            name="exit"
            size={26}
            color={user?.image ? colors.accent : '#ffffff'}
         />
      </TouchableOpacity>
   )
}

export default LogoutButton
