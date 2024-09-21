import {
   Appointment,
   AppUser,
   CreateSubscriptionRequest,
   CreateSubscriptionResponse,
   Response,
   Review,
   Service,
   SubscriptionStatusResponse,
} from '~/shared/types';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { collection, CollectionReference, DocumentData } from 'firebase/firestore';
import { app, db } from '~/firebase';

const functions = getFunctions(app, 'us-central1');

export const createCollection = <T = DocumentData>(collectionName: string) => {
   return collection(db, collectionName) as CollectionReference<T>;
};
export const getSubscriptionStatus = httpsCallable<{}, SubscriptionStatusResponse>(
   functions,
   'getSubscriptionStatus'
);

export const createSubscrition = httpsCallable<
   CreateSubscriptionRequest,
   CreateSubscriptionResponse
>(functions, 'createSubscrition');
export const getPortalUrl = httpsCallable<{}, Response>(functions, 'getPortalUrl');

export const deleteUserFunction = httpsCallable<{}, Response>(functions, 'deleteUser');
export const usersCollection = createCollection<AppUser>('users');
export const appointmentsCollection = createCollection<Appointment>('appointments');
export const reviewsCollection = createCollection<Review>('reviews');
export const servicesCollection = (barberId: string) =>
   createCollection<Service>(`services/${barberId}/services`);
