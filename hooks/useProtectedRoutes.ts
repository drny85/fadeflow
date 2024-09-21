import { addDays, differenceInDays } from 'date-fns';
import { useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuth } from '~/providers/AuthContext';
import { useUser } from './useUser';

export function useProtectedRoute() {
   const segments = useSegments();
   const router = useRouter();
   useUser();
   const [mounted, setMounted] = useState(false);
   const { loading, user } = useAuth();

   useEffect(() => {
      setMounted(true);
   }, [loading]);

   useEffect(() => {
      if (!mounted) return;
      const daysRemaining = differenceInDays(addDays(user?.createdAt!, 14), new Date());
      const inAuthGroup = segments[1] === '(auth)';
      const inBarberGroup = segments[1] === '(barber-tabs)';
      const inUserGroup = segments[1] === '(tabs)';
      console.log(daysRemaining, 'DAYS REMAINING');

      // Redirect non-signed-in users trying to access protected routes
      if (user && inAuthGroup && !user.isBarber) {
         console.log('TABS');
         // Redirect signed-in non-barber users away from the sign-in page
         router.replace('/(tabs)');
      } else if (
         user &&
         inBarberGroup &&
         user.isBarber &&
         user.subscriptionStatus === 'incomplete' &&
         daysRemaining <= 13
      ) {
         router.replace('/subscription');
      } else if (user && inAuthGroup && user.isBarber) {
         router.replace('/(barber-tabs)');
      } else if (user && inBarberGroup && !user.isBarber) {
         router.replace('/(tabs)');
      } else if (user && inUserGroup && user.isBarber) {
         console.log('BARBER TABS 2');
         router.replace('/(barber-tabs)');
      }
   }, [user, segments, mounted]);

   return { mounted };
}
