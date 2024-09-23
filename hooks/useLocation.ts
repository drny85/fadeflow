import * as Location from 'expo-location'
import { useEffect, useState } from 'react'

export const useLocation = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>(
        null
    )
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        ;(async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') return
            setLoading(true)
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced
            })
            setLocation(location)
            setLoading(false)
        })()
    }, [])

    return { location, loading }
}
