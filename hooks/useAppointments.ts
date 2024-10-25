import { onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { appointmentsCollection } from '~/firebase-collections'
import { useAuth } from '~/providers/AuthContext'
import { useAppointmentStore } from '~/providers/useAppointmentStore'
import { Appointment } from '~/shared/types'

export const useAppointments = () => {
   const { user } = useAuth()
   const [loading, setLoading] = useState(false)
   const { setAppointments } = useAppointmentStore()
   useEffect(() => {
      const appointmentsQuery =
         user && user.isBarber
            ? query(appointmentsCollection, where('barber.id', '==', user.id))
            : appointmentsCollection
      console.log('FETCHING APPOINTMENTS')
      return onSnapshot(appointmentsQuery, (snapshot) => {
         setLoading(true)
         const appointments = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
         })) as never
         setAppointments(appointments as Appointment[])
         setLoading(false)
      })
   }, [user])

   return { loading }
}
