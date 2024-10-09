import { Stack } from 'expo-router'

const ProfileCompletion = () => {
   return (
      <Stack>
         <Stack.Screen
            name="profile-complition"
            options={{ headerShown: false }}
         />
      </Stack>
   )
}

export default ProfileCompletion
