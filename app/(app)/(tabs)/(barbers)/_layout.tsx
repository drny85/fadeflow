import { Stack } from 'expo-router';
import { StackScreenWithSearchBar } from '~/constants/layout';
import { useColorScheme } from '~/lib/useColorScheme';

const _layout = () => {
   const { colors, colorScheme } = useColorScheme();
   return (
      <Stack>
         <Stack.Screen
            name="barbers-screen"
            options={{
               title: 'Barbers',
               animation: 'slide_from_bottom',
               ...StackScreenWithSearchBar(colors.background, colorScheme),
            }}
         />
      </Stack>
   );
};

export default _layout;
