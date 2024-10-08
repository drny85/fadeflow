import { FontAwesome } from '@expo/vector-icons'
import { ComponentProps, forwardRef } from 'react'
import {
   StyleSheet,
   Text,
   TextStyle,
   TouchableOpacity,
   TouchableOpacityProps
} from 'react-native'

import { ActivityIndicator } from './nativewindui/ActivityIndicator'

type ButtonProps = {
   title?: string
   primary?: boolean
   textStyle?: TextStyle
   iconName?: ComponentProps<typeof FontAwesome>['name']
   iconSize?: number
   isLoading?: boolean
} & TouchableOpacityProps

export const Button = forwardRef<TouchableOpacity, ButtonProps>(
   (
      {
         title,
         textStyle,
         iconName,
         iconSize,
         isLoading,
         primary = false,
         ...touchableProps
      },
      ref
   ) => {
      return (
         <TouchableOpacity
            ref={ref}
            {...touchableProps}
            className={`flex-row items-center justify-center rounded-full ${primary ? 'bg-primary' : 'bg-accent'} px-4 py-3 shadow-sm dark:bg-primary`}
            style={[touchableProps.style]}
         >
            {iconName && (
               <FontAwesome
                  name={iconName}
                  size={iconSize && iconName ? iconSize : 22}
                  color="#FFFFFF"
                  style={{ marginRight: 8 }}
               />
            )}
            {isLoading ? (
               <ActivityIndicator />
            ) : (
               <Text style={[styles.buttonText, textStyle]}>{title}</Text>
            )}
         </TouchableOpacity>
      )
   }
)

const styles = StyleSheet.create({
   button: {
      alignItems: 'center',

      borderRadius: 26,
      elevation: 5,
      flexDirection: 'row',
      justifyContent: 'center',
      padding: 16,
      shadowColor: '#000',
      shadowOffset: {
         height: 2,
         width: 0
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84
   },
   buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
      textAlign: 'center'
   }
})
