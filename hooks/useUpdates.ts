import * as Updates from 'expo-updates'
import { useEffect } from 'react'
import { Alert } from 'react-native'

async function onFetchUpdateAsync() {
   try {
      const update = await Updates.checkForUpdateAsync()
      if (update.isAvailable) {
         await Updates.fetchUpdateAsync()
         await Updates.reloadAsync()
      }
   } catch (error) {
      // You can also add an alert() here if needed for your purposes
      console.log(`Error fetching latest Expo update: ${error}`)
      Alert.alert('Error', `Error fetching latest Expo update, ${error}`)
   }
}

export const useUpdates = () => {
   useEffect(() => {
      if (!__DEV__) {
         onFetchUpdateAsync()
      }
   }, [])
}
