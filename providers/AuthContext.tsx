import {
   createUserWithEmailAndPassword,
   onAuthStateChanged,
   signInWithEmailAndPassword,
   signOut,
   UserCredential
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import React, { createContext, ReactNode, useEffect, useState } from 'react'

import { auth } from '~/firebase'
import { usersCollection } from '~/firebase-collections'
import { toastAlert } from '~/lib/toast'
import { AppUser } from '~/shared/types'
import { FIREBASE_ERRORS } from '~/utils/firebaseErrorMessages'

type AuthContextType = {
   user: AppUser | null
   signIn: (email: string, password: string) => Promise<UserCredential>
   signUp: (
      email: string,
      password: string,
      isBarber: boolean
   ) => Promise<UserCredential>
   createUser: (user: AppUser) => Promise<boolean>
   logOut: () => Promise<void>
   loading: boolean
   setUser: (user: AppUser | null) => void
   checkIfUserAlreadyExist: (userId: string, user: AppUser) => Promise<boolean>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
   children
}) => {
   const [loading, setLoading] = useState(false)
   const [user, setUser] = useState<AppUser | null>(null)

   useEffect(() => {
      return onAuthStateChanged(auth, async (authUser) => {
         setLoading(true)
         try {
            if (authUser) {
               const { uid } = authUser

               const userDoc = doc(usersCollection, uid)
               const data = await getDoc(userDoc)

               const userData = {
                  id: data.id,
                  ...data.data()
               }
               console.log('EMAIL VERIFIED => ', authUser?.emailVerified)
               setUser({
                  ...userData,
                  emailVerified: authUser.emailVerified
               } as AppUser)
            } else {
               setUser(null)
            }
         } catch (error) {
            console.log(error)
         } finally {
            setLoading(false)
         }
      })
   }, [])

   const signIn = async (email: string, password: string) => {
      try {
         return await signInWithEmailAndPassword(auth, email, password)
      } catch (error) {
         const err = error as Error
         console.log(err.message)
         console.log('Error @signIn =>', FIREBASE_ERRORS[err.message])

         toastAlert({
            title: 'Sign In Error',
            message: FIREBASE_ERRORS[err.message],
            preset: 'error'
         })
         return Promise.reject(error)
      }
   }

   const signUp = async (email: string, password: string) => {
      return await createUserWithEmailAndPassword(auth, email, password)
   }

   const logOut = async () => {
      await signOut(auth)
   }

   const createUser = async (user: AppUser) => {
      try {
         await setDoc(doc(usersCollection, user.id), user)
         return true
      } catch (error) {
         console.log(error)
         return false
      }
   }

   const checkIfUserAlreadyExist = async (
      userId: string,
      user: AppUser
   ): Promise<boolean> => {
      try {
         const userRef = doc(usersCollection, userId)
         const userData = await getDoc(userRef)
         if (userData.exists()) {
            return true
         } else {
            await createUser(user)
            return true
         }
      } catch (error) {
         console.log(error)
         return false
      }
   }

   const authContextValue: AuthContextType = {
      user,
      signIn,
      signUp,
      logOut,
      createUser,
      loading,
      setUser,
      checkIfUserAlreadyExist
   }

   return (
      <AuthContext.Provider value={authContextValue}>
         {children}
      </AuthContext.Provider>
   )
}

export const useAuth = () => {
   const context = React.useContext(AuthContext)
   if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider')
   }
   return context
}
