import { addDays, differenceInDays } from 'date-fns'
import { useRouter, useSegments } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useUser } from './useUser'

import { updateUser } from '~/actions/users'
import { useAuth } from '~/providers/AuthContext'
import { checkObjectValues } from '~/utils/checkObjectValues'
const DAYS = process.env.EXPO_PUBLIC_FREE_TRIAL_DAYS as string

export function useProtectedRoute() {
   const segments = useSegments()
   const router = useRouter()
   useUser()
   const [mounted, setMounted] = useState(false)
   const { loading, user } = useAuth()
   const daysRemaining = useMemo(() => {
      return user?.isBarber && user?.subscriptionStatus === 'trialing'
         ? differenceInDays(addDays(user?.createdAt!, +DAYS), new Date())
         : 0
   }, [user])

   const profileCompleted = useMemo(() => {
      if (!user) return false
      if (!user?.isBarber) return false
      return user?.profileCompleted
   }, [user])

   const updateProfileIsIncomplete = useCallback(async () => {
      if (user && user.isBarber && user.profile) {
         const isIncomplete = checkObjectValues(user.profile, ['apt', 'bio'])

         if (isIncomplete) return

         updateUser({ ...user, profileCompleted: false })
         console.log('updated user profile to false')
         // Update the user's profile as incomplete
         // You can use a database or storage service to store this information
      }
   }, [user])

   useEffect(() => {
      setMounted(true)
   }, [loading])

   useEffect(() => {
      if (!mounted) return

      const inAuthGroup = segments[1] === '(auth)'
      const inBarberGroup = segments[1] === '(barber-tabs)'
      const inUserGroup = segments[1] === '(tabs)'
      console.log('SEGMENTS', segments[1])
      console.log('COMPLETED', profileCompleted)

      updateProfileIsIncomplete()

      if (inAuthGroup && user && !user.isBarber) {
         // Redirect signed-in non-barber users away from the sign-in page
         console.log('00')
         router.replace('/(tabs)')
      } else if (user && user.isBarber && inUserGroup && profileCompleted) {
         console.log(`01 => redirected from ${segments[1]}`)
         router.replace('/(barber-tabs)')
      } else if (user && inBarberGroup && user.isBarber && !profileCompleted) {
         console.log('1-----')
         router.push('/profile-complition')
      } else if (user && inAuthGroup && user.isBarber && profileCompleted) {
         console.log('2')
         router.replace('/(barber-tabs)')
      } else if (user && inBarberGroup && !user.isBarber) {
         console.log('3')
         router.replace('/(tabs)')
      } else if (user && inUserGroup && user.isBarber && profileCompleted) {
         console.log('BARBER TABS 2')
         router.replace('/(barber-tabs)')

         //router.replace('/(barber-tabs)')
      } else {
         console.log('no match')
      }
   }, [user, segments, daysRemaining, profileCompleted])

   return { mounted }
}
