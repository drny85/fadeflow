import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import * as functions from 'firebase-functions/v1';
dotenv.config();

const KEY = process.env.STRIPE_SK as string;
console.log(KEY);
if (!KEY) throw new Error('STRIPE_SK is not defined');
const STRIPE_KEY = functions.config()[KEY];
const stripe = new Stripe(STRIPE_KEY, {
   apiVersion: '2024-06-20',
   typescript: true,
});

export { stripe, Stripe };
