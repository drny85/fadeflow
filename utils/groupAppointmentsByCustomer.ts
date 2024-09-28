import { Appointment } from '~/shared/types'

export function groupAppointmentsByCustomer(appointments: Appointment[]) {
   // Reduce the appointments array into a map of customers and their appointments
   const customerMap = appointments.reduce(
      (acc, appointment) => {
         const { id, name, phone, image } = appointment.customer
         if (!id || !name || !phone) return acc

         if (!acc[id]) {
            // If customer doesn't exist in the map, add them with an empty appointments array
            acc[id] = {
               id,
               name,
               phone,
               image,
               appointments: []
            }
         }

         // Push the current appointment to the customer's appointment list
         acc[id].appointments.push(appointment)

         return acc
      },
      {} as Record<
         string,
         {
            id: string
            name: string
            phone: string
            image: string | null
            appointments: Appointment[]
         }
      >
   )

   // Convert the customer map to an array
   return Object.values(customerMap)
}
