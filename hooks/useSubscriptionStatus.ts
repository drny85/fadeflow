import { useEffect, useState } from 'react';
import { getSubscriptionStatus } from '~/firebase-collections';
import { useAuth } from '~/providers/AuthContext';

export const useSubscriptionStatus = () => {
   const [loading, setLoading] = useState(false);
   const [isSubscribed, setIsSubscribed] = useState(false);
   const { user } = useAuth();
   useEffect(() => {
      if (!user) return;
      const checkSubscription = async () => {
         setLoading(true);
         try {
            if (user) {
               //   const getSubscriptionStatus = httpsCallable(functions, 'getSubscriptionStatus');
               const { data } = await getSubscriptionStatus();
               if (data.isSubscribed) {
                  setIsSubscribed(true);
               } else {
                  //createCheckoutSession();
               }
            }
         } catch (error) {
            console.error(error);
         } finally {
            setLoading(false);
         }
      };

      checkSubscription();
   }, [user]);

   return {
      loading,
      isSubscribed,
   };
};
