/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import {
    Appointment,
    AppUser,
    Barber,
    CreateSubscriptionRequest,
    CreateSubscriptionResponse,
    Response,
    SubscriptionStatusResponse
} from '@shared/types'
import { format } from 'date-fns'
//import {onRequest} from "firebase-functions/v2/https";
import * as dotenv from 'dotenv'
import { getApp, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import * as functions from 'firebase-functions'
import * as logger from 'firebase-functions/logger'
import {
    onDocumentCreated,
    onDocumentUpdated
} from 'firebase-functions/v2/firestore'
import { onCall, onRequest } from 'firebase-functions/v2/https'
import Stripe from 'stripe'

import {
    handleAsyncPaymentFailed,
    handleAsyncPaymentSucceeded,
    handleCheckoutSessionCompleted,
    handlePaymentIntentFailed,
    handlePaymentIntentSucceeded,
    handleSubscriptionCreated,
    handleSubscriptionDeleted,
    handleSubscriptionUpdated
} from './utils'
import { sendPushNotification } from './utils/common'
import { stripe } from './utils/stripe'
dotenv.config()

getApps().length === 0 ? initializeApp() : getApp()
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.notifyOnAppointmentCreation = onDocumentCreated(
    '/appointments/{appointmentId}',
    async (event) => {
        logger.info(`New document with ID ${event.id} was created.`)
        try {
            const data = event.data?.data() as Appointment
            const barberDoc = getFirestore()
                .collection('users')
                .doc(data.barber.id)
            const barberData = (await barberDoc.get()).data() as Barber
            const appointmentDate = format(data.date, 'E, PPP')
            if (!barberData.pushToken) return
            logger.log('Notification Sent!')
            return await sendPushNotification(
                event.params.appointmentId,
                'new-appointment',
                barberData.pushToken,
                'New Appointment',
                `${data.customer.name} has scheduled an appointment with you for ${appointmentDate} at ${data.startTime}.`
            )
        } catch (error) {
            logger.error(error)
        }
    }
)
exports.onCreateUSer = functions.auth.user().onCreate(async (user) => {
    try {
        const data = user.toJSON() as AppUser
        const customer = await stripe.customers.create({
            email: data.email,
            metadata: { userId: user.uid }
        })

        return getFirestore()
            .collection('stripe_customers')
            .doc(user.uid)
            .set({ customer_id: customer.id })
    } catch (error) {
        const err = error as Error
        console.log(err.message)
        throw new functions.https.HttpsError(
            'aborted',
            `error while creating stripe customer: ${err.message}`
        )
    }
})
exports.getSubscriptionStatus = onCall(
    async ({ data, auth }): Promise<SubscriptionStatusResponse> => {
        if (!auth) return { isSubscribed: false }
        const userId = auth?.uid
        const userData = await getFirestore()
            .collection('stripe_customers')
            .doc(userId)
            .get()
        const { customer_id } = userData.data() as { customer_id: string }
        if (!customer_id) return { isSubscribed: false }
        const subscriptions = await stripe.subscriptions.list({
            limit: 1,
            customer: customer_id // Retrieve customer ID for this user from your database
        })

        if (
            subscriptions.data.length > 0 &&
            subscriptions.data[0].status === 'active'
        ) {
            await getFirestore()
                .collection('users')
                .doc(userId)
                .update({ isSubscribed: true, isActive: true })
            return { isSubscribed: true }
        } else {
            await getFirestore()
                .collection('users')
                .doc(userId)
                .update({ isSubscribed: false, isActive: false })
            return { isSubscribed: false }
        }
    }
)

exports.createSubscrition = onCall<CreateSubscriptionRequest, any>(
    async ({ data, auth }): Promise<CreateSubscriptionResponse | any> => {
        if (!auth) return { success: false, result: 'no authorized' }
        try {
            const { email } = data

            if (!email) {
                return {
                    success: false,
                    result: 'Email and PaymentMethodId are required'
                }
            }
            let customerId: string | undefined = undefined
            const customerData = await getFirestore()
                .collection('stripe_customers')
                .doc(auth.uid)
                .get()
            const { customer_id } = customerData.data() as {
                customer_id: string
            }
            customerId = customer_id
            if (!customer_id) {
                const cust = await stripe.customers.create({
                    email,
                    metadata: { userId: auth.uid }
                })
                customerId = cust.id
            }
            const existingSubs = await stripe.subscriptions.list({
                customer: customerId,
                price: 'price_1Q1LkAHSlvp4GnsbbaLLLb0c',
                limit: 1
            })
            if (
                existingSubs.data.length > 0 &&
                existingSubs.data[0].status === 'active'
            ) {
                return { success: false, result: 'Already subscribed' }
            }

            // Fetch or create a customer in Stripe
            // let customer;
            // const customers = await stripe.customers.list({ email });
            // if (customers.data.length > 0) {
            //    customer = customers.data[0];
            // } else {
            //    customer = await stripe.customers.create({ email, metadata: { userId: auth.uid } });
            // }

            // Create the subscription
            const subscription = await stripe.subscriptions.create({
                customer: customerId,
                items: [{ price: 'price_1Q1LkAHSlvp4GnsbbaLLLb0c' }], // $10/month price ID from Stripe dashboard
                payment_behavior: 'default_incomplete',
                payment_settings: {
                    save_default_payment_method: 'on_subscription',
                    payment_method_types: ['card']
                },
                expand: ['latest_invoice.payment_intent'],
                metadata: {
                    email,
                    customerId,
                    userId: auth?.uid
                }
                // trial_period_days: 14,

                // 14-day free trial
            })

            // if (!subscription.latest_invoice) {
            //    return {
            //       success: false,
            //       result: 'An error occurred while creating the subscription invoice',
            //    };
            // }

            if (!subscription.latest_invoice) {
                return {
                    success: false,
                    result: 'An error occurred while creating the subscription payment intent'
                }
            }
            const invoice = subscription.latest_invoice as Stripe.Invoice
            if (!invoice.payment_intent) {
                return {
                    success: false,
                    result: 'An error occurred while creating the subscription payment intent'
                }
            }
            const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent

            return {
                success: true,
                result: {
                    customer_id: customerId,
                    paymentIntent: paymentIntent.id,
                    clientSecret: paymentIntent.client_secret,
                    status: subscription.status
                }
            }
        } catch (error) {
            console.error('Error creating subscription:', error)
            return {
                success: false,
                result: 'An error occurred while creating the subscription'
            }
        }
    }
)

exports.onAppointmentUpdates = onDocumentUpdated(
    '/appointments/{appointmentId}',
    async (event) => {
        logger.info(`New document with ID ${event.id} was created.`)
        try {
            const data = event.data?.after.data() as Appointment
            const dataBefore = event.data?.before.data() as Appointment
            const isBarber = data.changesMadeBy === 'barber'
            const appointmentDate = format(data.date, 'E, PPP')
            const prevDate = dataBefore && format(dataBefore.date, 'E, PPP')
            if (isBarber) {
                const customerDoc = getFirestore()
                    .collection('users')
                    .doc(data.customer.id!)
                const customerData = (await customerDoc.get()).data() as AppUser
                if (!customerData.pushToken) return

                if (data.status === 'confirmed') {
                    await sendPushNotification(
                        event.params.appointmentId,
                        'appointment-updates',
                        customerData.pushToken,
                        'Appointment Update',
                        `${data.barber.name} has confirmed your appointment for ${appointmentDate} at ${data.startTime}.`
                    )
                }
                if (data.status === 'cancelled') {
                    await sendPushNotification(
                        event.params.appointmentId,
                        'appointment-updates',
                        customerData.pushToken,
                        'Appointment Update',
                        `${data.barber.name} has cancelled your appointment for ${appointmentDate}.`
                    )
                }
            } else if (data.changesMadeBy === 'customer') {
                const barberDoc = getFirestore()
                    .collection('users')
                    .doc(data.barber.id)
                const barberData = (await barberDoc.get()).data() as AppUser
                if (!barberData.pushToken) return
                if (data.status === 'cancelled') {
                    await sendPushNotification(
                        event.params.appointmentId,
                        'appointment-updates',
                        barberData.pushToken,
                        'Appointment Update',
                        `${data.customer.name} has cancelled the appointment for ${appointmentDate} at ${data.startTime}.`
                    )
                }

                if (
                    data.status === 'pending' &&
                    dataBefore
                    //dataBefore.service.name !== data.service.name
                ) {
                    await sendPushNotification(
                        event.params.appointmentId,
                        'appointment-updates',
                        barberData.pushToken,
                        'Appointment Update',
                        `${data.customer.name} has changed the service.`
                    )
                }
                if (
                    (data.status === 'pending' &&
                        data.date !== dataBefore.date) ||
                    (data.status === 'pending' &&
                        data.startTime !== dataBefore.startTime)
                ) {
                    await sendPushNotification(
                        event.params.appointmentId,
                        'appointment-updates',
                        barberData.pushToken,
                        'Appointment Update',
                        `${data.customer.name} has rescheduled the appointment from ${prevDate} at ${dataBefore.startTime} to ${appointmentDate} at ${data.startTime}.`
                    )
                }
            }
        } catch (error) {
            logger.error(error)
        }
    }
)

exports.deleteUser = onCall(
    { secrets: [] },
    async ({ auth }): Promise<Response> => {
        if (!auth) return { result: 'No authorized', success: false }
        try {
            await getFirestore().collection('users').doc(auth.uid).delete()

            await getAuth().deleteUser(auth.uid)
            logger.log('User deleted')
            return { result: 'User deleted', success: true }
        } catch (error) {
            console.log(error)
            const err = error as any
            logger.error(err.message)

            return { result: err.message, success: false }
        }
    }
)

exports.sendAppointmentReminder = functions.pubsub
    .schedule('*/5 * * * *')
    .onRun(async (context) => {
        try {
            logger.log('Reminder started', format(context.timestamp, 'PPpp'))
            checkIfThereIsAnUpcomingAppointmentWithTheNextHour()
        } catch (error) {
            logger.error(error)
        }
    })

const checkIfThereIsAnUpcomingAppointmentWithTheNextHour = () => {
    const now = new Date()
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000)

    logger.log('Next hour', format(nextHour, 'PPpp'))
    const appointments = getFirestore()
        .collection('appointments')
        .where('reminderSent', '==', false)
        .where('date', '>=', nextHour)
        .where('date', '<', nextHour)

    appointments
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const appointment = doc.data() as Appointment

                if (appointment.status === 'confirmed') {
                    const usersDoc = getFirestore()
                        .collection('users')
                        .doc(appointment.customer.id!)
                    usersDoc.get().then(async (userSnapshot) => {
                        const user = userSnapshot.data() as AppUser
                        if (user.pushToken) {
                            await sendPushNotification(
                                doc.id,
                                'reminder',
                                user.pushToken,
                                'Upcoming Appointment',
                                `You have an upcoming appointment with ${appointment.barber.name.split(' ')[0]} at ${appointment.startTime}.`
                            )
                            doc.ref.update({ reminderSent: true })
                            logger.log('Reminder sent')
                        }
                    })
                }
            })
        })
        .catch((error) => {
            logger.error(error)
        })
}

