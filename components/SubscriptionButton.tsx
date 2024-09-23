import { PaymentSheetError, StripeProvider, useStripe } from '@stripe/stripe-react-native';
import React, { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { createSubscrition } from '~/firebase-collections';
import { useUser } from '~/hooks/useUser';
import { toastAlert } from '~/lib/toast';
import { useColorScheme } from '~/lib/useColorScheme';
import { useAuth } from '~/providers/AuthContext';
import { PaymentIntentResponse } from '~/shared/types';
import { Button } from './Button';
import { ActivityIndicator } from './nativewindui/ActivityIndicator';
import ConfettiComponent, { ConfettiComponentRef } from './ConfettiComponent';

const SubscriptionButton = () => {
   const { initPaymentSheet, presentPaymentSheet } = useStripe();
   const { isDarkColorScheme, colors } = useColorScheme();
   const confettiRef = useRef<ConfettiComponentRef>(null);
   useUser();
   const { user } = useAuth();
   const [loading, setLoading] = useState(false);

   const onSubscrivePress = useCallback(async () => {
      try {
         if (!user?.email) return;
         setLoading(true);
         const { data } = await createSubscrition({ email: user.email });

         const { result, success } = data;
         if (!success) {
            return toastAlert({
               title: 'Error',
               message: result as string,
               preset: 'error',
            });
         }
         const response = result as PaymentIntentResponse;
         if (!response) {
            setLoading(false);
            return toastAlert({
               title: 'Error',
               message: 'Something went wrong',
               preset: 'error',
            });
         }

         const { error } = await initPaymentSheet({
            merchantDisplayName: `FadeFlow Inc`,
            paymentIntentClientSecret: response.clientSecret!,
            applePay: {
               merchantCountryCode: 'US',
            },
            primaryButtonLabel: 'Subscribe',

            appearance: {
               primaryButton: {
                  colors: {
                     background: colors.accent,
                     text: '#ffffff',
                  },
               },
               colors: {
                  background: colors.background,
                  primaryText: isDarkColorScheme ? '#ffffff' : '#212121',
               },
            },
            googlePay: {
               merchantCountryCode: 'US',
               currencyCode: 'usd',
               testEnv: true,
            },
            customerId: response.customer_id,
            returnURL: 'stripe-example://payment-sheet',
            // Set `allowsDelayedPaymentMethods` to true if your business handles
            // delayed notification payment methods like US bank accounts.
            allowsDelayedPaymentMethods: true,
         });
         if (error) {
            // Handle error
            console.log('error', error);
         } else {
            // Present the PaymentSheet
            const { error: paymentError } = await presentPaymentSheet();
            if (paymentError) {
               if (paymentError.code === PaymentSheetError.Canceled) {
                  return toastAlert({
                     title: 'Payment Canceled',
                     message: 'You have canceled the payment',
                     preset: 'error',
                  });
               } else if (paymentError.code === PaymentSheetError.Failed) {
                  return toastAlert({
                     title: 'Payment Failed',
                     message: 'Your payment failed',
                     preset: 'error',
                  });
               }
               // Handle error
               console.log('error', paymentError);
            } else {
               // Payment successful

               confettiRef.current?.triggerConfetti();
            }
         }
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false);
      }
   }, []);

   return (
      <StripeProvider
         publishableKey={process.env.EXPO_PUBLIC_STRIPE_TEST_PK as string}
         urlScheme="fadeflow"
         merchantIdentifier={process.env.EXPO_PUBLIC_MERCHANT_ID}>
         <View className="self-center">
            {loading ? (
               <ActivityIndicator size={'large'} />
            ) : (
               <Button
                  textStyle={{ paddingHorizontal: 16 }}
                  title="Susbcribe Now"
                  onPress={onSubscrivePress}
               />
            )}
            <ConfettiComponent ref={confettiRef} />
         </View>
      </StripeProvider>
   );
};

export default SubscriptionButton;
