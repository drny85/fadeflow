import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '~/lib/useColorScheme';

export const Container = ({ children }: { children: React.ReactNode }) => {
   const { colors } = useColorScheme();
   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
         {children}
      </SafeAreaView>
   );
};
