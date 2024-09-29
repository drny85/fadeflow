import * as AppleAuthentication from 'expo-apple-authentication'
import * as Google from 'expo-auth-session/providers/google'
import {
   GoogleAuthProvider,
   OAuthProvider,
   signInWithCredential
} from 'firebase/auth'
import React from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'

import { AntDesign } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import { DEFAULT_SCHEDULE } from '~/constants'
import { auth } from '~/firebase'
import { useAuth } from '~/providers/AuthContext'
import { AppUser } from '~/shared/types'
import { router, useLocalSearchParams } from 'expo-router'
import { Image } from 'expo-image'
WebBrowser.maybeCompleteAuthSession()

const ANDROID = process.env.EXPO_PUBLIC_WEB_CLIENT_ID
const IOS = process.env.EXPO_PUBLIC_IOS_CLIENT_ID
const WEB = process.env.EXPO_PUBLIC_WEB_CLIENT_ID

type Props = {
   isBarber: boolean
}

const SignInComponent: React.FC<Props> = ({ isBarber }) => {
   console.log('IS_BARBER', isBarber)
   const { checkIfUserAlreadyExist } = useAuth()
   const params = useLocalSearchParams()
   const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
      clientId:
         '684619283478-as75l839r8m8m2d942oqgu57m98mrldg.apps.googleusercontent.com',

      iosClientId: IOS,
      androidClientId: ANDROID,
      scopes: ['openid', 'profile', 'email'],
      webClientId: WEB
   })

   // Google Sign In handler
   React.useEffect(() => {
      if (response?.type === 'success') {
         const { id_token } = response.params
         const googleCredential = GoogleAuthProvider.credential(id_token)
         signInWithCredential(auth, googleCredential)
            .then(async ({ user }) => {
               // Successfully signed in with Google

               if (!user) return
               const { uid, displayName, email, photoURL, phoneNumber } = user
               let newUser: AppUser
               if (isBarber) {
                  newUser = {
                     id: uid,
                     name: displayName || '',
                     email: email || '',
                     image: photoURL || null,
                     isBarber: true,
                     isActive: true,
                     pushToken: null,
                     gallery: [],
                     minutesInterval: 15,
                     isAvailable: true,
                     bio: '',
                     phone: phoneNumber || '',
                     subscriptionStatus: 'trialing',
                     schedule: DEFAULT_SCHEDULE,
                     profileCompleted: false,
                     profile: null,
                     createdAt: new Date().toISOString()
                  }
               } else {
                  newUser = {
                     id: uid,
                     name: displayName || '',
                     phone: phoneNumber || '',
                     email: email || '',
                     image: photoURL || null,
                     isBarber: false,
                     favoriteBarber: null,
                     pushToken: null,
                     createdAt: new Date().toISOString()
                  }
               }

               const created = await checkIfUserAlreadyExist(uid, newUser)

               if (created) {
                  if (params && params.returnUrl) {
                     router.canDismiss() && router.dismiss()
                     router.replace(params.returnUrl as any)
                  }
               }
            })
            .catch((error) => {
               console.error('Error with Google login:', error)
            })
      }
   }, [response])

   // Apple Sign In handler
   const signInWithApple = async () => {
      try {
         const appleCredential = await AppleAuthentication.signInAsync({
            requestedScopes: [
               AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
               AppleAuthentication.AppleAuthenticationScope.EMAIL
            ]
         })

         const { identityToken } = appleCredential
         const provider = new OAuthProvider('apple.com')
         const credential = provider.credential({
            idToken: identityToken!,
            rawNonce: 'nonce'
         })

         signInWithCredential(auth, credential)
            .then((userCredential) => {
               // Successfully signed in with Apple
               console.log('User logged in:', userCredential.user)
            })
            .catch((error) => {
               console.error('Error with Apple login:', error)
            })
      } catch (error) {
         console.error('Error with Apple login:', error)
      }
   }

   return (
      <View style={styles.container}>
         <TouchableOpacity
            disabled={!request}
            onPress={() => {
               promptAsync()
            }}
         >
            <Image
               source={require('~/assets/images/google.png')}
               style={styles.appleButton}
            />
         </TouchableOpacity>

         {Platform.OS === 'ios' && (
            <AppleAuthentication.AppleAuthenticationButton
               buttonType={
                  AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
               }
               buttonStyle={
                  AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
               }
               cornerRadius={60}
               style={styles.appleButton}
               onPress={signInWithApple}
            />
         )}
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: 32
   },
   appleButton: {
      width: 50,
      height: 50
   }
})

export default SignInComponent