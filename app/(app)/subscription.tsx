import { Redirect } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import SubscriptionButton from '~/components/SubscriptionButton';
import { Text } from '~/components/nativewindui/Text';
import { useAuth } from '~/providers/AuthContext';

const SubscriptionPage = () => {
   const { user } = useAuth();

   if (user?.isBarber && user.subscriptionStatus === 'active')
      return <Redirect href={'/(barber-tabs)'} />;
   return (
      <ScrollView className="flex-1 bg-background" contentContainerClassName="items-center">
         {/* <View className="flex-1 items-center justify-center gap-5">
            <View className="items-center rounded-lg bg-card p-10 shadow-md">
               <View className="gap-2 p-3">
                  <Text variant={'title1'}>FadeFlow</Text>
                  <Text className="text-[46px] font-bold">$10</Text>
                  <Text variant={'caption1'}>Billed every month</Text>
               </View>
            </View>
            <SubscriptionButton />
         </View> */}
         <View className="rounded-lg bg-background p-6">
            <Text className="text-center font-raleway-bold text-xl text-gray-900 dark:text-white">
               Boost Your Barber Business with FadeFlow App
            </Text>

            <View className="my-2 items-center justify-center rounded-lg bg-card p-10 shadow-md">
               <View className="gap-2 p-3">
                  <Text variant={'title1'}>FadeFlow</Text>
                  <Text className="text-[46px] font-bold">$10</Text>
                  <Text variant={'caption1'}>Billed every month</Text>
               </View>
            </View>

            <Text className="mt-2 text-base text-gray-700 dark:text-white">
               <Text className="font-semibold"> 14-Day Free Trial</Text> – Try all premium features
               risk-free!
            </Text>
            <View className="mt-4 gap-3">
               <Text className="text-base text-gray-700 dark:text-white">
                  <Text className="font-semibold">Exclusive Benefits:</Text> Gain more visibility,
                  accept priority bookings, and access advanced client management tools.
               </Text>

               <Text className="mt-2  text-base text-gray-700 dark:text-white">
                  <Text className="font-semibold">Business Insights:</Text> Track your earnings,
                  manage your schedule, and boost your appointments with advanced analytics.
               </Text>

               <Text className="mt-2 text-base text-gray-700 dark:text-white">
                  Cancel Anytime – No long-term commitment.
               </Text>
            </View>
            <View className="mt-6">
               <SubscriptionButton />
            </View>
         </View>
      </ScrollView>
   );
};

export default SubscriptionPage;
