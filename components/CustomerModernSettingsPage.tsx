import {
   AntDesign,
   Feather,
   FontAwesome,
   FontAwesome6,
   Ionicons
} from '@expo/vector-icons'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { BlurView } from 'expo-blur'
import Constants from 'expo-constants'
import { ImageBackground } from 'expo-image'
import * as Linking from 'expo-linking'
import { router } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import {
   Alert,
   Button,
   Keyboard,
   StyleSheet,
   TouchableOpacity,
   View
} from 'react-native'

import { Container } from './Container'
import LanguageSwitcher from './LanguagueSwitcher'
import ParallaxScrollView from './ParallaxScrollView'
import { ActivityIndicator } from './nativewindui/ActivityIndicator'
import { Sheet, useSheetRef } from './nativewindui/Sheet'
import { Text } from './nativewindui/Text'
import { ThemeToggle } from './nativewindui/ThemeToggle'

import { updateUser } from '~/actions/users'
import { SIZES } from '~/constants'
import { deleteUserFunction } from '~/firebase-collections'
import { usePhoto } from '~/hooks/usePhoto'
import { useTranslate } from '~/hooks/useTranslation'
import { useColorScheme } from '~/lib/useColorScheme'
import { useAuth } from '~/providers/AuthContext'
import { formatPhone } from '~/utils/formatPhone'
import LogoutButton from './LogoutButton'

