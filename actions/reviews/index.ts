import {
   addDoc,
   doc,
   getDocs,
   limit,
   query,
   updateDoc,
   where
} from 'firebase/firestore'

import { reviewsCollection } from '~/firebase-collections'
import { Review } from '~/shared/types'

export const addNewReview = async (review: Review): Promise<boolean> => {
   try {
      if (!review) return false
      const reviewDoc = query(
         reviewsCollection,
         where('customerId', '==', review.customerId),
         where('barberId', '==', review.barberId),
         limit(1)
      )
      const reviewSnapshot = await getDocs(reviewDoc)
      if (reviewSnapshot.empty) {
         await addDoc(reviewsCollection, {
            ...review,
            date: new Date().toISOString()
         })
         return true
      }
      const docRef = doc(reviewsCollection, reviewSnapshot.docs[0].id)
      await updateDoc(docRef, { ...review })

      return true
   } catch (error) {
      console.log(error)
      return false
   }
}
