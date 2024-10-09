import { router } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { BackButton } from '~/components/BackButton'
import { Container } from '~/components/Container'
import { Text } from '~/components/nativewindui/Text'
import { useTranslate } from '~/hooks/useTranslation'
import { translation } from '~/locales/translate'

const BarberTermsOfUse: React.FC = () => {
   const traslate = useTranslate()
   return (
      <Container>
         <BackButton onPress={() => router.back()} />
         <ScrollView
            className="flex-1 bg-background p-2"
            contentContainerClassName="mb-4"
         >
            <Text style={styles.title}>{translation('profile', 'terms')}</Text>

            <Text style={styles.sectionTitle}>
               {translation('terms', 'section1', 'title')}
            </Text>
            <Text style={styles.text}>
               {translation('terms', 'section1', 'message')}
            </Text>

            <Text style={styles.sectionTitle}>
               {translation('terms', 'section2', 'title')}
            </Text>
            <Text style={styles.text}>
               {translation('terms', 'section2', 'message')}
            </Text>

            <Text style={styles.sectionTitle}>
               {translation('terms', 'section3', 'title')}
            </Text>
            <Text style={styles.text}>
               {translation('terms', 'section3', 'message')}
            </Text>

            <Text style={styles.sectionTitle}>
               {translation('terms', 'section4', 'title')}
            </Text>
            <Text style={styles.text}>
               {translation('terms', 'section4', 'message')}
            </Text>

            <Text style={styles.sectionTitle}>
               {' '}
               {translation('terms', 'section5', 'title')}
            </Text>
            <Text style={styles.text}>
               {translation('terms', 'section5', 'message')}
            </Text>

            <Text style={styles.sectionTitle}>
               {translation('terms', 'section6', 'title')}
            </Text>
            <Text style={styles.text}>
               {translation('terms', 'section6', 'message')}
            </Text>

            <Text style={styles.sectionTitle}>
               {translation('terms', 'section7', 'title')}
            </Text>
            <Text style={styles.text}>
               {translation('terms', 'section7', 'message')}
            </Text>

            <Text style={styles.sectionTitle}>
               {translation('terms', 'section8', 'title')}
            </Text>
            <Text style={styles.text}>
               {traslate('terms.section8.message', {
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
      padding: 20,
      backgroundColor: '#fff'
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

export default BarberTermsOfUse
