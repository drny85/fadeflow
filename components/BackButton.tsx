import { Feather } from '@expo/vector-icons'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { translation } from '~/locales/translate'

export const BackButton = ({ onPress }: { onPress?: () => void }) => {
   return (
      <TouchableOpacity style={styles.backButton} onPress={onPress}>
         <Feather name="chevron-left" size={24} color="#007AFF" />
         <Text style={styles.backButtonText}>
            {translation('button', 'back')}
         </Text>
      </TouchableOpacity>
   )
}
const styles = StyleSheet.create({
   backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 6,
      marginBottom: 10
   },
   backButtonText: {
      color: '#007AFF',
      marginLeft: 4,
      padding: 4
   }
})
