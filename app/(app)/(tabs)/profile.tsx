import { router } from 'expo-router'
import { View } from 'react-native'

import { Button } from '~/components/Button'
import { Container } from '~/components/Container'
import CustomerModernSettingsPage from '~/components/CustomerModernSettingsPage'
import LanguageSwitcher from '~/components/LanguagueSwitcher'
import Loading from '~/components/Loading'
import { Text } from '~/components/nativewindui/Text'
import { ThemeToggle } from '~/components/nativewindui/ThemeToggle'
import { useTranslate } from '~/hooks/useTranslation'
import { useAuth } from '~/providers/AuthContext'

const ProfilePage = () => {
   const translate = useTranslate()
   const { user, loading } = useAuth()

   if (loading) return <Loading />

   if (!user)
      return (
         <Container>
            <View className="flex-1">
               <View className="flex-row items-center justify-evenly mt-2">
                  <ThemeToggle />
                  <LanguageSwitcher />
               </View>

               <View className="flex-1 items-center justify-center gap-7">
                  <Text className="font-raleway text-xl text-muted dark:text-white">
                     {translate('login.no_login', { name: 'tu perfil' })}
                  </Text>

                  <Button
                     title={translate('login.button')}
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