const IMAGE_HEIGHT = 100
export default function CustomerModernSettingsPage() {
   const translate = useTranslate()
   const { user, logOut } = useAuth()
   const [loading, setLoading] = useState(false)
   const [view, setView] = useState<
      'schedule' | 'services' | 'user-update' | undefined
   >(undefined)

   const { photo, selectedImage, handleImageUpload, resetAll, uploadPhoto } =
      usePhoto()
   const { colors } = useColorScheme()

   const bottomSheetRef = useSheetRef()
   const snapoints = useMemo(() => ['80%'], [])
   const [name, setName] = useState('')
   const [phone, setPhone] = useState('')

   const deleteAccount = async () => {
      try {
         setLoading(true)
         const { data } = await deleteUserFunction()

         if (data.success) {
            logOut()
            Alert.alert('Account Deleted', 'Your account has been deleted.')
         } else {
            Alert.alert('Error', 'There was an error deleting your account.')
         }
      } catch (error) {
         console.log('Error deleteing account', error)
      } finally {
         setLoading(false)
      }
   }

   const handleDeleteAccount = async () => {
      try {
         Alert.alert(
            translate('profile.confirmation.delete.title'),
            translate('profile.confirmation.delete.message'),
            [
               {
                  text: translate('profile.confirmation.delete.yes'),
                  style: 'destructive',
                  onPress: deleteAccount
               },
               { text: 'No', style: 'cancel' }
            ]
         )
      } catch (error) {
         console.log(error)
      }
   }

   const resetForm = () => {
      Keyboard.dismiss()
      setName('')
      setPhone('')
      bottomSheetRef.current?.close()
   }

   useEffect(() => {
      if (user) {
         setName(user.name!)
         setPhone(formatPhone(user.phone!))
      }
   }, [user])

   useEffect(() => {
      if (!photo || !user) return
      if (selectedImage) {
         updateUser({ ...user, image: selectedImage })
         resetAll()
      }

      if (photo && photo?.assets![0].uri && !selectedImage) {
         uploadPhoto(photo, user?.id!)
      }
   }, [photo, selectedImage])

   if (loading)
      return (
         <Container>
            <View className="flex-1 items-center justify-center gap-5">
               <Text className="text-2xl font-semibold">Deleting Account</Text>
               <ActivityIndicator size="large" />
            </View>
         </Container>
      )

   return (
      <ParallaxScrollView
         headerBackgroundColor={{
            light: colors.grey4,
            dark: colors.background
         }}
         headerImage={
            <ImageBackground
               style={{
                  height: SIZES.height * 0.4,
                  width: '100%'
               }}
               imageStyle={{
                  objectFit: 'cover'
               }}
               source={
                  !user?.image
                     ? require('~/assets/images/banner.png')
                     : {
                          uri: user.image
                       }
               }
            >
               <View
                  style={{
                     position: 'absolute',
                     top: Constants.statusBarHeight,
                     flexDirection: 'row',
                     justifyContent: 'space-between',
                     paddingHorizontal: 10,
                     width: '100%'
                  }}
               >
                  <TouchableOpacity
                     className="h-10 w-10 items-center justify-center rounded-full bg-accent"
                     onPress={handleImageUpload}
                  >
                     <AntDesign name="edit" size={24} color="white" />
                  </TouchableOpacity>
                  <LogoutButton />
               </View>
               <BlurView
                  tint="prominent"
                  intensity={60}
                  className="absolute bottom-0 left-0 right-0 flex-1 overflow-hidden rounded-md p-2"
               >
                  <View>
                     <Text className="text-xl text-slate-200 dark:text-white">
                        {user?.name}
                     </Text>
                     <Text className="text-sm text-slate-300 dark:text-white">
                        {user?.phone}
                     </Text>
                     <Text className="text-sm text-slate-300 dark:text-white">
                        {user?.email}
                     </Text>
                  </View>
               </BlurView>
            </ImageBackground>
         }
      >
         <View>
            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Preferences</Text>
               <View style={[styles.row, { backgroundColor: colors.card }]}>
                  <View
                     style={[
                        styles.rowIcon,
                        { backgroundColor: colors.accent }
                     ]}
                  >
                     <Feather color="#fff" name="moon" size={20} />
                  </View>

                  <Text style={styles.rowLabel}>
                     {translate('profile.theme')}
                  </Text>

                  <View style={styles.rowSpacer} />

                  <ThemeToggle />
               </View>
               <View style={[styles.row, { backgroundColor: colors.card }]}>
                  <View
                     style={[
                        styles.rowIcon,
                        { backgroundColor: colors.primary }
                     ]}
                  >
                     <FontAwesome name="language" size={24} color="#ffffff" />
                  </View>

                  <Text style={styles.rowLabel}>
                     {translate('profile.language')}
                  </Text>

                  <View style={styles.rowSpacer} />

                  <View>
                     <LanguageSwitcher />
                  </View>
               </View>

               <TouchableOpacity
                  onPress={() => {
                     // handle onPress
                     setView('user-update')
                     bottomSheetRef.current?.present()
                  }}
                  style={[styles.row, { backgroundColor: colors.card }]}
               >
                  <View
                     style={[
                        styles.rowIcon,
                        { backgroundColor: colors.destructive }
                     ]}
                  >
                     <Feather color="#fff" name="user" size={20} />
                  </View>

                  <Text style={styles.rowLabel}>
                     {translate('profile.name')}
                  </Text>

                  <View style={styles.rowSpacer} />

                  <Feather color="#C6C6C6" name="chevron-right" size={20} />
               </TouchableOpacity>
            </View>

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Resources</Text>

               <TouchableOpacity
                  onPress={() => {
                     // handle onPress
                     Linking.canOpenURL(
                        `mailto:${process.env.EXPO_PUBLIC_CONTACT_EMAIL}`
                     )
                        .then((supported) => {
                           if (supported) {
                              Linking.openURL(
                                 `mailto:${process.env.EXPO_PUBLIC_CONTACT_EMAIL}`
                              )
                           } else {
                              console.log(
                                 "Don't know how to open URI: " +
                                    process.env.EXPO_PUBLIC_CONTACT_EMAIL
                              )
                           }
                        })
                        .catch((err) => console.error('An error occurred', err))
                  }}
                  style={[styles.row, { backgroundColor: colors.card }]}
               >
                  <View
                     style={[styles.rowIcon, { backgroundColor: '#007afe' }]}
                  >
                     <Feather color="#fff" name="mail" size={20} />
                  </View>

                  <Text style={styles.rowLabel}>
                     {translate('profile.contact')}
                  </Text>

                  <View style={styles.rowSpacer} />

                  <Feather color="#C6C6C6" name="chevron-right" size={20} />
               </TouchableOpacity>
            </View>
            <View style={styles.section}>
               <Text style={styles.sectionTitle}>
                  {translate('profile.privacy')}
               </Text>
               <TouchableOpacity
                  onPress={() => {
                     // handle onPress
                     // router.push('/terms');
                     router.push('/customer-terms')
                  }}
                  style={[styles.row, { backgroundColor: colors.card }]}
               >
                  <View
                     style={[styles.rowIcon, { backgroundColor: 'royalblue' }]}
                  >
                     <FontAwesome6
                        name="file-contract"
                        size={24}
                        color="#ffffff"
                     />
                  </View>

                  <Text style={styles.rowLabel}>
                     {translate('profile.terms')}
                  </Text>

                  <View style={styles.rowSpacer} />

                  <Feather color="#C6C6C6" name="chevron-right" size={20} />
               </TouchableOpacity>
               <TouchableOpacity
                  onPress={() => {
                     // handle onPress
                     // router.push('/privacy')
                     router.push('/customer-policy')
                  }}
                  style={[styles.row, { backgroundColor: colors.card }]}
               >
                  <View style={[styles.rowIcon, { backgroundColor: 'red' }]}>
                     <Feather color="#fff" name="user-x" size={20} />
                  </View>

                  <Text style={styles.rowLabel}>
                     {translate('profile.privacy')}
                  </Text>

                  <View style={styles.rowSpacer} />

                  <Feather color="#C6C6C6" name="chevron-right" size={20} />
               </TouchableOpacity>
               <View
                  style={[
                     styles.row,
                     {
                        backgroundColor: colors.card,
                        marginBottom: 80
                     }
                  ]}
               >
                  <View style={[styles.rowIcon, { backgroundColor: 'red' }]}>
                     <Feather color="#fff" name="x" size={20} />
                  </View>

                  <Text style={styles.rowLabel}>
                     {translate('profile.delete')}
                  </Text>

                  <View style={styles.rowSpacer} />

                  <TouchableOpacity
                     onPress={handleDeleteAccount}
                     style={{ padding: 8 }}
                  >
                     <FontAwesome
                        name="trash-o"
                        size={20}
                        color={colors.destructive}
                     />
                  </TouchableOpacity>
               </View>
            </View>
            <Text className="ml-3 text-muted">
               version: {Constants.expoConfig?.version}
            </Text>
         </View>

         <Sheet
            snapPoints={snapoints}
            ref={bottomSheetRef}
            topInset={SIZES.statusBarHeight + 10}
         >
            <View className="mb-2 flex-1">
               {view === 'user-update' && (
                  <View className="px-2 mt-3">
                     <View>
                        <Text variant="title3">{translate('signup.name')}</Text>
                        <BottomSheetTextInput
                           style={{
                              marginTop: 10,
                              marginBottom: 10,
                              borderRadius: 10,
                              fontSize: 16,
                              lineHeight: 20,
                              padding: 10,
                              backgroundColor: 'rgba(151, 151, 151, 0.25)'
                           }}
                           defaultValue={user?.name}
                           placeholder="Joe Smith"
                           autoCapitalize="words"
                           value={name}
                           autoFocus
                           onChangeText={(text) => {
                              setName(text)
                           }}
                        />
                     </View>
                     <View>
                        <Text variant="title3">
                           {translate('signup.phone')}
                        </Text>
                        <BottomSheetTextInput
                           style={{
                              marginTop: 10,
                              marginBottom: 30,
                              borderRadius: 10,
                              fontSize: 16,
                              lineHeight: 20,
                              padding: 10,
                              backgroundColor: 'rgba(151, 151, 151, 0.25)'
                           }}
                           defaultValue={user?.phone!}
                           placeholder="Cell Phone Number"
                           value={phone}
                           keyboardType="numeric"
                           onChangeText={(text) => {
                              setPhone(formatPhone(text))
                           }}
                        />
                        <View className="gap- flex-row items-center justify-evenly">
                           <Button
                              title={translate('button.cancel')}
                              color="orange"
                              onPress={resetForm}
                           />
                           <Button
                              title={translate('button.update')}
                              disabled={!name || !phone}
                              onPress={() => {
                                 if (!name) {
                                    Alert.alert(
                                       'Invalid name',
                                       'You must write your full name'
                                    )
                                    return
                                 }
                                 if (phone.length !== 14) {
                                    Alert.alert('Invalid phone number')
                                    return
                                 }

                                 Alert.alert(
                                    'Name and Phone Updates',
                                    'Are you sure that you want to update this info',
                                    [
                                       { text: 'Cancel' },
                                       {
                                          text: 'Yes, I am sure',
                                          onPress: async () => {
                                             try {
                                                if (!user) return

                                                resetForm()
                                             } catch (error) {
                                                console.log(
                                                   'Error updating info',
                                                   error
                                                )
                                             }
                                          }
                                       }
                                    ]
                                 )
                              }}
                           />
                        </View>
                     </View>
                  </View>
               )}
            </View>
         </Sheet>
      </ParallaxScrollView>
   )
}

