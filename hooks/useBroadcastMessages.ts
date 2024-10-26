import { getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { broadcastCollection } from '~/firebase-collections'
import { useAuth } from '~/providers/AuthContext'
import { BroadcastMessage } from '~/shared/types'

export const useBroadcastMessages = () => {
   const [messages, setMessages] = useState<BroadcastMessage[]>([])
   const [loading, setLoading] = useState(true)
   const { user } = useAuth()

   useEffect(() => {
      if (!user) return
      const q = user?.isBarber
         ? query(broadcastCollection, where('barberId', '==', user.id))
         : query(broadcastCollection, where('users', 'array-contains', user.id))
      getDocs(q).then((snapshot) => {
         setMessages(
            snapshot.docs
               .map((doc) => doc.data() as BroadcastMessage)
               .sort((a, b) => (a.createdAt! < b.createdAt! ? 1 : -1))
         )
         setLoading(false)
      })
   }, [user])

   return {
      messages,
      loading
   }
}
