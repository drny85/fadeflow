import { BroadcastMessage, NOTIFICATION_TYPE } from '@shared/types'
import axios from 'axios'
import { getFirestore } from 'firebase-admin/firestore'

type NotificationPayload = {
   to: string
   title: string
   body: string
   data: { notificationType: NOTIFICATION_TYPE; id: string }
   barberId?: string
   userId?: string
}
export const sendPushNotification = async (values: NotificationPayload) => {
   const payload = {
      to: values.to,
      sound: 'default',
      title: values.title,
      body: values.body,
      data: values.data
   }
   const { title, body, barberId, userId } = values

   try {
      const response = await axios.post(
         'https://exp.host/--/api/v2/push/send',
         payload,
         {
            headers: {
               Accept: 'application/json',
               'Accept-Encoding': 'gzip, deflate',
               'Content-Type': 'application/json'
            }
         }
      )

      if (barberId && userId) {
         await addBroadcastMessage({
            title,
            message: body,
            userId,
            users: [userId],
            barberId,
            createdAt: new Date().toISOString()
         })
      }

      console.log('Notification sent successfully:', response.data)
   } catch (error) {
      const err = error as any
      console.error(
         'Error sending notification:',
         err.response ? err.response.data : err.message
      )
   }
}
export const addBroadcastMessage = async (message: BroadcastMessage) => {
   try {
      await getFirestore().collection('broadcasts').add(message)
      console.log('Broadcast message added successfully', message.userId)
   } catch (error) {
      const err = error as Error
      console.error(err.message)
   }
}
