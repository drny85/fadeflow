import { addDays, differenceInDays } from 'date-fns'
import { useRouter, useSegments } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useUser } from './useUser'

import { updateUser } from '~/actions/users'
import { useAuth } from '~/providers/AuthContext'
import { checkObjectValues } from '~/utils/checkObjectValues'

export function useProtectedRoute() {
    const segments = useSegments()
    const router = useRouter()
    useUser()
    const [mounted, setMounted] = useState(false)
    const { loading, user } = useAuth()
    const daysRemaining = useMemo(() => {
        return user?.isBarber && user?.subscriptionStatus === 'incomplete'
            ? differenceInDays(addDays(user?.createdAt!, 14), new Date())
            : 0
    }, [user])

    const profileCompleted = useMemo(() => {
        return user && user?.isBarber && user?.profileCompleted
    }, [user])

    const updateProfileIsIncomplete = useCallback(async () => {
        if (user && user.isBarber && user.profile) {
            const isIncomplete = checkObjectValues(user.profile, ['apt', 'bio'])
            console.log('Is complete =>', isIncomplete)

            if (isIncomplete) return

            updateUser({ ...user, profileCompleted: false })
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
        console.log(daysRemaining, 'DAYS REMAINING', segments[1])
        updateProfileIsIncomplete()

        // Redirect non-signed-in users trying to access protected routes
        if (user && inAuthGroup && !user.isBarber) {
            // Redirect signed-in non-barber users away from the sign-in page
            console.log('00')
            router.replace('/(tabs)')
        } else if (user && user.isBarber && inUserGroup) {
            console.log('01')
            router.replace('/(barber-tabs)')
        } else if (
            user &&
            inBarberGroup &&
            user.isBarber &&
            user.subscriptionStatus === 'incomplete' &&
            daysRemaining <= 0
        ) {
            console.log('0')
            router.replace('/subscription')
        } else if (
            user &&
            inBarberGroup &&
            user.isBarber &&
            !profileCompleted
        ) {
            console.log('1')
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
        }
    }, [user, segments, mounted, daysRemaining, profileCompleted])

    return { mounted }
}
