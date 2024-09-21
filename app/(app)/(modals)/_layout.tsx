import { Stack } from 'expo-router';
import { ThemeToggle } from '~/components/nativewindui/ThemeToggle';

const ModalLayout = () => {
   return (
      <Stack>
         <Stack.Screen name="barber" options={{ headerShown: false }} />
         <Stack.Screen name="booking" options={{ headerShown: false }} />
         <Stack.Screen name="appointment" options={{ headerShown: false }} />
         <Stack.Screen name="barber-appointment-view" options={{ headerShown: false }} />
         <Stack.Screen
            name="subscription"
            options={{
               headerShown: false,
               presentation: 'modal',
               animation: 'fade_from_bottom', // for android
               title: 'Subscription',
               headerRight: () => <ThemeToggle />,
            }}
         />
      </Stack>
   );
};

export default ModalLayout;
