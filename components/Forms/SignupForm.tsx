import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '@roninoss/icons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, ScrollView, TouchableOpacity } from 'react-native'
import * as z from 'zod'

import CheckBox from '../CheckBox'
import TextInput from '../TextInput'
import { Text } from '../nativewindui/Text'

import { DEFAULT_SCHEDULE } from '~/constants'
import { useTranslate } from '~/hooks/useTranslation'
import { useColorScheme } from '~/lib/useColorScheme'
import { useAuth } from '~/providers/AuthContext'
import { AppUser } from '~/shared/types'
import { getDeviceLanguage } from '~/utils/languague'

const signupSchema = z
   .object({
      name: z
         .string({ message: 'Full name is required' })
         .min(5, 'Full name must be at least 5 characters long')
         .refine(
            (value) => {
               const parts = value.trim().split(' ')
               return (
                  parts.length >= 2 && parts.every((part) => part.length > 1)
               )
            },
            {
               message:
                  'Full name must include at least a first name and a last name, each at least 2 characters long'
            }
         ),
      email: z.string().email(),
      phone: z.string().min(14, 'Invalid phone').optional(),
      password: z
         .string()
         .min(6, 'Password must be at least 6 characters long'),
      confirmPassword: z
         .string()
         .min(6, 'Confirm Password must be at least 6 characters long'),
      isBarber: z.boolean().optional()
      //   acceptTerms: z.boolean().refine((val) => val === true, {
      //      message: 'You must accept the terms and conditions',
      //   }),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'] // Specify the field for the error message
   })

type SignupFormData = z.infer<typeof signupSchema>
type SignupFormProps = {
   isBarber?: boolean
}
const SignupForm: React.FC<SignupFormProps> = ({ isBarber }) => {
   const { signUp, createUser } = useAuth()
   const translate = useTranslate()
   const { isDarkColorScheme, colors } = useColorScheme()
   const [show, setShow] = useState(false)
   const params = useLocalSearchParams()

   const { control, handleSubmit } = useForm<SignupFormData>({
      defaultValues: {
         isBarber
      },
      resolver: zodResolver(signupSchema)
   })

   const onSubmit = async (data: SignupFormData) => {
      try {
         const { user } = await signUp(
            data.email,
            data.password,
            data.isBarber || false
         )
         const lng = getDeviceLanguage() || 'en'
         if (user) {
            let newUser: AppUser
            if (data.isBarber) {
               newUser = {
                  id: user.uid,
                  email: data.email,
                  phone: data.phone || '',
                  name: data.name || '',
                  isBarber: true,
                  isActive: true,
                  pushToken: null,
                  provider: 'email',
                  gallery: [],
                  minutesInterval: 15,
                  isAvailable: true,
                  languague: lng,
                  bio: '',
                  image: null,
                  subscriptionStatus: 'trialing',
                  schedule: DEFAULT_SCHEDULE,
                  profileCompleted: false,
                  profile: null,
                  createdAt: new Date().toISOString()
               }
            } else {
               newUser = {
                  id: user.uid,
                  email: data.email,
                  phone: data.phone || '',
                  image: null,
                  provider: 'email',
                  languague: lng,
                  pushToken: null,
                  name: data.name || '',
                  isBarber: false,
                  favoriteBarber: null,
                  createdAt: new Date().toISOString()
               }
            }

            const userSaved = await createUser(newUser)
            if (userSaved) {
               if (user) {
                  if (params && params.returnUrl) {
                     router.canDismiss() && router.dismiss()
                     router.replace(params.returnUrl as any)
                  }
               }
            } else {
               console.log('Error creating user')
            }
         }
      } catch (error) {
         console.log(error)
      }
   }

   return (
      <ScrollView
         showsVerticalScrollIndicator={false}
         keyboardShouldPersistTaps="handled"
      >
         <TextInput
            name="name"
            autoFocus
            control={control}
            label={translate('signup.name')}
            placeholder="John Smith"
            autoCapitalize="words"
         />
         <TextInput
            name="phone"
            control={control}
            label={
               <Text className="font-roboto-bold">
                  {translate('signup.phone')}{' '}
                  <Text className="text-sm text-muted">(optional)</Text>
               </Text>
            }
            keyboardType="numeric"
            placeholder="(646) 588-8888"
         />
         <TextInput
            name="email"
            control={control}
            label={translate('signup.email')}
            keyboardType="email-address"
            placeholder="john.smith@email.com"
         />

         <TextInput
            name="password"
            control={control}
            textContentType="oneTimeCode"
            label={translate('signup.password')}
            placeholder={translate('signup.placeholder.password')}
            secureTextEntry={!show}
            RightIcon={
               <TouchableOpacity onPress={() => setShow((p) => !p)}>
                  <Icon
                     name={show ? 'eye' : 'eye-off'}
                     size={20}
                     color={isDarkColorScheme ? '#ffffff' : colors.grey}
                  />
               </TouchableOpacity>
            }
         />
         <TextInput
            name="confirmPassword"
            control={control}
            textContentType="oneTimeCode"
            label={translate('signup.confirmPassword')}
            placeholder={translate('signup.placeholder.confirmPassword')}
            secureTextEntry={!show}
            RightIcon={
               <TouchableOpacity onPress={() => setShow((p) => !p)}>
                  <Icon
                     name={show ? 'eye' : 'eye-off'}
                     size={20}
                     color={isDarkColorScheme ? '#ffffff' : colors.grey}
                  />
               </TouchableOpacity>
            }
         />
         <CheckBox
            name="isBarber"
            control={control}
            label={translate('signup.toggle')}
         />
         {/* <CheckBox name="acceptTerms" control={control} label="I accept the terms and conditions" /> */}
         <Button
            title={translate('signup.button')}
            onPress={handleSubmit(onSubmit)}
         />
      </ScrollView>
   )
}

export default SignupForm
