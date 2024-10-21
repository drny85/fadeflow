import { Feather, FontAwesome } from '@expo/vector-icons'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { FlashList } from '@shopify/flash-list'
import { endOfDay, format, isPast } from 'date-fns'
import { router, useSegments } from 'expo-router'
import { AnimatePresence, MotiView } from 'moti'
import React, { useMemo, useState } from 'react'
import { Platform, ScrollView, TouchableOpacity, View } from 'react-native'
import { Text } from '~/components/nativewindui/Text'
import SwipleableAppoimentListItem from '~/components/SwipleableAppoimentListItem'
import { SIZES } from '~/constants'
import { useNavigationSearch } from '~/hooks/useNavigationSeach'
import { useTranslate } from '~/hooks/useTranslation'
import { useColorScheme } from '~/lib/useColorScheme'
import { translation } from '~/locales/translate'
import { useAppointmentStore } from '~/providers/useAppointmentStore'
import { Appointment } from '~/shared/types'

type Sorting = 'past' | 'upcoming'
const criterias = ['upcoming', 'past'] as Array<Sorting>

const AllAppointments = () => {
   const translate = useTranslate()
   const { colors, isDarkColorScheme } = useColorScheme()
   const [sort, setSort] = useState<Sorting>('upcoming')
   const [descending, setDescending] = useState(true)
   const [showIndexes, setShowIndexes] = useState<number[]>([])
   const segment = useSegments()
   const search = useNavigationSearch({
      searchBarOptions: {
         placeholder: translation('sorting', 'name')
      }
   })

   const appointments = useAppointmentStore((s) =>
      s.appointments
         .filter((a) => (sort === 'past' ? isPast(a.date) : !isPast(a.date)))
         .sort((a, b) =>
            descending ? (a.date > b.date ? 1 : -1) : a.date < b.date ? 1 : -1
         )
   )
   const appointmentsWithDateAsKey = appointments.reduce(
      (acc, appointment) => {
         const date = endOfDay(appointment.date).toDateString()
         if (!acc[date]) {
            acc[date] = []
         }
         acc[date].push(appointment)
         return acc
      },

      {} as Record<string, Appointment[]>
   )

   const data = Object.entries(appointmentsWithDateAsKey).map(
      ([key, value]) => {
         return {
            date: key,
            appointments: value
         }
      }
   )

   const appointmentsData = useMemo(() => {
      if (!search) return data
      return data.filter((appointment) =>
         appointment.appointments.some((a) =>
            a.customer.name?.toLowerCase().includes(search.toLowerCase())
         )
      )
   }, [data, search])

   return (
      <ScrollView
         contentInsetAdjustmentBehavior="automatic"
         showsVerticalScrollIndicator={false}
         contentContainerStyle={{
            paddingTop:
               Platform.OS === 'android' && segment[2] !== 'all-appointments'
                  ? SIZES.statusBarHeight + 36
                  : undefined
         }}
      >
         <View className="flex-row items-center justify-evenly">
            <SegmentedControl
               values={[
                  translation('appointment', 'toggle', 'upcoming'),
                  translation('appointment', 'toggle', 'past')
               ]}
               fontStyle={{
                  fontSize: 16,
                  color: isDarkColorScheme ? '#ffffff' : '#000000'
               }}
               tintColor={colors.accent}
               activeFontStyle={{
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: 18
               }}
               style={{
                  backgroundColor: colors.card,
                  height: 40,
                  width: '60%',
                  alignSelf: 'center',
                  marginVertical: 10
               }}
               selectedIndex={criterias.indexOf(sort)}
               onChange={(event) => {
                  setSort(criterias[event.nativeEvent.selectedSegmentIndex])
               }}
            />
            <View className="flex-row gap-2 items-center bg-background p-2 rounded-lg">
               <TouchableOpacity
                  disabled={appointmentsData.length === 0}
                  onPress={() => {
                     setShowIndexes((prev) =>
                        prev.length === 0
                           ? Array.from(Array(appointmentsData.length).keys())
                           : []
                     )
                  }}
               >
                  <Text className="text-blue-500">
                     {showIndexes.length === 0
                        ? translation('sorting', 'show', 'all')
                        : translation('sorting', 'show', 'hide')}
                  </Text>
               </TouchableOpacity>
               <TouchableOpacity
                  disabled={appointmentsData.length === 0}
                  onPress={() => setDescending((prev) => !prev)}
               >
                  <FontAwesome
                     name={descending ? 'sort-alpha-asc' : 'sort-alpha-desc'}
                     size={24}
                     color={isDarkColorScheme ? '#ffffff' : '#212121'}
                  />
               </TouchableOpacity>
            </View>
         </View>
         <FlashList
            data={appointmentsData}
            estimatedItemSize={120}
            contentContainerStyle={{
               paddingBottom: 20,
               padding: 6
            }}
            ItemSeparatorComponent={() => (
               <View className="h-[1px] w-[85%] self-center bg-primary opacity-40" />
            )}
            ListEmptyComponent={
               <View className="flex-1 items-center justify-center mt-7 opacity-45">
                  <Text className="text-xl font-roboto-bold text-center">
                     {translation('appointment', 'no_appointment')}
                  </Text>
               </View>
            }
            renderItem={({ item, index }) => (
               <TouchableOpacity
                  className="bg-card rounded-md my-1"
                  onPress={() => {
                     setShowIndexes((prev) =>
                        prev.includes(index)
                           ? prev.filter((i) => i !== index)
                           : [...prev, index]
                     )
                  }}
               >
                  <View>
                     <View className="flex-row justify-between items-center rounded-md p-2">
                        <Text className="text-xl font-roboto-bold">
                           {translate(`days.${format(item.date, 'E')}`)},{' '}
                           {format(item.date, 'PP')}
                        </Text>

                        <Feather
                           name="chevron-right"
                           size={28}
                           color={isDarkColorScheme ? '#ffffff' : '#212121'}
                        />
                     </View>
                     <View>
                        <AnimatePresence>
                           {showIndexes.includes(index) && (
                              <MotiView>
                                 {item.appointments
                                    .sort((a, b) => (a.date > b.date ? 1 : -1))
                                    .map((appointment, i) => (
                                       <SwipleableAppoimentListItem
                                          key={i.toString() + appointment.id}
                                          item={appointment}
                                          index={i}
                                          onPress={() => {
                                             router.push({
                                                pathname:
                                                   '/barber-appointment-view',
                                                params: {
                                                   appointmentId: appointment.id
                                                }
                                             })
                                          }}
                                       />
                                    ))}
                              </MotiView>
                           )}
                        </AnimatePresence>
                     </View>
                  </View>
               </TouchableOpacity>
            )}
         />
      </ScrollView>
   )
}

export default AllAppointments
