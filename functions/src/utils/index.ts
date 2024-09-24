import { FieldValue, getFirestore } from 'firebase-admin/firestore'

import { stripe, Stripe } from './stripe'
import { getAuth } from 'firebase-admin/auth'

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
   const customerId = subscription.customer as string
   const subscriptionId = subscription.id
   const status = subscription.status
   const userId = subscription.metadata.userId

   await getFirestore().collection('subscriptions').doc(userId).set({
      customerId,
      subscriptionId,
      status,
      createdAt: FieldValue.serverTimestamp()
   })
   await updateUSerSubscription(status, userId)

   console.log(`Subscription created for customer ${customerId}`)
}

// Function to handle subscription updates
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
   const subscriptionId = subscription.id
   const status = subscription.status
   const userId = subscription.metadata.userId

   await getFirestore().collection('subscriptions').doc(userId).update({
      status,
      updatedAt: FieldValue.serverTimestamp()
   })
   await updateUSerSubscription(status, userId)

   console.log(`Subscription updated: ${subscriptionId}, status: ${status}`)
}

// Function to handle subscription deletion
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
   const subscriptionId = subscription.id
   const userId = subscription.metadata.userId

   await getFirestore().collection('subscriptions').doc(userId).delete()
   await updateUSerSubscription('canceled', userId)

   console.log(`Subscription deleted: ${subscriptionId}`)
}

// Function to handle successful payments
async function handlePaymentIntentSucceeded(
   paymentIntent: Stripe.PaymentIntent
) {
   const paymentIntentId = paymentIntent.id
   const customerId = paymentIntent.customer as string

   await getFirestore().collection('payments').doc(paymentIntentId).set({
      paymentIntentId,
      customerId,
      amountReceived: paymentIntent.amount_received,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      createdAt: FieldValue.serverTimestamp()
   })

   console.log(`Payment succeeded for payment intent: ${paymentIntentId}`)
}

// Function to handle failed payments
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
   const paymentIntentId = paymentIntent.id
   const customerId = paymentIntent.customer as string

   await getFirestore()
      .collection('failedPayments')
      .doc(paymentIntentId)
      .set({
         paymentIntentId,
         customerId,
         amount: paymentIntent.amount,
         currency: paymentIntent.currency,
         status: paymentIntent.status,
         errorMessage:
            paymentIntent.last_payment_error?.message || 'Unknown error',
         createdAt: FieldValue.serverTimestamp()
      })

   console.error(`Payment failed for payment intent: ${paymentIntentId}`)
}
export async function handleStripeCustomerUpdate(
   email: string,
   customerId: string
) {
   try {
      if (!email) return
      const found = await getAuth().getUserByEmail(email)
      if (found) {
         await getFirestore()
            .collection('stripe_customers')
            .doc(found.uid)
            .set({
               customer_id: customerId
            })
      }
   } catch (error) {
      console.log(error)
   }
}
export async function handleCustomerDeletion(email: string) {
   try {
      if (!email) return
      const found = await getAuth().getUserByEmail(email)
      if (found) {
         await getFirestore()
            .collection('stripe_customers')
            .doc(found.uid)
            .delete()
      }
   } catch (error) {
      console.log(error)
   }
}
// Function to handle checkout session completed
async function handleCheckoutSessionCompleted(
   session: Stripe.Checkout.Session
) {
   const sessionId = session.id
   const customerId = session.customer as string

   const customer = session.customer_details
   const email = customer?.email
   const user = await getFirestore()
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get()
   const sub = session.subscription as string
   const { status } = await stripe.subscriptions.retrieve(sub)
   await updateUSerSubscription(status, user.docs[0].id)

   console.log(
      `Checkout session completed: ${sessionId}, customer: ${customerId}`
   )
}

// Function to handle async payment succeeded for checkout session
async function handleAsyncPaymentSucceeded(session: Stripe.Checkout.Session) {
   const sessionId = session.id
   const customer = session.customer_details
   const email = customer?.email
   const user = await getFirestore()
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get()
   const sub = session.subscription as string
   const { status } = await stripe.subscriptions.retrieve(sub)
   await updateUSerSubscription(status, user.docs[0].id)

   console.log(`Async payment succeeded for checkout session: ${sessionId}`)
}

// Function to handle async payment failed for checkout session
async function handleAsyncPaymentFailed(session: Stripe.Checkout.Session) {
   const sessionId = session.id

   const customer = session.customer_details
   const email = customer?.email
   const user = await getFirestore()
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get()
   const sub = session.subscription as string
   const { status } = await stripe.subscriptions.retrieve(sub)
   await updateUSerSubscription(status, user.docs[0].id)

   console.error(`Async payment failed for checkout session: ${sessionId}`)
}

async function updateUSerSubscription(
   status: Stripe.Subscription.Status,
   userId: string
) {
   try {
      await getFirestore().collection('users').doc(userId).update({
         subscriptionStatus: status
      })
   } catch (error) {
      console.log(`Error updating user subscription status: ${error}`)
   }
}

export {
   handleSubscriptionCreated,
   handleSubscriptionUpdated,
   handleSubscriptionDeleted,
   handlePaymentIntentSucceeded,
   handleCheckoutSessionCompleted,
   handleAsyncPaymentSucceeded,
   handleAsyncPaymentFailed,
   handlePaymentIntentFailed
}
