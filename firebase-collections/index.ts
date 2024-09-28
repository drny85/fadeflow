import {
   collection,
   CollectionReference,
   DocumentData
} from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'

import { app, db } from '~/firebase'
import {
   Appointment,
   AppUser,
   BroadcastMessage,
   CreateSubscriptionRequest,
   CreateSubscriptionResponse,
   Response,
   Review,
   Service,
   SubscriptionStatusResponse
} from '~/shared/types'

const functions = getFunctions(app, 'us-central1')

export const createCollection = <T = DocumentData>(collectionName: string) => {
   return collection(db, collectionName) as CollectionReference<T>
}
export const getSubscriptionStatus = httpsCallable<
   object,
   SubscriptionStatusResponse
>(functions, 'getSubscriptionStatus')

export const createSubscrition = httpsCallable<
   CreateSubscriptionRequest,
   CreateSubscriptionResponse
>(functions, 'createSubscrition')
export const getPortalUrl = httpsCallable<object, Response>(
   functions,
   'getPortalUrl'
)

export const deleteUserFunction = httpsCallable<object, Response>(
   functions,
   'deleteUser'
)

export const broadcastCollection =
   createCollection<BroadcastMessage>('broadcasts')
export const usersCollection = createCollection<AppUser>('users')
export const stripeCustomers = createCollection<{ customer_id: string }>(
   'stripe_customers'
)
export const appointmentsCollection =
   createCollection<Appointment>('appointments')
export const reviewsCollection = createCollection<Review>('reviews')
export const servicesCollection = (barberId: string) =>
   createCollection<Service>(`services/${barberId}/services`)
