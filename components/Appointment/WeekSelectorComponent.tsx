import { Feather } from '@expo/vector-icons' // For chevrons, install via expo install @expo/vector-icons
import { format, isSameDay } from 'date-fns'
import React, { useEffect, useState } from 'react'
import {
   Dimensions,
   ScrollView,
   StyleSheet,
   TouchableOpacity,
   View
} from 'react-native'
import Animated, { SlideInRight } from 'react-native-reanimated'

import { Text } from '../nativewindui/Text'

import { useTranslate } from '~/hooks/useTranslation'
import { useColorScheme } from '~/lib/useColorScheme'
import { translation } from '~/locales/translate'
import { useAuth } from '~/providers/AuthContext'
import { useAppointmentStore } from '~/providers/useAppointmentStore'
import { useAppointmentFlowStore } from '~/providers/useAppoitmentFlowStore'
import { BlockTimeParams, Days, Schedule } from '~/shared/types'

type DayProps = {
   date: Date
   isPast: boolean
   isOff: boolean
   isSelected: boolean
   onPress: (day: Date) => void
   hasAppointments?: boolean
   ignorePast?: boolean
}

const Day: React.FC<DayProps> = ({
   date,
   isPast,
   isSelected,
   isOff,
   onPress,
   hasAppointments,
   ignorePast = false
}) => {
   const { setSelectedTimeSlot, setIndex } = useAppointmentFlowStore()
   const { user } = useAuth()

   return (
      <TouchableOpacity
         disabled={(isPast || isOff) && !ignorePast}
         onPress={() => {
            onPress(date)
            setSelectedTimeSlot(null)
            setIndex(0)
         }}
         className={`my-1 items-center rounded-lg ${isSelected ? 'bg-primary' : isOff && !user?.isBarber ? 'bg-grey border-2 border-dashed border-slate-400' : isOff && user?.isBarber && ignorePast ? 'border-2 border-gray border-double' : 'bg-card'}`}
      >
         <Animated.View
            entering={SlideInRight}
            key={date.toISOString()}
            style={[styles.dayContainer]}
         >
            <Text
               className={`${isSelected ? 'font-raleway-bold text-white' : 'font-raleway'} ${isPast ? 'opacity-35' : ''} `}
            >
               {translation('days', format(date, 'E') as Days).slice(0, 3)}
            </Text>
            <Text
               className={`${isSelected ? 'font-semibold text-white' : ''} ${isPast || isOff ? 'opacity-35' : ''} `}
            >
               {/* {format(date, 'dd')} */}
               {isOff ? 'Off' : format(date, 'dd')}
            </Text>
         </Animated.View>
         {hasAppointments && user?.isBarber && (
            <View className="mb-1 h-2 w-2 items-center justify-center rounded-full bg-accent" />
         )}
      </TouchableOpacity>
   )
}

type Props = {
   schedule: Schedule
   onPress?: (date: Date) => void
   ignorePast?: boolean
   onChange?: () => void
   blockedDays?: BlockTimeParams[]
}

