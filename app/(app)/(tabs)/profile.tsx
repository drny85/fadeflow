import { router } from 'expo-router'
import { View } from 'react-native'
import BlockTime from '~/components/Appointment/BlockTime'

import { Button } from '~/components/Button'
import { Container } from '~/components/Container'
import CustomerModernSettingsPage from '~/components/CustomerModernSettingsPage'
import Loading from '~/components/Loading'
import { Text } from '~/components/nativewindui/Text'
import { ThemeToggle } from '~/components/nativewindui/ThemeToggle'
import { initialBlockedDates } from '~/constants'
import { useAuth } from '~/providers/AuthContext'
import { BlockTimeParams } from '~/shared/types'

const ProfilePage = () => {
   const { user, loading } = useAuth()
   const handleBlockTimeChange = (updatedBlockTimes: BlockTimeParams[]) => {
      console.log(
         'Updated Block Times:',
         JSON.stringify(updatedBlockTimes, null, 2)
      )
      // Save or process the updated block times here
   }

   if (loading) return <Loading />

   return (
      <BlockTime
         initialBlockTimes={initialBlockedDates}
         onBlockTimeChange={handleBlockTimeChange}
      />
   )
   if (!user)
      return (
         <Container>
            <View className="flex-1">
               <ThemeToggle />
               <View className="flex-1 items-center justify-center gap-7">
                  <Text className="font-raleway text-xl text-muted dark:text-white">
                     Please login to see your profile page
                  </Text>

                  <Button
                     title="Login"
                     textStyle={{ paddingHorizontal: 24 }}
                     onPress={() =>
                        router.push({
                           pathname: '/login',
                           params: { returnUrl: '/profile' }
                        })
                     }
                  />
               </View>
            </View>
         </Container>
      )

   return <CustomerModernSettingsPage />
}

export default ProfilePage
