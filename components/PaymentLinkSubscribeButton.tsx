import * as WebBrowser from 'expo-web-browser'
import { doc, getDoc } from 'firebase/firestore'
import React, { useCallback } from 'react'
import { View } from 'react-native'

import { Button } from '~/components/Button'
import { stripeCustomers } from '~/firebase-collections'
import { useAuth } from '~/providers/AuthContext'
WebBrowser.warmUpAsync()

const PaymentLinkSubscribeButton = () => {
   const { user } = useAuth()
   const handleButtonPress = useCallback(async () => {
      try {
         if (!user) return
         WebBrowser.dismissBrowser()
         console.log(user.email)
         const ref = doc(stripeCustomers, user.id)
         const docRef = await getDoc(ref)
         const data = docRef.data()
         const id = data?.customer_id
         console.log(id)
         const url = `https://buy.stripe.com/test_5kAg2QgeU46e3HG3cc?prefilled_email=${user.email}&client_reference_id=${id}`

         WebBrowser.openBrowserAsync(url, {
            presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET
         })
      } catch (error) {
         console.log(error)
      }
   }, [user])
   return (
      <View className="self-center">
         <Button
            textStyle={{ paddingHorizontal: 10 }}
            title="Subscribe Now"
            onPress={handleButtonPress}
         />
      </View>
   )
}

export default PaymentLinkSubscribeButton