const WeekSelector: React.FC<Props> = ({
   schedule,
   onPress,
   ignorePast = false,
   onChange,
   blockedDays = []
}) => {
   const translate = useTranslate()
   const today = new Date()
   const { colors } = useColorScheme()
   const [currentDate, setCurrentDate] = useState<Date>(new Date())
   const [weekDates, setWeekDates] = useState<Date[]>([])
   const { selectedDate, setSelectedDate, setSelectedTimeSlot } =
      useAppointmentFlowStore()
   const { appointments } = useAppointmentStore()

   const handleTitlePress = () => {
      setCurrentDate(new Date())
   }

   const getWeekDates = (date: Date): Date[] => {
      const startOfWeek = new Date(date)
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()) // Set to the start of the week (Sunday)
      return Array.from({ length: 7 }, (_, i) => {
         const day = new Date(startOfWeek)
         day.setDate(startOfWeek.getDate() + i)
         return day
      })
   }

   const getMonthName = (date: Date): string => format(date, 'MMMM yyyy')

   const handleNextWeek = () => {
      const nextWeek = new Date(currentDate)
      nextWeek.setDate(currentDate.getDate() + 7)
      setCurrentDate(nextWeek)
      setSelectedTimeSlot(null)
      onChange && onChange()
   }

   const findAnyAppointmentByDate = (date: Date): boolean => {
      return appointments.some(
         (appointment) =>
            isSameDay(appointment.date, date) &&
            appointment.status !== 'completed' &&
            appointment.status !== 'cancelled'
      )
   }

   // const handlePreviousWeek = () => {
   //   const prevWeek = new Date(currentDate);
   //   prevWeek.setDate(currentDate.getDate() - 7);

   //   // Check if any day in the previous week is not in the past
   //   const isAnyDayInFuture = getWeekDates(prevWeek).some((date) => date >= new Date());

   //   if (isAnyDayInFuture) {
   //     setCurrentDate(prevWeek);
   //   }
   // };
   const handlePreviousWeek = () => {
      setSelectedTimeSlot(null)
      const prevWeek = new Date(currentDate)
      prevWeek.setDate(currentDate.getDate() - 7)
      onChange && onChange()

      // Check if any day in the previous week is not in the past
      const isAnyDayInFuture = getWeekDates(prevWeek).some((date) => {
         const today = new Date()
         today.setHours(0, 0, 0, 0) // Set time to 00:00:00 for comparison
         const checkDate = new Date(date)
         checkDate.setHours(0, 0, 0, 0) // Set time to 00:00:00 for comparison
         return checkDate >= today
      })

      if (isAnyDayInFuture) {
         setCurrentDate(prevWeek)
      }
   }

   useEffect(() => {
      setWeekDates(getWeekDates(currentDate))
   }, [currentDate])

   return (
      <View className="flex-1 items-center">
         <View style={styles.header}>
            <TouchableOpacity
               onPress={handlePreviousWeek}
               style={styles.arrowButton}
            >
               <Feather name="chevron-left" size={28} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleTitlePress}>
               <Text className="font-roboto-bold text-lg">
                  {translate(`months.${format(currentDate, 'MMMM')}`)}{' '}
                  {format(currentDate, 'yyyy')}
               </Text>
            </TouchableOpacity>

            <TouchableOpacity
               onPress={handleNextWeek}
               style={styles.arrowButton}
            >
               <Feather name="chevron-right" size={28} color={colors.primary} />
            </TouchableOpacity>
         </View>

         <ScrollView
            horizontal
            snapToAlignment="center"
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6 }}
         >
            {weekDates.map((date, index) => {
               const day = format(date, 'E') as Days

               const hasAppointments = findAnyAppointmentByDate(date)

               // const blocked =
               //    blockedDays.findIndex(
               //       (d) =>
               //          d.date === date.toISOString().split('T')[0] && !d.allDay
               //    ) !== -1
               const allDay =
                  blockedDays.findIndex(
                     (d) =>
                        d.allDay && d.date === date.toISOString().split('T')[0]
                  ) !== -1
               const dayOff = schedule[day].isOff || allDay
               return (
                  <Day
                     key={index}
                     hasAppointments={hasAppointments}
                     date={date}
                     ignorePast={ignorePast}
                     isOff={dayOff}
                     isPast={
                        date < new Date() &&
                        format(date, 'yyyy-MM-dd') !==
                           format(today, 'yyyy-MM-dd')
                     }
                     isSelected={
                        format(date, 'yyyy-MM-dd') ===
                        format(selectedDate, 'yyyy-MM-dd')
                     }
                     onPress={() => {
                        setSelectedDate(date)
                        onPress?.(date)
                     }}
                  />
               )
            })}
         </ScrollView>
      </View>
   )
}

const styles = StyleSheet.create({
   header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%'
   },

   arrowButton: {
      padding: 10
   },
   dayContainer: {
      width: Dimensions.get('window').width / 8.5,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10
   }
})

export default WeekSelector
