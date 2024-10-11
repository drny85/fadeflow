import * as Updates from 'expo-updates'
import { useEffect } from 'react'
import { Alert } from 'react-native'

async function onFetchUpdateAsync() {
   try {
      const update = await Updates.checkForUpdateAsync()
      if (update.isAvailable) {
         Alert.alert(
            'Update Available',
            'A new update is available. Would you like to update now?',
            [
               {
                  text: 'Later',
                  style: 'cancel'
               },
               {
                  text: 'Update',
                  onPress: async () => {
                     try {
                        await Updates.fetchUpdateAsync()
                        Alert.alert(
                           'Update',
                           'The app will now restart to apply the update.'
                        )
                        await Updates.reloadAsync()
                     } catch (error) {
                        Alert.alert(
                           'Error',
                           `Failed to apply the update: ${error}`
                        )
                     }
                  }
               }
            ]
         )
      }
   } catch (error) {
      console.log(`Error fetching latest Expo update: ${error}`)
      Alert.alert('Error', `Error fetching the latest Expo update: ${error}`)
   }
}

export const useUpdates = () => {
   useEffect(() => {
      if (!__DEV__) {
         onFetchUpdateAsync()
      }
   }, [])
}
