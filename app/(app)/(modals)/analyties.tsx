import { useSegments } from 'expo-router'
import React, { useMemo } from 'react'
import { Platform, ScrollView } from 'react-native'
import AppointmentAnalysis, {
   AppointmentToAnalyzeProps
} from '~/components/Appointment/AppointmentsAnalysis'
import { SIZES } from '~/constants'
import { useNavigationSearch } from '~/hooks/useNavigationSeach'
import { translation } from '~/locales/translate'
import { useAppointmentStore } from '~/providers/useAppointmentStore'

const Analyties = () => {
   const segment = useSegments()
   const search = useNavigationSearch({
      searchBarOptions: {
         placeholder: translation('sorting', 'search')
      }
   })

   const appointments = useAppointmentStore((s) =>
      s.appointments.sort((a, b) =>
         new Date(a.date) > new Date(b.date) ? 1 : -1
      )
   )
   const appointmentsToAnalyzed = useMemo(
      () =>
         appointments.map((a) => {
            return {
               id: a.id!,
               date: a.date,
               customer: a.customer,
               amount: a.services.reduce(
                  (curr, acc) => curr + acc.price * acc.quantity,
                  0
               ),
               status: a.status
            }
         }) as AppointmentToAnalyzeProps[],
      [appointments]
   )

   const appointmentsData = useMemo(() => {
      if (!search) return appointmentsToAnalyzed
      return appointmentsToAnalyzed.filter(
         (a) =>
            a.customer.name.toLowerCase().includes(search.toLowerCase()) ||
            a.status.toLowerCase().includes(search.toLowerCase()) ||
            a.date.toLowerCase().includes(search.toLowerCase()) ||
            a.amount.toString().toLowerCase().includes(search.toLowerCase())
      )
   }, [appointmentsToAnalyzed, search])
   return (
      <ScrollView
         contentInsetAdjustmentBehavior="automatic"
         showsVerticalScrollIndicator={false}
         contentContainerStyle={{
            paddingTop:
               Platform.OS === 'android' && segment[2] !== 'analyties'
                  ? SIZES.statusBarHeight + 36
                  : undefined
         }}
      >
         <AppointmentAnalysis appointments={appointmentsData} />
      </ScrollView>
   )
}

export default Analyties
