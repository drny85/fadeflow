import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { FlashList } from '@shopify/flash-list'
import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { BarChart } from 'react-native-gifted-charts' // For bar chart
import Animated, {
   FadeIn,
   FadeOut,
   SlideInLeft,
   SlideOutLeft
} from 'react-native-reanimated'
import { useTranslate } from '~/hooks/useTranslation'
import { useColorScheme } from '~/lib/useColorScheme'
import { translation } from '~/locales/translate'
import { Text } from '../nativewindui/Text'

type AppointmentStatus =
   | 'pending'
   | 'confirmed'
   | 'cancelled'
   | 'completed'
   | 'no-show'
type Criteria = 'date' | 'amount' | 'status' | 'customer'
const criterias = ['date', 'amount', 'status', 'customer'] as Array<Criteria>

interface Customer {
   id: string
   name: string
}

export interface AppointmentToAnalyzeProps {
   id: string
   date: string
   amount: number
   status: AppointmentStatus
   customer: Customer
}

type Props = {
   appointments: AppointmentToAnalyzeProps[]
}

const AppointmentAnalysis: React.FC<Props> = ({ appointments }) => {
   const translate = useTranslate()
   const { colors, isDarkColorScheme } = useColorScheme()
   const [sortCriteria, setSortCriteria] = useState<Criteria>('date')
   const [showChart, setShowChart] = useState<'status' | 'customer' | null>(
      null
   )

   const sortAppointments = () => {
      switch (sortCriteria) {
         case 'date':
            return [...appointments].sort(
               (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
         case 'amount':
            return [...appointments].sort((a, b) => b.amount - a.amount)
         case 'status':
            return [...appointments].sort((a, b) =>
               a.status.localeCompare(b.status)
            )
         case 'customer':
            return [...appointments].sort((a, b) =>
               a.customer.name.localeCompare(b.customer.name)
            )
         default:
            return appointments
      }
   }

   const appointmentData = sortAppointments()
   // Bar data for customer spend analysis
   const customerBarData = appointments
      .reduce(
         (acc, appointment) => {
            const customer = acc.find(
               (item) => item.customer === appointment.customer.name
            )
            if (customer) {
               customer.amount += appointment.amount
            } else {
               acc.push({
                  customer: appointment.customer.name,
                  amount: appointment.amount
               })
            }
            return acc
         },
         [] as { customer: string; amount: number }[]
      )
      .map((item) => ({
         value: item.amount,
         label: item.customer,
         frontColor: `#${Math.floor(Math.random() * 16777215).toString(16)}` // Generate random colors for each customer
      }))

   useEffect(() => {
      if (sortCriteria === 'customer') {
         setShowChart('customer') // Trigger re-render to show the chart
      } else {
         setShowChart(null) // Hide the chart
      }
   }, [sortCriteria])

   return (
      <View style={{ flex: 1, padding: 10 }}>
         <SegmentedControl
            values={[
               translation('sorting', 'date'),
               translation('sorting', 'amount'),
               translation('sorting', 'status'),
               translation('sorting', 'customer')
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
               width: '96%',
               alignSelf: 'center',
               marginBottom: 10
            }}
            selectedIndex={criterias.indexOf(sortCriteria)}
            onChange={(event) => {
               setSortCriteria(
                  criterias[event.nativeEvent.selectedSegmentIndex]
               )
            }}
         />

         <FlashList
            data={appointmentData}
            ListHeaderComponent={
               showChart === 'customer' ? (
                  <Animated.View
                     entering={SlideInLeft}
                     exiting={SlideOutLeft}
                     style={{ marginVertical: 10 }}
                  >
                     <BarChart
                        data={customerBarData}
                        barWidth={30}
                        spacing={15}
                        yAxisLabelPrefix="$"
                        roundedTop
                        xAxisColor={isDarkColorScheme ? '#ffffff' : '#212121'}
                        yAxisColor={isDarkColorScheme ? '#ffffff' : '#212121'}
                        hideRules
                        xAxisLabelTextStyle={{
                           fontSize: 12,
                           color: isDarkColorScheme ? '#ffffff' : '#212121'
                        }}
                        yAxisTextStyle={{
                           fontSize: 12,
                           color: isDarkColorScheme ? '#ffffff' : '#212121'
                        }}
                     />
                  </Animated.View>
               ) : undefined
            }
            keyExtractor={(item) => item.id}
            estimatedItemSize={120}
            contentContainerStyle={{
               paddingBottom: 20
            }}
            ItemSeparatorComponent={() => (
               <View className="h-[1px] w-[85%] self-center bg-primary" />
            )}
            renderItem={({ item }) => (
               <Animated.View
                  entering={FadeIn.duration(600)}
                  exiting={FadeOut}
                  style={{
                     padding: 10,
                     backgroundColor: colors.card,
                     marginVertical: 4,
                     borderRadius: 6
                  }}
               >
                  <Text>
                     {translation('sorting', 'date')}:{' '}
                     {format(item.date, 'PPpp')}
                  </Text>
                  <Text>
                     {translation('sorting', 'amount')}: ${item.amount}
                  </Text>
                  <Text className="capitalize">
                     {translation('sorting', 'status')}:{' '}
                     {translate(
                        `appointment.filter.${item.status.charAt(0).toUpperCase() + item.status.slice(1)}`
                     )}
                  </Text>
                  <Text>
                     {translation('sorting', 'customer')}: {item.customer.name}
                  </Text>
               </Animated.View>
            )}
         />

         {/* {showChart === 'customer' && (
            <Animated.View
               entering={SlideInDown}
               exiting={SlideOutDown}
               style={{ marginVertical: 10 }}
            >
              
            </Animated.View>
         )} */}
      </View>
   )
}

export default AppointmentAnalysis
