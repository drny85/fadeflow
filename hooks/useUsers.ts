import { onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { usersCollection } from '~/firebase-collections'
import { AppUser } from '~/shared/types'

export const useUsers = () => {
   const [users, setUsers] = useState<AppUser[]>([])
   const [loading, setLoading] = useState(true)
   useEffect(() => {
      return onSnapshot(usersCollection, (snap) => {
         setUsers(
            snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as AppUser)
         )
         setLoading(false)
      })
   }, [])

   return { users, loading }
}
