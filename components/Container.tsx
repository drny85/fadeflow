import { View } from 'react-native'

import { SIZES } from '~/constants'

export const Container = ({ children }: { children: React.ReactNode }) => {
    return (
        <View
            className="bg-background"
            style={{ flex: 1, paddingTop: SIZES.statusBarHeight }}
        >
            {children}
        </View>
    )
}
