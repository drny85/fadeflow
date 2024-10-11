import { isPast } from 'date-fns'
import { addDoc, doc, updateDoc } from 'firebase/firestore'

import { appointmentsCollection } from '~/firebase-collections'
import { toastAlert, toastMessage } from '~/lib/toast'
import { translation } from '~/locales/translate'
import { Appointment } from '~/shared/types'

export const addNewAppointmentToDatabase = async (
   appointment: Appointment
): Promise<boolean> => {
   try {
      await addDoc(appointmentsCollection, { ...appointment })
      return true
   } catch (error) {
      console.log('Error adding new appointment', error)
      return false
   }
}

export const updateAppointmentInDatabase = async (
   appointment: Appointment
): Promise<boolean> => {
   try {
      const appointmentRef = doc(appointmentsCollection, appointment.id)

      await updateDoc(appointmentRef, { ...appointment })
      return true
   } catch (error) {
      console.log('Error updating appointment', error)
      return false
   }
}

export const handleAppointmentUpdates = async (
   appointment: Appointment,
   cancel?: boolean
): Promise<boolean> => {
   try {
      if (!appointment) return false
      if (appointment.status === 'pending' && !cancel) {
         const updated = await updateAppointmentInDatabase({
            ...appointment,
            status: 'confirmed',
            changesMadeBy: 'barber'
         })

         if (updated) {
            toastMessage({
               title: translation('alerts', 'success'),
               message: translation('alerts', 'confirmed'),
               preset: 'done',
               duration: 2
            })
         }
         return updated
      } else if (appointment.status === 'pending' && cancel) {
         const updated = await updateAppointmentInDatabase({
            ...appointment,
            status: 'cancelled',
            changesMadeBy: 'barber'
         })

         if (updated) {
            toastMessage({
               title: translation('alerts', 'warning'),
               message: translation('alerts', 'cancelled'),
               preset: 'error',
               duration: 2
            })
         }
         return updated
      }

      if (appointment.status === 'confirmed') {
         if (!isPast(appointment.date)) {
            toastAlert({
               title: 'Error',
               message: translation('alerts', 'cannot'),
               preset: 'error',
               duration: 2
            })
            return false
         }
         const updated = await updateAppointmentInDatabase({
            ...appointment,
            status: 'completed',
            changesMadeBy: 'barber'
         })

         if (updated) {
            toastMessage({
               title: translation('alerts', 'success'),
               message: translation('alerts', 'completed'),
               preset: 'done',
               duration: 2
            })
         }
         return updated
      }

      return true
   } catch (error) {
      console.log('Error handling appointment updates', error)
      return false
   }
}
