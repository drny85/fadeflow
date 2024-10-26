import { Review } from '~/shared/types'

export const barberRating = (reviews: Review[], barberId: string): number => {
   if (!reviews || !barberId) return 0
   const barberReviews = reviews.filter((r) => r.barberId === barberId)
   const barberRating =
      barberReviews.reduce((acc, curr) => acc + curr.rating, 0) /
      barberReviews.length
   return barberRating || 0
}