exports.getPortalUrl = onCall(
    async ({ data, auth }): Promise<CreateSubscriptionResponse> => {
        try {
            if (!auth) return { success: false, result: 'No authorized' }
            const customer = await getFirestore()
                .collection('stripe_customers')
                .doc(auth.uid)
                .get()
            const { customer_id } = customer.data() as { customer_id: string }
            const portalSession = await stripe.billingPortal.sessions.create({
                customer: customer_id,
                return_url:
                    'https://fadeflow.vercel.app/stripe-redirect?returnUrl=fadeflow://'
            })
            return { success: true, result: portalSession.url }
        } catch (error) {
            const err = error as Error
            return { success: false, result: err.message }
        }
    }
)

exports.handleStripeWebhook = onRequest(
    {
        maxInstances: 10 // adjust based on your scaling needs
    },
    async (
        req: functions.https.Request,
        res: functions.Response
    ): Promise<any> => {
        const sig = req.headers['stripe-signature']
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string

        let event: Stripe.Event

        try {
            // Verify that the request is coming from Stripe
            event = stripe.webhooks.constructEvent(
                req.rawBody,
                sig as string,
                endpointSecret
            )
        } catch (err) {
            console.error('Webhook signature verification failed:', err)
            const error = err as Error
            return res.status(400).send(`Webhook Error: ${error.message}`)
        }

        // Handle the event based on its type
        switch (event.type) {
            case 'customer.subscription.created':
                await handleSubscriptionCreated(
                    event.data.object as Stripe.Subscription
                )
                break
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(
                    event.data.object as Stripe.Subscription
                )
                break
            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(
                    event.data.object as Stripe.Subscription
                )
                break
            case 'payment_intent.succeeded':
                await handlePaymentIntentSucceeded(
                    event.data.object as Stripe.PaymentIntent
                )
                break
            case 'payment_intent.payment_failed':
                await handlePaymentIntentFailed(
                    event.data.object as Stripe.PaymentIntent
                )
                break

            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(
                    event.data.object as Stripe.Checkout.Session
                )
                break
            case 'checkout.session.async_payment_succeeded':
                await handleAsyncPaymentSucceeded(
                    event.data.object as Stripe.Checkout.Session
                )
                break
            case 'checkout.session.async_payment_failed':
                await handleAsyncPaymentFailed(
                    event.data.object as Stripe.Checkout.Session
                )
                break
            default:
                console.log(`Unhandled event type ${event.type}`)
        }

        return res.status(200).json({ received: true })
    }
)

// Function to handle subscription creation
