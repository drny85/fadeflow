import { addDays, differenceInDays } from 'date-fns';
import { useRouter, useSegments } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '~/providers/AuthContext';
import { useUser } from './useUser';
import { checkObjectValues } from '~/utils/checkObjectValues';
import { updateUser } from '~/actions/users';

export function useProtectedRoute() {
   const segments = useSegments();
   const router = useRouter();
   useUser();
   const [mounted, setMounted] = useState(false);
   const { loading, user } = useAuth();
   const daysRemaining = useMemo(() => {
      return user?.isBarber && user?.subscriptionStatus === 'incomplete'
         ? differenceInDays(addDays(user?.createdAt!, 14), new Date())
         : 0;
   }, [user]);

   const profileCompleted = useMemo(() => {
      return user && user?.isBarber && user?.profileCompleted;
   }, [user]);

   const updateProfileIsIncomplete = useCallback(async () => {
      if (user && user.isBarber && user.profile) {
         const isIncomplete = checkObjectValues(user.profile, 'apt');

         if (isIncomplete) return;

         updateUser({ ...user, profileCompleted: false });
         // Update the user's profile as incomplete
         // You can use a database or storage service to store this information
      }
   }, [user]);

   useEffect(() => {
      setMounted(true);
   }, [loading]);

   useEffect(() => {
      if (!mounted) return;

      const inAuthGroup = segments[1] === '(auth)';
      const inBarberGroup = segments[1] === '(barber-tabs)';
      const inUserGroup = segments[1] === '(tabs)';
      console.log(daysRemaining, 'DAYS REMAINING');
      updateProfileIsIncomplete();

      // Redirect non-signed-in users trying to access protected routes
      if (user && inAuthGroup && !user.isBarber) {
         // Redirect signed-in non-barber users away from the sign-in page
         router.replace('/(tabs)');
      } else if (
         user &&
         inBarberGroup &&
         user.isBarber &&
         user.subscriptionStatus === 'incomplete' &&
         daysRemaining <= 0
      ) {
         router.replace('/subscription');
      } else if (user && inBarberGroup && user.isBarber && !profileCompleted) {
         router.push('/profile-complition');
      } else if (user && inAuthGroup && user.isBarber && profileCompleted) {
         router.replace('/(barber-tabs)');
      } else if (user && inBarberGroup && !user.isBarber) {
         router.replace('/(tabs)');
      } else if (user && inUserGroup && user.isBarber && profileCompleted) {
         console.log('BARBER TABS 2');
         router.replace('/(barber-tabs)');
      }
   }, [user, segments, mounted, daysRemaining, profileCompleted]);

   return { mounted };
}
