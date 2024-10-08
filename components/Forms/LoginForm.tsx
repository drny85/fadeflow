import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '@roninoss/icons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, TouchableOpacity, View } from 'react-native'
import * as z from 'zod'

import { Button } from '../Button'
import TextInput from '../TextInput'
import ForgotPassword from './ForgotPassword'
import { Sheet, useSheetRef } from '../nativewindui/Sheet'
import { Text } from '../nativewindui/Text'

import { useColorScheme } from '~/lib/useColorScheme'
import { useAuth } from '~/providers/AuthContext'
import { FIREBASE_ERRORS } from '~/utils/firebaseErrorMessages'
import { useTranslate } from '~/hooks/useTranslation'

const loginSchema = z.object({
   email: z.string().email(),
   password: z.string().min(6, 'Password must be at least 6 characters long')
})

type LoginFormData = z.infer<typeof loginSchema>

const LoginForm: React.FC = () => {
   const translate = useTranslate()
   const bottomSheetRef = useSheetRef()
   const { isDarkColorScheme, colors } = useColorScheme()
   const [showPassword, setShowPassword] = useState(false)
   const [showForgotPassword, setShowForgotPassword] = useState(false)
   const { control, handleSubmit } = useForm<LoginFormData>({
      resolver: zodResolver(loginSchema)
   })
   const { signIn } = useAuth()
   const params = useLocalSearchParams()

   const onSubmit = async (data: LoginFormData) => {
      try {
         const { user } = await signIn(data.email, data.password)
         if (user) {
            if (params && params.returnUrl) {
               router.canDismiss() && router.dismiss()
               router.replace(params.returnUrl as any)
            }
         }
      } catch (error) {
         console.log(error)
         const err = error as Error
         Alert.alert(FIREBASE_ERRORS[err.message])
      }
   }
   if (showForgotPassword)
      return (
         <ForgotPassword
            onPress={() => {
               setShowForgotPassword(false)
            }}
         />
      )
   return (
      <View>
         <TextInput
            name="email"
            control={control}
            label={translate('signup.email')}
            keyboardType="email-address"
            autoComplete="off"
            placeholder="john.smith@email.com"
         />
         <View>
            <TextInput
               name="password"
               control={control}
               label={translate('signup.password')}
               textContentType="oneTimeCode"
               placeholder={translate('signup.placeholder.password')}
               secureTextEntry={!showPassword}
               RightIcon={
                  <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
                     <Icon
                        name={showPassword ? 'eye' : 'eye-off'}
                        size={20}
                        color={isDarkColorScheme ? '#ffffff' : colors.grey}
                     />
                  </TouchableOpacity>
               }
            />
         </View>
         <Button
            title={translate('login.button')}
            onPress={handleSubmit(onSubmit)}
         />
         <TouchableOpacity
            className="mt-8"
            onPress={() => {
               setShowForgotPassword(true)
            }}
         >
            <Text className="text-center text-muted dark:text-slate-300">
               {translate('signup.forgot')}
            </Text>
         </TouchableOpacity>
         {/* <Sheet snapPoints={['90%']} ref={forgotPasswordRef}>
            <ForgotPassword />
         </Sheet> */}

         <Sheet snapPoints={['80%']} ref={bottomSheetRef}>
            <ForgotPassword onPress={() => bottomSheetRef.current?.close()} />
         </Sheet>
      </View>
   )
}

export default LoginForm
