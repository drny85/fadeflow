import Constants from 'expo-constants'
import { router } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { BackButton } from '~/components/BackButton'
import { Container } from '~/components/Container'
import { Text } from '~/components/nativewindui/Text'
import { useTranslate } from '~/hooks/useTranslation'
import { translation } from '~/locales/translate'

const PrivacyPolicy: React.FC = () => {
   const translate = useTranslate()
   return (
      <Container>
         <BackButton onPress={() => router.back()} />
         <ScrollView
            className="flex-1 bg-background p-2"
            contentContainerClassName="mb-4"
         >
            <Text style={styles.title}>
               {translation('profile', 'privacy')}
            </Text>

            <Text style={styles.sectionTitle}>
               {translation('privacy', 'section1', 'title')}
            </Text>
            <Text style={styles.text}>
               {translate('privacy.section1.message', {
                  name: Constants.expoConfig?.name
               })}
            </Text>

            <Text style={styles.sectionTitle}>
               {translation('privacy', 'section2', 'title')}
            </Text>
            <Text style={styles.text}>
               {translation('privacy', 'section2', 'message')}
            </Text>

            <Text style={styles.sectionTitle}>
               {translation('privacy', 'section3', 'title')}
            </Text>
            <Text style={styles.text}>
               {translation('privacy', 'section3', 'message')}
            </Text>

            <Text style={styles.sectionTitle}>
               {translation('privacy', 'section4', 'title')}
            </Text>
            <Text style={styles.text}>
               Payments for services rendered will be processed through our
               platform. A service fee may be deducted from each transaction.
               You agree to the fee structure outlined by{' '}
               {Constants.expoConfig?.name}.
            </Text>

            <Text style={styles.sectionTitle}>
               {' '}
               {translation('privacy', 'section5', 'title')}
            </Text>
            <Text style={styles.text}>
               {translation('privacy', 'section5', 'message')}
            </Text>

            <Text style={styles.sectionTitle}>
               {translation('privacy', 'section6', 'title')}
            </Text>
            <Text style={styles.text}>
               {translation('privacy', 'section6', 'message')}
            </Text>

            <Text style={styles.sectionTitle}>
               {translation('privacy', 'section7', 'title')}
            </Text>
            <Text style={styles.text}>
               {translation('privacy', 'section7', 'message')}
            </Text>

            <Text style={styles.sectionTitle}>
               {translation('privacy', 'section8', 'title')}
            </Text>
            <Text style={styles.text}>
               {translate('terms.section8.message', {
                  email: process.env.EXPO_PUBLIC_CONTACT_EMAIL
               })}
            </Text>
            <View className="h-10 mt-3" />
         </ScrollView>
      </Container>
   )
}

const styles = StyleSheet.create({
   container: {
      padding: 20
   },
   title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10
   },
   text: {
      fontSize: 16,
      lineHeight: 24
   }
})

export default PrivacyPolicy
