import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import Stripe from 'stripe';

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
   const customerId = subscription.customer as string;
   const subscriptionId = subscription.id;
   const status = subscription.status;

   await getFirestore().collection('subscriptions').doc(subscriptionId).set({
      customerId,
      subscriptionId,
      status,
      createdAt: FieldValue.serverTimestamp(),
   });
   await updateUSerSubscription(status, subscription.metadata.userId as string);

   console.log(`Subscription created for customer ${customerId}`);
}

// Function to handle subscription updates
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
   const subscriptionId = subscription.id;
   const status = subscription.status;

   await getFirestore().collection('subscriptions').doc(subscriptionId).update({
      status,
      updatedAt: FieldValue.serverTimestamp(),
   });
   await updateUSerSubscription(status, subscription.metadata.userId as string);

   console.log(`Subscription updated: ${subscriptionId}, status: ${status}`);
}

// Function to handle subscription deletion
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
   const subscriptionId = subscription.id;

   await getFirestore().collection('subscriptions').doc(subscriptionId).delete();
   await updateUSerSubscription('canceled', subscription.metadata.userId as string);

   console.log(`Subscription deleted: ${subscriptionId}`);
}

// Function to handle successful payments
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
   const paymentIntentId = paymentIntent.id;
   const customerId = paymentIntent.customer as string;

   await getFirestore().collection('payments').doc(paymentIntentId).set({
      paymentIntentId,
      customerId,
      amountReceived: paymentIntent.amount_received,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      createdAt: FieldValue.serverTimestamp(),
   });

   console.log(`Payment succeeded for payment intent: ${paymentIntentId}`);
}

// Function to handle failed payments
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
   const paymentIntentId = paymentIntent.id;
   const customerId = paymentIntent.customer as string;

   await getFirestore()
      .collection('failedPayments')
      .doc(paymentIntentId)
      .set({
         paymentIntentId,
         customerId,
         amount: paymentIntent.amount,
         currency: paymentIntent.currency,
         status: paymentIntent.status,
         errorMessage: paymentIntent.last_payment_error?.message || 'Unknown error',
         createdAt: FieldValue.serverTimestamp(),
      });

   console.error(`Payment failed for payment intent: ${paymentIntentId}`);
}

async function updateUSerSubscription(status: Stripe.Subscription.Status, userId: string) {
   try {
      await getFirestore().collection('users').doc(userId).update({
         subscriptionStatus: status,
      });
   } catch (error) {
      console.log(`Error updating user subscription status: ${error}`);
   }
}

export {
   handleSubscriptionCreated,
   handleSubscriptionUpdated,
   handleSubscriptionDeleted,
   handlePaymentIntentSucceeded,
   handlePaymentIntentFailed,
};