const styles = StyleSheet.create({
   container: {
      padding: 0,
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0
   },
   /** Profile */
   profile: {
      padding: 16,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
   },
   profileAvatarWrapper: {
      position: 'relative'
   },
   profileAvatar: {
      width: 96,
      height: 96,
      borderRadius: 9999
   },
   profileAction: {
      position: 'absolute',
      top: IMAGE_HEIGHT - 28,
      right: -IMAGE_HEIGHT / 2,
      zIndex: 999,
      alignItems: 'center',
      justifyContent: 'center',
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: '#007bff',
      padding: 6
   },
   profileName: {
      marginTop: 12,
      fontSize: 19,
      fontWeight: '600',
      textAlign: 'center'
   },
   scrollViewContent: {
      paddingTop: IMAGE_HEIGHT / 2,
      marginTop: IMAGE_HEIGHT / 2,
      marginBottom: 20
   },
   profileAddress: {
      fontSize: 16,
      color: '#989898',
      textAlign: 'center'
   },
   logout: {
      position: 'absolute',
      right: 20,
      top: Constants.statusBarHeight,
      zIndex: 100
   },
   /** Section */
   section: {
      paddingHorizontal: 2
   },
   sectionTitle: {
      paddingVertical: 12,
      fontSize: 12,
      fontWeight: '600',
      color: '#9e9e9e',
      textTransform: 'uppercase',
      letterSpacing: 1.1
   },
   /** Row */
   row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: 50,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 4,
      borderRadius: 8,
      marginBottom: 12,
      paddingHorizontal: 12
   },
   rowIcon: {
      width: 32,
      height: 32,
      borderRadius: 9999,
      marginRight: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
   },
   rowLabel: {
      fontSize: 17,
      fontWeight: '400'
   },
   image: {
      width: IMAGE_HEIGHT,
      height: IMAGE_HEIGHT,
      borderRadius: IMAGE_HEIGHT / 2,
      position: 'absolute',
      zIndex: 998,

      alignSelf: 'center'
   },
   infoContainer: {
      position: 'absolute',
      top: IMAGE_HEIGHT,
      marginVertical: 10,
      zIndex: 997,
      left: 0,
      right: 0,
      alignItems: 'center'
   },
   rowSpacer: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0
   }
})
