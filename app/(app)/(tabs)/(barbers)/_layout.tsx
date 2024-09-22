import { Stack } from 'expo-router';
import { StackScreenWithSearchBar } from '~/constants/layout';
import { useColorScheme } from '~/lib/useColorScheme';

const _layout = () => {
   const { colors } = useColorScheme();
   return (
      <Stack>
         <Stack.Screen
            name="barbers-screen"
            options={{
               title: 'Barbers',
               animation: 'slide_from_bottom',
               ...StackScreenWithSearchBar(colors.background),
            }}
         />
      </Stack>
   );
};

export default _layout;