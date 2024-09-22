import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { COLORS } from '~/theme/colors';

export const StackScreenWithSearchBar = (backgroundColor: string): NativeStackNavigationOptions => {
   return {
      headerLargeTitle: true,
      headerLargeStyle: {
         backgroundColor: backgroundColor ? backgroundColor : COLORS.light.accent,
      },
      headerLargeTitleStyle: {
         color: COLORS.light.accent,
      },

      headerSearchBarOptions: {
         hintTextColor: COLORS.light.primary,
         tintColor: COLORS.light.accent,
         barTintColor: COLORS.light.accent,
      },

      headerTintColor: COLORS.light.accent,
      headerTransparent: true,
      headerBlurEffect: 'prominent',
      headerShadowVisible: false,
   };
};
