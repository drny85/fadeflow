import { View } from 'react-native';
import React from 'react';
import SubscriptionButton from '~/components/SubscriptionButton';
import { Text } from '~/components/nativewindui/Text';
import { useAuth } from '~/providers/AuthContext';
import { Redirect } from 'expo-router';

const SubscriptionPage = () => {
   const { user } = useAuth();
   if (user?.isBarber && user.subscriptionStatus === 'active')
      return <Redirect href={'/(barber-tabs)'} />;
   return (
      <View className="flex-1 items-center justify-center gap-5">
         <View className="items-center rounded-md bg-card p-6 shadow-md">
            <View className="gap-2 p-3">
               <Text variant={'title1'}>FadeFlow</Text>
               <Text className="text-[46px] font-bold">$10</Text>
               <Text variant={'caption1'}>Billed every month</Text>
            </View>
         </View>
         <SubscriptionButton />
      </View>
   );
};

export default SubscriptionPage;
