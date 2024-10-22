import { Stack } from 'expo-router'
import { StackScreenWithSearchBar } from '~/constants/layout'
import { useColorScheme } from '~/lib/useColorScheme'

const AdminBarbersLayout = () => {
   const { colors, colorScheme } = useColorScheme()

   return (
      <Stack>
         <Stack.Screen
            name="admin-barbers"
            options={{
               title: 'Barbers',
               ...StackScreenWithSearchBar(colors.background, colorScheme)
            }}
         />
      </Stack>
   )
}

export default AdminBarbersLayout
