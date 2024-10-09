import { format } from 'date-fns'

import { Barber, Days, Review } from '~/shared/types'

export const getReviews = (barberId: string, reviews: Review[]): number => {
   return (
      reviews
         .filter((r) => r.barberId === barberId)
         .reduce((acc, curr) => acc + curr.rating, 0) / reviews.length || 0
   )
}

export const checkIfScheuleIsAvailableToday = (barber: Barber) => {
   // Implement the logic to check if the barber is available today
   const today = format(new Date(), 'E') as Days
   return !barber.schedule[today].isOff
}
