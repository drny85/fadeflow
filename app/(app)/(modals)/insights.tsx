import React, { useMemo } from 'react'
import CustomerInsights from '~/components/Appointment/ClientsInsights'
import { Container } from '~/components/Container'
import { useAppointmentStore } from '~/providers/useAppointmentStore'

const Insights = () => {
   const appointments = useAppointmentStore((s) =>
      s.appointments.sort((a, b) =>
         new Date(a.date) > new Date(b.date) ? 1 : -1
      )
   )
   const appointmentsT = useMemo(
      () =>
         appointments.map((a) => {
            return {
               id: a.id!,
               date: a.date,
               customer: {
                  id: a.customer.id,
                  name: a.customer.name
               }
               //    amount: a.services.reduce(
               //       (curr, acc) => curr + acc.price * acc.quantity,
               //       0
               //    ),
               //    status: a.status
            }
         }),
      [appointments]
   )

   return (
      <Container>
         <CustomerInsights appointments={appointmentsT as any} />
      </Container>
   )
}

export default Insights
