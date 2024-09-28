import { onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { reviewsCollection } from '~/firebase-collections'
import { Review } from '~/shared/types'

export const useReviews = () => {
   const [reviews, setReviews] = useState<Review[]>([])
   const [loading, setLoading] = useState(false)

   useEffect(() => {
      return onSnapshot(reviewsCollection, (snapshot) => {
         setLoading(true)
         const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
         }))
         setReviews(data as Review[])
         setLoading(false)
      })
   }, [])

   return {
      reviews,
      loading
   }
}
