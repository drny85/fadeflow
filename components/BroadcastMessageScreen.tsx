import { Octicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '@roninoss/icons'
import { SymbolView } from 'expo-symbols'
import { addDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Platform, TouchableOpacity, View } from 'react-native'
import { z } from 'zod'

import { Button } from './Button'
import TextInput from './TextInput'
import { Sheet, useSheetRef } from './nativewindui/Sheet'

import { Text } from '~/components/nativewindui/Text'
import { SIZES } from '~/constants'
import { broadcastCollection } from '~/firebase-collections'
import { toastMessage } from '~/lib/toast'
import { useColorScheme } from '~/lib/useColorScheme'
import { translation } from '~/locales/translate'
import { useAuth } from '~/providers/AuthContext'
import { useAppointmentStore } from '~/providers/useAppointmentStore'
import { groupAppointmentsByCustomer } from '~/utils/groupAppointmentsByCustomer'

const messageSchema = z.object({
   title: z.string().min(3, 'Title is required'),
   message: z
      .string()
      .min(3, 'Message is required')
      .max(300, 'Message is too long')
})
type MessageSchema = z.infer<typeof messageSchema>
const BroadcastMessageScreen = () => {
   const { user } = useAuth()
   const bottomSheetRef = useSheetRef()
   const { colors, isDarkColorScheme } = useColorScheme()
   const { appointments } = useAppointmentStore()
   const customers = groupAppointmentsByCustomer(appointments)
   const [verify, setVerify] = useState(false)

   const {
      control,
      handleSubmit,
      reset,
      getValues,
      formState: { isLoading }
   } = useForm<MessageSchema>({
      defaultValues: {
         title: '',
         message: ''
      },
      resolver: zodResolver(messageSchema)
   })
   const onSubmit = async (data: MessageSchema) => {
      if (!user || !user.isBarber) return
      try {
         if (!verify) {
            setVerify(true)
            return
         }
         await addDoc(broadcastCollection, {
            ...data,
            from: user.name,
            userId: user.id,
            barberId: user.id,
            users: customers.map((customer) => customer.id),
            createdAt: new Date().toISOString()
         })
         toastMessage({
            title: 'Success',
            message: 'Message sent successfully',
            duration: 3
         })
         bottomSheetRef.current?.close()
         setVerify(false)
         reset()
      } catch (error) {
         console.log(error)
      }
   }
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
            {!verify && (
               <View className="flex-1">
                  <View className="flex-1 p-3 gap-3">
                     <View className="flex-row justify-between items-center mb-2">
                        <TouchableOpacity
                           onPress={() => {
                              bottomSheetRef.current?.close()
                              reset()
                           }}
                        >
                           <Icon
                              name="chevron-left"
                              size={32}
                              color={
                                 isDarkColorScheme ? '#ffffff' : colors.primary
                              }
                           />
                        </TouchableOpacity>
                        <Text variant="title2">
                           {translation('appointment', 'broadcast', 'heading')}
                        </Text>
                        <Text />
                     </View>
                     <View className="gap-3">
                        <TextInput
                           label={translation(
                              'appointment',
                              'broadcast',
                              'title'
                           )}
                           autoCapitalize="words"
                           control={control}
                           name="title"
                           placeholder={translation(
                              'appointment',
                              'broadcast',
                              'title'
                           )}
                        />
                        <TextInput
                           control={control}
                           label={translation(
                              'appointment',
                              'broadcast',
                              'message'
                           )}
                           name="message"
                           multiline
                           maxLength={300}
                           inputStyle={{ minHeight: 100 }}
                           placeholder={translation(
                              'appointment',
                              'broadcast',
                              'placeholder'
                           )}
                        />
                     </View>
                     <Button
                        isLoading={isLoading}
                        title={translation(
                           'appointment',
                           'broadcast',
                           'button'
                        )}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isLoading}
                     />
                  </View>
               </View>
            )}
            {verify && (
               <View className="flex-1">
                  <View className="flex-row mx-2 gap-4">
                     <TouchableOpacity onPress={() => setVerify(false)}>
                        <Icon
                           name="chevron-left"
                           size={28}
                           color={
                              !isDarkColorScheme ? colors.primary : '#ffffff'
                           }
                        />
                     </TouchableOpacity>
                     <Text variant="title2">
                        {translation('appointment', 'broadcast', 'verify')}
                     </Text>
                  </View>
                  <View className="flex-1 justify-center gap-2 p-2">
                     <View className="bg-card shadow-sm p-4 rounded-md mb-3">
                        <Text variant={'heading'}>{getValues().title}</Text>
                        <Text variant={'callout'}>{getValues().message}</Text>
                     </View>
                     <Button
                        onPress={handleSubmit(onSubmit)}
                        disabled={isLoading}
                        title={translation(
                           'appointment',
                           'broadcast',
                           'button'
                        )}
                     />
                  </View>
               </View>
            )}
         </Sheet>
      </View>
   )
}

export default BroadcastMessageScreen
