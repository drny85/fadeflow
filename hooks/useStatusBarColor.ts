import { useNavigation } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from '~/lib/useColorScheme';

export const useStatusBarColor = (color: 'light' | 'dark') => {
   const navigation = useNavigation();
   const { isDarkColorScheme } = useColorScheme();

   useEffect(() => {
      const sub = navigation.addListener('focus', () => {
         setStatusBarStyle(isDarkColorScheme && color === 'dark' ? 'light' : color);
      });

      return () => navigation.removeListener('focus', sub);
   }, [navigation, color, isDarkColorScheme]);
};
