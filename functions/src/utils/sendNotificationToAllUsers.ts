import { Expo } from 'expo-server-sdk'
import { NotificationData } from '@shared/types'

// Initialize the Expo SDK client
const expo = new Expo()
type MessageBodyData = {
   title: string
   body: string
   data: NotificationData
   sound: 'default'
   to: string
}

// Define a function to send a notification to all users
export const sendNotificationToAllUsers = async (
   title: string,
   message: string,
   data: NotificationData,
   users: string[]
): Promise<void> => {
   // An array to store the push notification messages
   const messages: MessageBodyData[] = []
   if (users.length === 0) return
   // Example notification data (you can customize this)

   // Your list of recipient Expo push tokens (to send to all users, you need to have their tokens)
   const recipientPushTokens = users

   for (const token of recipientPushTokens) {
      if (!Expo.isExpoPushToken(token)) {
         console.error(`Invalid Expo push token: ${token}`)
         continue
      }

      messages.push({
         to: token,
         sound: 'default',
         title: title,
         body: message,
         data: data
      })
   }

   try {
      const chunks = expo.chunkPushNotifications(messages)
      const tickets = []

      for (const chunk of chunks) {
         const ticketChunk = await expo.sendPushNotificationsAsync(chunk)
         tickets.push(...ticketChunk)
      }

      // Handle the results of sending the notifications
      // You can check the status of each notification using the 'tickets' array

      // Example of handling errors:
      const errors = []

      for (let i = 0; i < tickets.length; i++) {
         if (tickets[i].status !== 'ok') {
            errors.push({ index: i, error: tickets[i] })
         }
      }

      if (errors.length > 0) {
         console.error('Failed to send notifications:', errors)
      }
   } catch (error) {
      console.error('Error sending notifications:', error)
   }
}

// Usage example
