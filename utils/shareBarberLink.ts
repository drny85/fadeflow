import * as Linking from 'expo-linking'
import { Share } from 'react-native'

import { SITE_URL } from '~/constants'
import { useBarbersStore } from '~/providers/useBarbersStore'
export const shareBarberLink = async (barberId: string) => {
   if (!barberId) return

   try {
      const getBarberById = useBarbersStore.getState().getBarberById
      const barber = getBarberById(barberId)
      const url = Linking.createURL('barber', {
         queryParams: { barberId }
      })

      const websiteUrl = `${SITE_URL}/barbers?linking=${url}`
      console.log(websiteUrl)
      const share = await Share.share(
         {
            title: 'Share URL',
            message: `Check out ${barber.name} at ${barber.profile?.barbershopName}. I am using their services and i think you might too.\n${websiteUrl}`
            //url: url,
         },
         {
            dialogTitle: 'Share URL'
         }
      )
      if (share.action === Share.sharedAction) {
         if (share.activityType) {
            // shared with activity type of share.activityType
         }
      }
   } catch (error) {
      console.log(error)
   }
}
