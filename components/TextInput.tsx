import React from 'react'
import { Controller } from 'react-hook-form'
import {
   TextInput as RNTextInput,
   StyleSheet,
   TextInputProps,
   View,
   ViewStyle
} from 'react-native'

import { Text } from '~/components/nativewindui/Text'
import { useColorScheme } from '~/lib/useColorScheme'
import { formatPhone } from '~/utils/formatPhone'

type TextInputParams = TextInputProps & {
   name: string
   control: any
   label?: string | React.ReactNode
   placeholder?: string
   secureTextEntry?: boolean
   capitalize?: boolean
   rules?: any
   containerStyle?: ViewStyle
   RightIcon?: React.ReactNode
   inputStyle?: ViewStyle
}

const TextInput: React.FC<TextInputParams> = ({
   name,
   control,
   label,
   placeholder,
   secureTextEntry,
   containerStyle,
   rules,
   RightIcon,
   inputStyle,
   ...others
}) => {
   const { isDarkColorScheme } = useColorScheme()
   return (
      <View style={[styles.container, containerStyle]}>
         {label && <Text style={styles.label}>{label}</Text>}
         <Controller
            control={control}
            name={name}
            rules={rules}
            render={({
               field: { onChange, onBlur, value },
               fieldState: { error, invalid, isDirty, isTouched }
            }) => (
               <View className="">
                  <>
                     <RNTextInput
                        style={[
                           styles.input,
                           {
                              color: isDarkColorScheme ? '#ffffff' : '#212121'
                           },
                           error && styles.errorInput,
                           !invalid && isDirty && isTouched && styles.valid,
                           inputStyle
                        ]}
                        onBlur={onBlur}
                        onChangeText={
                           name === 'email'
                              ? (text) => onChange(text.toLowerCase())
                              : name === 'phone'
                                ? (text) => onChange(formatPhone(text))
                                : name === 'state'
                                  ? (text) => onChange(text.toUpperCase())
                                  : onChange
                        }
                        value={value}
                        placeholderTextColor="grey"
                        placeholder={placeholder}
                        secureTextEntry={secureTextEntry}
                        {...others}
                     />
                     {error && (
                        <Text style={styles.errorText}>{error.message}</Text>
                     )}
                  </>
                  {RightIcon && (
                     <View className="z-20 absolute right-2  top-3">
                        {RightIcon}
                     </View>
                  )}
               </View>
            )}
         />
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      marginBottom: 12
   },
   label: {
      marginBottom: 5,
      fontSize: 16,
      fontFamily: 'Raleway-Bold'
   },
   input: {
      minHeight: 50,
      borderColor: '#ccc',
      fontSize: 16,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 10,
      width: '100%'
   },
   valid: {
      borderColor: 'green'
   },
   errorInput: {
      borderColor: 'red'
   },
   errorText: {
      color: 'red',
      marginTop: 5
   }
})

export default TextInput
