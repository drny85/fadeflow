import { registerDevMenuItems } from 'expo-dev-menu'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'

export const useDevRoutes = () => {
   const router = useRouter()

   useEffect(() => {
      const devMenuItems = [
         {
            name: `Go to Sitemap`,
            callback: () => router.push('/_sitemap')
         }
      ]

      registerDevMenuItems(devMenuItems)
   }, [router])
}
