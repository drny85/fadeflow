import { Tabs } from 'expo-router'
import { Image, View } from 'react-native'

import { TabBarIcon } from '../../../components/TabBarIcon'

import MenuItems from '~/components/Menu'
import { StackScreenWithSearchBar } from '~/constants/layout'
import { useBarbers } from '~/hooks/useBarbers'
import { useNotifications } from '~/hooks/useNotification'
import { useColorScheme } from '~/lib/useColorScheme'

export default function TabLayout() {
    const { colors, isDarkColorScheme } = useColorScheme()

    useNotifications()
    useBarbers()

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: isDarkColorScheme
                    ? colors.grey2
                    : colors.grey,
                tabBarInactiveTintColor: isDarkColorScheme
                    ? '#ffffff'
                    : colors.accent,
                tabBarStyle: { backgroundColor: colors.background },
                headerStyle: {
                    backgroundColor: colors.background
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    title: 'Home',
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={require('~/assets/images/barbershop.png')}
                            tintColor={color}
                            className="-mb-1 h-8 w-8"
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="(barbers)"
                options={{
                    unmountOnBlur: true,
                    title: 'Barbers',
                    headerShown: false,

                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="scissors" color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="appointments"
                options={{
                    title: 'Appointments',
                    headerRight: () => (
                        <View className="mr-3">
                            <MenuItems
                                onSelect={(value) => console.log(value)}
                                items={[
                                    {
                                        title: 'Filter',
                                        key: '1'
                                    },
                                    {
                                        title: 'Sort',
                                        key: '2'
                                    },
                                    {
                                        title: 'Share',
                                        key: '3'
                                    }
                                ]}
                            />
                        </View>
                    ),

                    tabBarIcon: ({ color }) => (
                        <Image
                            source={require('~/assets/images/appointment.png')}
                            tintColor={color}
                            className="-mb-1 h-8 w-8"
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    headerShown: false,

                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="user-circle" color={color} />
                    )
                }}
            />
        </Tabs>
    )
}
