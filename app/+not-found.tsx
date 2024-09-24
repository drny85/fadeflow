import { Link, Redirect, Stack, usePathname } from 'expo-router'
import { Text, View } from 'react-native'

export default function NotFoundScreen() {
   const path = usePathname()
   console.log({ path })
   if (path.includes('barbers'))
      return <Redirect href="/(app)/(barbers)/barbers-screen" />
   if (path.includes('stripe-redirect'))
      return <Redirect href="/(app)/(barber-tabs)/barber-profile" />
   return (
      <>
         <Stack.Screen options={{ title: 'Oops!' }} />
         <View className={styles.container}>
            <Text className={styles.title}>This screen doesn't exist.</Text>
            <Link href="/(app)/(tabs)" className={styles.link}>
               <Text className={styles.linkText}>Go to home screen!</Text>
            </Link>
         </View>
      </>
   )
}

const styles = {
   container: `items-center flex-1 justify-center p-5`,
   title: `text-xl font-bold`,
   link: `mt-4 pt-4`,
   linkText: `text-base text-[#2e78b7]`
}
