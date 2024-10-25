import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import LoginForm from '~/components/Forms/LoginForm'
import SignupForm from '~/components/Forms/SignupForm'
import SignInComponent from '~/components/Forms/SocialMediaLogin'
import KeyboardScreen from '~/components/KeyboardScreen'
import Loading from '~/components/Loading'
import { Text } from '~/components/nativewindui/Text'
import { useTranslate } from '~/hooks/useTranslation'
import { useColorScheme } from '~/lib/useColorScheme'
import { useAuth } from '~/providers/AuthContext'

type Props = {
   mode: 'login' | 'register'
   isBarber?: string
}
const LoginScreen = () => {
   const translate = useTranslate()
   const [isSignUp, setIsSignUp] = useState(false)
   const { loading } = useAuth()
   const { colors } = useColorScheme()
   const { mode, isBarber } = useLocalSearchParams<Props>()
   useEffect(() => {
      if (mode === 'register') setIsSignUp(true)
   }, [mode])

   if (loading) return <Loading />

   return (
      <KeyboardScreen style={styles.container}>
         <Text className="text-center" variant="title1">
            {translate('signup.title')}
         </Text>

         <View style={styles.authSwitch}>
            <TouchableOpacity
               onPress={() => {
                  setIsSignUp(false)

                  router.setParams({ isBarber: undefined })
               }}
               style={
                  !isSignUp
                     ? {
                          ...styles.activeTab,
                          borderBottomColor: colors.accent
                       }
                     : styles.inactiveTab
               }
            >
               <Text
                  style={
                     !isSignUp ? styles.activeTabText : styles.inactiveTabText
                  }
               >
                  {translate('signup.login')}
               </Text>
            </TouchableOpacity>
            <TouchableOpacity
               onPress={() => {
                  setIsSignUp(true)
               }}
               style={
                  isSignUp
                     ? {
                          ...styles.activeTab,
                          borderBottomColor: colors.accent
                       }
                     : styles.inactiveTab
               }
            >
               <Text
                  style={
                     isSignUp ? styles.activeTabText : styles.inactiveTabText
                  }
               >
                  {translate('signup.signup')}
               </Text>
            </TouchableOpacity>
         </View>

         {isSignUp ? (
            <SignupForm isBarber={isBarber !== undefined} />
         ) : (
            <View>
               <LoginForm />
               <View className="flex-row items-center gap-3 justify-center mb-2">
                  <View className="h-[1px] bg-slate-300 w-1/3" />
                  <Text className="text-center">or</Text>
                  <View className="h-[1px] bg-slate-300 w-1/3" />
               </View>
               <SignInComponent isBarber={isBarber !== undefined} />
            </View>
         )}
      </KeyboardScreen>
   )
}

export default LoginScreen

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
      gap: 20
   },

   authSwitch: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 20
   },
   activeTab: {
      borderBottomWidth: 2,
      paddingBottom: 10,
      marginRight: 20
   },
   inactiveTab: {
      paddingBottom: 10,
      marginRight: 20
   },
   activeTabText: {
      fontWeight: 'bold',
      fontSize: 18
   },
   inactiveTabText: {
      color: '#888',
      fontSize: 16
   },
   input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      padding: 15,
      marginBottom: 20,
      fontFamily: 'Roboto'
   },
   signInButton: {
      backgroundColor: '#F9A825',
      borderRadius: 5,
      padding: 15,
      alignItems: 'center',
      marginBottom: 20
   },
   signInButtonText: {
      fontSize: 16,
      fontWeight: 'bold'
   },
   orText: {
      textAlign: 'center',
      color: '#888',
      marginBottom: 20
   },
   socialLoginContainer: {
      marginTop: 10,
      flexDirection: 'row',
      justifyContent: 'space-between'
   },
   socialButton: {
      flex: 1,
      padding: 10,
      borderRadius: 5,
      backgroundColor: '#4285F4',
      alignItems: 'center',
      marginHorizontal: 5
   },
   socialButtonText: {
      fontWeight: 'bold'
   }
})
