import * as Location from 'expo-location'
import { useEffect, useState } from 'react'

export const useLocation = () => {
   const [loading, setLoading] = useState<boolean>(false)
   const [location, setLocation] = useState<Location.LocationObject | null>(
      null
   )

   useEffect(() => {
      const fetchLocation = async () => {
         try {
            const { status } =
               await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') return
            setLoading(true)
            const location = await Location.getCurrentPositionAsync({
               accuracy: Location.Accuracy.Balanced
            })
            if (location) setLocation(location)
         } catch (error) {
            console.log(error)
         } finally {
            setLoading(false)
         }
      }
      fetchLocation()
   }, [])

   return { location, loading }
}
