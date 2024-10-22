import { onSnapshot, query, where } from 'firebase/firestore'
import { useEffect } from 'react'

import { usersCollection } from '~/firebase-collections'
import { useBarbersStore } from '~/providers/useBarbersStore'
import { Barber } from '~/shared/types'

export const useBarbers = (all?: boolean) => {
   const setBarbers = useBarbersStore((s) => s.setBarbers)
   const setLoading = useBarbersStore((s) => s.setLoading)
   useEffect(() => {
      let finalQuery
      if (all) {
         finalQuery = query(
            usersCollection,

            where('isBarber', '==', true)
         )
      } else
         finalQuery = query(
            usersCollection,
            where('isActive', '==', true),
            where('isBarber', '==', true),
            where('profileCompleted', '==', true),
            where('subscriptionStatus', 'in', ['active', 'trialing'])
         )

      setLoading(true)
      return onSnapshot(finalQuery, (snapshot) => {
         const barbers = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
         }))
         setBarbers(barbers as Barber[])
         setLoading(false)
      })
   }, [all])
}
