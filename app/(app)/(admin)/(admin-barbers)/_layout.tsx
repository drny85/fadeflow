import { Stack } from 'expo-router'
import BarberFilter from '~/components/admin/BarberFilter'
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
               headerRight: () => <BarberFilter />,
               ...StackScreenWithSearchBar(colors.background, colorScheme)
            }}
         />
      </Stack>
   )
}

export default AdminBarbersLayout
