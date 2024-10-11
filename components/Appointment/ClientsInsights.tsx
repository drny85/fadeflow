import React, { useState } from 'react'
import { View, FlatList, TouchableOpacity } from 'react-native'
import { differenceInDays, parseISO } from 'date-fns'
import { BarChart } from 'react-native-gifted-charts' // Import BarChart
import { SIZES } from '~/constants'
import { Text } from '../nativewindui/Text'
import { Feather } from '@expo/vector-icons'
import { useColorScheme } from '~/lib/useColorScheme'
import { router } from 'expo-router'

type Appointment = {
   id: string
   date: string
   customer: {
      id: string
      name: string
   }
}

interface Props {
   appointments: Appointment[]
}

interface CustomerInsight {
   customer: string
   frequency: string
   daysSinceLast: number
   contactSuggestion: string
}

const calculateFrequency = (dates: string[]): string => {
   if (dates.length < 2) return 'Unknown' // Not enough data to calculate

   const intervals = []
   for (let i = 1; i < dates.length; i++) {
      const daysBetween = differenceInDays(
         parseISO(dates[i]),
         parseISO(dates[i - 1])
      )
      intervals.push(daysBetween)
   }

   const averageInterval =
      intervals.reduce((acc, curr) => acc + curr, 0) / intervals.length

   if (averageInterval <= 7) return 'Weekly'
   if (averageInterval <= 14) return 'Every 2 Weeks'
   if (averageInterval <= 30) return 'Monthly'
   return 'Occasionally'
}

const shouldContactCustomer = (
   daysSinceLastAppointment: number,
   frequency: string
): string => {
   switch (frequency) {
      case 'Weekly':
         return daysSinceLastAppointment > 7
            ? 'Should Contact'
            : 'No Need to Contact'
      case 'Every 2 Weeks':
         return daysSinceLastAppointment > 14
            ? 'Should Contact'
            : 'No Need to Contact'
      case 'Monthly':
         return daysSinceLastAppointment > 30
            ? 'Should Contact'
            : 'No Need to Contact'
      case 'Occasionally':
         return daysSinceLastAppointment > 60
            ? 'Should Contact'
            : 'No Need to Contact'
      default:
         return 'Unknown Frequency'
   }
}

const getCustomerInsights = (
   appointments: Appointment[]
): CustomerInsight[] => {
   const customerAppointments = appointments.reduce(
      (acc, appointment) => {
         const { customer, date } = appointment
         if (!acc[customer.id]) {
            acc[customer.id] = {
               customerName: customer.name,
               dates: []
            }
         }
         acc[customer.id].dates.push(date)
         return acc
      },
      {} as Record<string, { customerName: string; dates: string[] }>
   )

   return Object.keys(customerAppointments).map((customerId) => {
      const { customerName, dates } = customerAppointments[customerId]
      dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime()) // Sort by date
      const lastAppointment = dates[dates.length - 1]
      const frequency = calculateFrequency(dates)
      const daysSinceLast = differenceInDays(
         new Date(),
         parseISO(lastAppointment)
      )
      const contactSuggestion = shouldContactCustomer(daysSinceLast, frequency)

      return {
         customer: customerName,
         frequency,
         daysSinceLast,
         contactSuggestion
      }
   })
}

const PAGE_SIZE = 5 // Number of customers to show per page

const CustomerInsights: React.FC<Props> = ({ appointments }) => {
   const { colors, isDarkColorScheme } = useColorScheme()
   const [currentPage, setCurrentPage] = useState(0) // Track the current page
   const insights = getCustomerInsights(appointments)

   // Paginated insights
   const paginatedInsights = insights.slice(
      currentPage * PAGE_SIZE,
      (currentPage + 1) * PAGE_SIZE
   )

   // Prepare data for booking frequency chart
   const frequencyChartData = paginatedInsights.map((item) => ({
      value:
         item.frequency === 'Weekly'
            ? 1
            : item.frequency === 'Every 2 Weeks'
              ? 2
              : item.frequency === 'Monthly'
                ? 3
                : 4,
      label: item.customer,
      frontColor:
         item.contactSuggestion === 'Should Contact' ? '#FF6B6B' : '#4ECDC4' // Red for 'Should Contact', Green for 'No Need'
   }))

   const handleNextPage = () => {
      if ((currentPage + 1) * PAGE_SIZE < insights.length) {
         setCurrentPage(currentPage + 1)
      }
   }

   const handlePreviousPage = () => {
      if (currentPage > 0) {
         setCurrentPage(currentPage - 1)
      }
   }

   return (
      <View style={{ flex: 1, padding: 16 }}>
         <View className="flex-row items-center mb-3 gap-4">
            <TouchableOpacity className="p-2" onPress={router.back}>
               <Feather
                  name="chevron-left"
                  size={28}
                  color={isDarkColorScheme ? '#ffffff' : colors.primary}
               />
            </TouchableOpacity>
            <Text className="text-2xl font-roboto-bold">
               Customer Booking Frequency
            </Text>
         </View>
         <BarChart
            data={frequencyChartData}
            barWidth={30}
            spacing={15}
            roundedTop
            hideRules
            width={SIZES.width * 0.7}
            xAxisLabelTextStyle={{ fontSize: 12, color: 'black' }}
            yAxisTextStyle={{ fontSize: 12, color: 'black' }}
            yAxisLabelWidth={SIZES.width * 0.18}
            xAxisTextNumberOfLines={2}
            xAxisLength={SIZES.width * 0.7}
            maxValue={4}
            stepValue={1}
            yAxisLabelTexts={['', 'Weekly', '2 Weeks', 'Monthly', 'Occasional']}
         />
         <View className="flex-row justify-between items-center mt-2">
            <TouchableOpacity
               onPress={handlePreviousPage}
               disabled={currentPage === 0}
            >
               <Text
                  style={{
                     fontSize: 18,
                     color: currentPage === 0 ? 'gray' : 'blue'
                  }}
               >
                  {'< Previous'}
               </Text>
            </TouchableOpacity>
            <Text className="mb-3 text-2xl font-roboto-bold">
               Customer Overview
            </Text>
            <TouchableOpacity
               onPress={handleNextPage}
               disabled={(currentPage + 1) * PAGE_SIZE >= insights.length}
            >
               <Text
                  style={{
                     fontSize: 18,
                     color:
                        (currentPage + 1) * PAGE_SIZE >= insights.length
                           ? 'gray'
                           : 'blue'
                  }}
               >
                  {'Next >'}
               </Text>
            </TouchableOpacity>
         </View>

         <FlatList
            data={paginatedInsights}
            keyExtractor={(item) => item.customer}
            renderItem={({ item }) => (
               <View className="bg-card my-1 rounded-md p-2">
                  <Text variant={'heading'}>{item.customer}</Text>
                  <Text>Last Appointment: {item.daysSinceLast} days ago</Text>
                  <Text>Suggestion: {item.contactSuggestion}</Text>
               </View>
            )}
         />
      </View>
   )
}

export default CustomerInsights
