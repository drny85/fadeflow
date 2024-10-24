import { create } from 'zustand'

import {
   addNewAppointmentToDatabase,
   updateAppointmentInDatabase
} from '~/actions/appointments'
import { Appointment, AppointmentStatus } from '~/shared/types'

type AppointmentStoreParams = {
   appointments: Appointment[]
   setAppointments: (appointments: Appointment[]) => void
   addNewAppointment: (appointment: Appointment) => Promise<boolean>
   getAppointment: (appointmetId: string) => Appointment
   filtered: boolean
   filteredAppointments: Appointment[]
   setFilteredAppointments: (filteredAppointments: Appointment[]) => void
   setFiltered: (filtered: boolean) => void
   selectedStatuses: AppointmentStatus[]
   setSelectedStatuses: (statuses: AppointmentStatus[]) => void

   //setSelectedStatus:(status:AppointmentStatus)=>void
   updateAppointmentsById: (
      appointmentId: string,
      appointment: Appointment
   ) => void
}
export const useAppointmentStore = create<AppointmentStoreParams>(
   (set, get) => ({
      appointments: [],
      filtered: false,
      selectedStatuses: [],

      setSelectedStatuses: (statuses: AppointmentStatus[]) =>
         set({ selectedStatuses: statuses }),

      setFiltered: (filtered: boolean) => set({ filtered }),
      filteredAppointments: [],
      setFilteredAppointments: (filteredAppointments: Appointment[]) =>
         set({ filteredAppointments }),

      updateAppointmentsById: async (
         appointmentId: string,
         appointment: Appointment
      ) => {
         let appt: Appointment
         get().appointments.map((app) => {
            if (app.id === appointmentId) {
               appt = appointment
               console.log('A', app.startTime)
               return appointment
            }
            appt = app

            updateAppointmentInDatabase(appt)
         })
      },

      setAppointments: (appointments: Appointment[]) => set({ appointments }),

      getAppointment: (appointmentId: string) => {
         return get().appointments.find(
            (appointment) => appointment.id === appointmentId
         ) as Appointment
      },
      addNewAppointment: async (appointment: Appointment) => {
         // set({ appointments: [...get().appointments, appointment] });
         return addNewAppointmentToDatabase(appointment)
      }
   })
)
