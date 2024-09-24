import * as dotenv from 'dotenv'
import Stripe from 'stripe'
dotenv.config()

const KEY = process.env.STRIPE_SK as string

if (!KEY) throw new Error('STRIPE_SK is not defined')

console.log('KEY', KEY)
const stripe = new Stripe(KEY, {
   apiVersion: '2024-06-20',
   typescript: true
})

export { stripe, Stripe }
