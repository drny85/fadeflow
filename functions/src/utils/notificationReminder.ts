// functions/index.js

import { Appointment, AppUser } from '@shared/types'
import { Expo } from 'expo-server-sdk'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import moment from 'moment-timezone'
// Initialize Firebase Admin

// Initialize Expo SDK
const expo = new Expo()

// Function to calculate time window
const getTimeWindow = () => {
   const now = Timestamp.now()
   const toNewYorkTime = moment(now.toDate()).tz('America/New_York')
   const twoHours = toNewYorkTime.clone().add(2, 'hours')

   const fifteenMinutesAfter = twoHours.clone().add(15, 'minutes')
   return {
      start: twoHours.toISOString(),
      end: fifteenMinutesAfter.toISOString()
   }
}

export const notificationReminder = async (): Promise<any> => {
   try {
      const { start, end } = getTimeWindow()
      const startDate = moment(start).tz('America/New_York').toISOString()
      const endDate = moment(end).tz('America/New_York').toISOString()

      const db = getFirestore()
      const appointmentsRef = db.collection('appointments')

      // Query appointments where appointmentTime is between start and end and reminder not sent
      const snapshot = await appointmentsRef
         .where('date', '>=', startDate)
         .where('date', '<=', endDate)
         .where('status', '==', 'confirmed')
         .where('reminderSent', '==', false)
         .get()

      if (snapshot.empty) {
         console.log('No matching appointments.')
         return null
      }

      const messages: any[] = []

      snapshot.forEach((doc) => {
         const appointment = doc.data() as Appointment
         const userId = appointment.customer.id
         // Get the user's Expo Push Token
         // Ensure each appointment has a reference to the user
         if (!userId) {
            console.error(`No userId found for appointment ${doc.id}`)
            return
         }

         const userRef = db.collection('users').doc(userId)
         messages.push(
            userRef.get().then((userDoc: any) => {
               if (!userDoc.exists) {
                  console.error(`No user found with ID: ${userId}`)
                  return
               }

               const userData = userDoc.data() as AppUser
               const pushToken = userData.pushToken

               if (!Expo.isExpoPushToken(pushToken)) {
                  console.error(
                     `Push token ${pushToken} is not a valid Expo push token`
                  )
                  return null
               }

               return {
                  to: pushToken,
                  sound: 'default',
                  title: 'Appointment Reminder',
                  body: `You have an upcoming appointment with ${appointment.barber.name.split(' ')[0]} at ${appointment.startTime}.`,
                  data: { id: doc.id, notificationType: 'reminder' }
               }
            })
         )
      })

      // Wait for all user fetches to complete
      const resolvedMessages = await Promise.all(messages)
      // Filter out any null messages
      const validMessages = resolvedMessages.filter((msg) => msg !== null)

      // Chunk messages to respect Expo's rate limits
      const chunks = expo.chunkPushNotifications(validMessages)
      const tickets = []

      for (const chunk of chunks) {
         try {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk)
            console.log(ticketChunk)
            tickets.push(...ticketChunk)
         } catch (error) {
            console.error('Error sending push notifications:', error)
         }
      }

      // Optionally, handle receipts here for confirmation

      // After sending notifications, update reminderSent flag
      const batch = db.batch()

      snapshot.forEach((doc) => {
         batch.update(doc.ref, { reminderSent: true })
      })

      await batch.commit()

      return null
   } catch (error) {
      console.log('Notification error', error)
   }
}
