import { Icon } from '@roninoss/icons'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

import AnimatedNumber from '~/components/AnimatedNumber'
import CommunicationButtons from '~/components/CommunicationButtons'
import SwipleableAppoimentListItem from '~/components/SwipleableAppoimentListItem'
import { Sheet, useSheetRef } from '~/components/nativewindui/Sheet'
import { Text } from '~/components/nativewindui/Text'
import { SIZES } from '~/constants'
import { useNavigationSearch } from '~/hooks/useNavigationSeach'
import { useColorScheme } from '~/lib/useColorScheme'
import { translation } from '~/locales/translate'
import { useAppointmentStore } from '~/providers/useAppointmentStore'
import { Appointment } from '~/shared/types'
import { getAppointmentPrice } from '~/utils/getAppointmentPrice'
import { groupAppointmentsByCustomer } from '~/utils/groupAppointmentsByCustomer'

const Clients = () => {
   const { colors, isDarkColorScheme } = useColorScheme()
   const bottomSheetRef = useSheetRef()
   const [customersAppointments, setCustomersAppointments] = useState<
      Appointment[]
   >([])
   const search = useNavigationSearch({
      searchBarOptions: {
         placeholder: translation('booking', 'search_clients')
      }
   })

   const [selectedCustomerId, setSelectedCustomerId] = useState<string>('')

   const { appointments } = useAppointmentStore()

   const customers = groupAppointmentsByCustomer(appointments)
   const data = useMemo(() => {
      if (!search) return customers
      return customers.filter((customer) =>
         customer.name.toLowerCase().includes(search.toLowerCase())
      )
   }, [customers])

   const totalSpentByCustomer = (appointments: Appointment[]) =>
      appointments
         .filter((a) => a.customer.id === selectedCustomerId)
         .reduce((acc, curr) => acc + getAppointmentPrice(curr.services), 0)

   return (
      <ScrollView
         contentInsetAdjustmentBehavior="automatic"
         showsVerticalScrollIndicator={false}
      >
         <FlashList
            data={data}
            estimatedItemSize={20}
            contentContainerClassName="p-2"
            ListEmptyComponent={
               <View>
                  <Text className="text-center text-lg text-muted dark:text-slate-400">
                     No {translation('booking', 'clients')}
                  </Text>
               </View>
            }
            ItemSeparatorComponent={() => (
               <View
                  style={{
                     height: StyleSheet.hairlineWidth,
                     backgroundColor: colors.primary,
                     alignSelf: 'center',
                     width: '90%'
                  }}
               />
            )}
            renderItem={({ item }) => {
               return (
                  <TouchableOpacity
                     className="p-2 flex-row justify-between"
                     onPress={() => {
                        setCustomersAppointments(item.appointments)
                        setSelectedCustomerId(item.id!)
                        bottomSheetRef.current?.present()
                     }}
                  >
                     <View className="flex-row gap-2 items-center">
                        <Image
                           source={
                              item.image
                                 ? { uri: item.image }
                                 : require('~/assets/images/banner.png')
                           }
                           style={{
                              height: 60,
                              width: 60,
                              borderRadius: 30,
                              objectFit: 'cover'
                           }}
                        />
                        <Text className="text-lg font-roboto-bold">
                           {item.name}
                        </Text>
                     </View>
                     <View className="flex-row w-1/3 items-center">
                        <CommunicationButtons phone={item.phone} />
                        <Icon
                           name="chevron-right"
                           size={28}
                           color={isDarkColorScheme ? '#fff' : colors.primary}
                        />
                     </View>
                  </TouchableOpacity>
               )
            }}
         />
         <Sheet
            snapPoints={['100%']}
            topInset={SIZES.statusBarHeight}
            ref={bottomSheetRef}
         >
            <View className="flex-1 p-3 gap-3">
               <View className="flex-row justify-between items-center">
                  <TouchableOpacity
                     onPress={() => bottomSheetRef.current?.close()}
                  >
                     <Icon
                        name="chevron-left"
                        size={32}
                        color={isDarkColorScheme ? '#ffffff' : colors.primary}
                     />
                  </TouchableOpacity>
                  <Text variant="title2">
                     {translation('tabs', 'appointments')}
                  </Text>
                  <Text className="mr-3" />
               </View>
               <FlashList
                  data={customersAppointments}
                  ListHeaderComponent={
                     <View className="flex-row justify-between items-center my-3 border-b-[1px] border-b-primary">
                        <View className="flex-row gap-2">
                           <Text className="text-lg font-roboto-bold text-muted dark:text-slate-400">
                              {translation('tabs', 'appointments')}
                           </Text>
                           <Text className="text-lg font-roboto-bold text-muted dark:text-slate-400">
                              {customersAppointments.length}
                           </Text>
                        </View>
                        <View className="flex-row gap-2">
                           <Text className="text-lg font-roboto-bold text-muted dark:text-slate-400">
                              Total
                           </Text>

                           <AnimatedNumber
                              textStyle={{
                                 color: isDarkColorScheme ? '#ffffff' : 'dedede'
                              }}
                              value={totalSpentByCustomer(appointments)}
                           />
                        </View>
                     </View>
                  }
                  estimatedItemSize={110}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item, index }) => {
                     return (
                        <SwipleableAppoimentListItem
                           index={index}
                           item={item}
                           showDate
                           disabled
                           onPress={() => {}}
                        />
                     )
                  }}
               />
            </View>
         </Sheet>
      </ScrollView>
   )
}

export default Clients
