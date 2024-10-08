import { Feather } from '@expo/vector-icons'
import { router, Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native'

import FilterComponent from '~/components/Filters/FilterComponent'
import { StackScreenWithSearchBar } from '~/constants/layout'
import { useTranslate } from '~/hooks/useTranslation'
import { useColorScheme } from '~/lib/useColorScheme'

const _layout = () => {
   const { colors, colorScheme, isDarkColorScheme } = useColorScheme()
   const translate = useTranslate()
   return (
      <Stack>
         <Stack.Screen
            name="barbers-screen"
            options={{
               title: translate('tabs.barbers'),
               headerLeft: () => (
                  <TouchableOpacity onPress={() => router.push('/barbers-map')}>
                     <Feather
                        name="map"
                        size={24}
                        color={isDarkColorScheme ? '#ffffff' : colors.accent}
                     />
                  </TouchableOpacity>
               ),

               headerRight: () => <FilterComponent />,
               animation: 'slide_from_bottom',
               ...StackScreenWithSearchBar(colors.background, colorScheme)
            }}
         />
      </Stack>
   )
}

export default _layout
