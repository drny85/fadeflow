import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { ColorValue, TouchableOpacity } from 'react-native'
import { useColorScheme } from '~/lib/useColorScheme'
import { useAuth } from '~/providers/AuthContext'

type Props = {
   iconColor?: ColorValue
}
const ViewNotificationButton = ({ iconColor }: Props) => {
   const { colors, isDarkColorScheme } = useColorScheme()
   const { user } = useAuth()
   if (!user) return null
   return (
      <TouchableOpacity onPress={() => router.push('/notifications')}>
         <Ionicons
            name="notifications"
            size={28}
            color={
               iconColor
                  ? iconColor
                  : isDarkColorScheme
                    ? colors.primary
                    : colors.accent
            }
         />
      </TouchableOpacity>
   )
}

export default ViewNotificationButton
