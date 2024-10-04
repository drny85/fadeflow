import { router } from 'expo-router'
import React from 'react'
import { updateUser } from '~/actions/users'
import BlockTime from '~/components/Appointment/BlockTime'
import { toastMessage } from '~/lib/toast'
import { useAuth } from '~/providers/AuthContext'
import { BlockTimeParams } from '~/shared/types'

const BlockTimes = () => {
   const { user } = useAuth()
   const blockedTimes = user?.isBarber && user.blockedTimes
   const handleBlockTimeChange = async (
      updatedBlockTimes: BlockTimeParams[]
   ) => {
      console.log(
         'Updated Block Times:',
         JSON.stringify(updatedBlockTimes, null, 2)
      )
      try {
         if (!user || !user.isBarber) return
         const newTimes = (user.blockedTimes = updatedBlockTimes)

         const updated = await updateUser({ ...user, blockedTimes: newTimes })
         if (updated) {
            toastMessage({
               title: 'Success',
               message: 'Blocked times updated successfully'
            })
            router.back()
         }
      } catch (error) {
         console.log('Error on adding blockedTimes', error)
      }
      // Save or process the updated block times here
   }
   return (
      <BlockTime
         initialBlockTimes={blockedTimes || []}
         onBlockTimeChange={handleBlockTimeChange}
      />
   )
}

export default BlockTimes
