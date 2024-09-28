import { Octicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '@roninoss/icons'
import { SymbolView } from 'expo-symbols'
import { addDoc } from 'firebase/firestore'
import React from 'react'
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

   const {
      control,
      handleSubmit,
      reset,
      formState: { isLoading }
   } = useForm<MessageSchema>({
      defaultValues: {
         title: '',
         message: ''
      },
      resolver: zodResolver(messageSchema)
   })
   const onSubmit = async (data: MessageSchema) => {
      console.log(data)
      if (!user || !user.isBarber) return
      try {
         await addDoc(broadcastCollection, {
            ...data,
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
                        color={isDarkColorScheme ? '#ffffff' : colors.primary}
                     />
                  </TouchableOpacity>
                  <Text variant="title2">Message to all clients</Text>
                  <Text />
               </View>
               <View className="gap-3">
                  <TextInput
                     label="Title"
                     autoCapitalize="words"
                     control={control}
                     name="title"
                     placeholder="Title"
                  />
                  <TextInput
                     control={control}
                     label="Message"
                     name="message"
                     multiline
                     maxLength={300}
                     inputStyle={{ minHeight: 100 }}
                     placeholder="Type a message to all your clients"
                  />
               </View>
               <Button
                  isLoading={isLoading}
                  title="Send Message"
                  onPress={handleSubmit(onSubmit)}
                  disabled={isLoading}
               />
            </View>
         </Sheet>
      </View>
   )
}

export default BroadcastMessageScreen
