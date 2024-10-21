import {
   PaymentSheetError,
   StripeProvider,
   useStripe
} from '@stripe/stripe-react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Linking, View } from 'react-native'

import { Button } from './Button'
import ConfettiComponent, { ConfettiComponentRef } from './ConfettiComponent'
import { ActivityIndicator } from './nativewindui/ActivityIndicator'

import { createSubscrition } from '~/firebase-collections'
import { usePortalLink } from '~/hooks/usePortalLink'
import { useUser } from '~/hooks/useUser'
import { toastAlert } from '~/lib/toast'
import { useColorScheme } from '~/lib/useColorScheme'
import { useAuth } from '~/providers/AuthContext'
import { PaymentIntentResponse } from '~/shared/types'
import { translation } from '~/locales/translate'

const SubscriptionButton = () => {
   const { initPaymentSheet, presentPaymentSheet, handleURLCallback } =
      useStripe()
   const { isDarkColorScheme, colors } = useColorScheme()
   const { getCustomerPortal } = usePortalLink()
   const confettiRef = useRef<ConfettiComponentRef>(null)
   useUser()
   const { user } = useAuth()
   const [loading, setLoading] = useState(false)

   const handleDeepLink = useCallback(
      async (url: string | null) => {
         if (url) {
            const stripeHandled = await handleURLCallback(url)
            if (stripeHandled) {
               // This was a Stripe URL – handle the deep link as you normally would
               console.log('Stripe handled', url)
               // This was a Stripe URL - you can return or add extra handling here as you see fit
            } else {
               console.log('Stripe not handled', url)
               // This was NOT a Stripe URL – handle as you normally would
            }
         }
      },
      [handleURLCallback]
   )

   useEffect(() => {
      const getUrlAsync = async () => {
         const initialUrl = await Linking.getInitialURL()
         handleDeepLink(initialUrl)
      }

      getUrlAsync()

      const deepLinkListener = Linking.addEventListener(
         'url',
         (event: { url: string }) => {
            handleDeepLink(event.url)
         }
      )

      return () => deepLinkListener.remove()
   }, [handleDeepLink])

   const onSubscribePress = useCallback(async () => {
      try {
         if (!user?.email || !user.isBarber) return
         setLoading(true)
         const { data } = await createSubscrition({ email: user.email })

         const { result, success } = data
         console.log('result', data)
         if (!success) {
            return toastAlert({
               title: 'Error',
               message: result as string,
               preset: 'error'
            })
         }
         const response = result as PaymentIntentResponse
         if (success && result === 'renew') {
            await getCustomerPortal()
            return
         }
         if (!response) {
            setLoading(false)
            return toastAlert({
               title: 'Error',
               message: 'Something went wrong',
               preset: 'error'
            })
         }
         if (!response.clientSecret) return

         const { error } = await initPaymentSheet({
            merchantDisplayName: `FadeFlow Inc`,
            paymentIntentClientSecret: response.clientSecret,
            applePay: {
               merchantCountryCode: 'US'
            },
            primaryButtonLabel: translation('subscription', 'pay'),
            // defaultBillingDetails: {
            //    name: user.name,
            //    email: user.email,

            //    address: {
            //       city: user.profile?.city,
            //       country: user.profile?.country,
            //       line1: user.profile?.address,
            //       postalCode: user.profile?.zip!,
            //       state: user.profile?.state
            //    },
            //    phone: user.profile?.phone
            // },

            appearance: {
               primaryButton: {
                  colors: {
                     background: colors.accent,
                     text: '#ffffff'
                  }
               },
               colors: {
                  background: colors.background,
                  primaryText: isDarkColorScheme ? '#ffffff' : '#212121'
               }
            },
            googlePay: {
               merchantCountryCode: 'US',
               currencyCode: 'usd'
            },

            customerId: response.customer_id,
            returnURL: 'fadeflow://payment-sheet',
            // Set `allowsDelayedPaymentMethods` to true if your business handles
            // delayed notification payment methods like US bank accounts.
            allowsDelayedPaymentMethods: true
         })
         if (error) {
            // Handle error
            console.log('error', error)
         } else {
            // Present the PaymentSheet
            const { error: paymentError } = await presentPaymentSheet()
            if (paymentError) {
               if (paymentError.code === PaymentSheetError.Canceled) {
                  return toastAlert({
                     title: 'Payment Canceled',
                     message: 'You have canceled the payment',
                     preset: 'error'
                  })
               } else if (paymentError.code === PaymentSheetError.Failed) {
                  return toastAlert({
                     title: 'Payment Failed',
                     message: 'Your payment failed',
                     preset: 'error'
                  })
               }
               // Handle error
               console.log('error', paymentError)
            } else {
               // Payment successful

               confettiRef.current?.triggerConfetti()
            }
         }
      } catch (error) {
         console.log(error)
      } finally {
         setLoading(false)
      }
   }, [])

   return (
      <StripeProvider
         publishableKey={process.env.EXPO_PUBLIC_STRIPE_TEST_PK as string}
         urlScheme="fadeflow"
         merchantIdentifier={process.env.EXPO_PUBLIC_MERCHANT_ID}
      >
         <View className="self-center">
            {loading ? (
               <ActivityIndicator size="large" />
            ) : (
               <Button
                  textStyle={{ paddingHorizontal: 16 }}
                  title={translation('subscription', 'button')}
                  onPress={onSubscribePress}
               />
            )}
            <ConfettiComponent ref={confettiRef} />
         </View>
      </StripeProvider>
   )
}

export default SubscriptionButton
