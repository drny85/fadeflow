import { NativeStackNavigationOptions } from '@react-navigation/native-stack'

import { COLORS } from '~/theme/colors'

export const StackScreenWithSearchBar = (
    backgroundColor: string,
    themeColor: 'dark' | 'light'
): NativeStackNavigationOptions => {
    return {
        headerLargeTitle: true,
        headerTitleStyle: {
            color: themeColor === 'dark' ? '#ffffff' : COLORS.light.accent
        },
        headerLargeStyle: {
            backgroundColor: backgroundColor
                ? backgroundColor
                : COLORS.light.accent
        },
        headerLargeTitleStyle: {
            color: themeColor === 'light' ? COLORS.light.primary : '#ffffff',
            fontFamily: 'Roboto-Bold'
        },

        headerSearchBarOptions: {
            hintTextColor: COLORS.light.primary,
            tintColor: COLORS.light.accent,
            barTintColor: COLORS.light.accent
        },

        headerTintColor: COLORS.light.accent,
        headerTransparent: true,
        headerBlurEffect: 'prominent',
        headerShadowVisible: false
    }
}
