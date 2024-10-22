import { View } from 'react-native'
import React, { useMemo } from 'react'
import { Container } from '~/components/Container'
import { Text } from '~/components/nativewindui/Text'
import { useBarbers } from '~/hooks/useBarbers'
import { useUsers } from '~/hooks/useUsers'
import { Barber } from '~/shared/types'
import Animated from 'react-native-reanimated'
import { PieChart } from 'react-native-gifted-charts'
import { useColorScheme } from '~/lib/useColorScheme'
import { SIZES } from '~/constants'

const Dashboard = () => {
   const { colors } = useColorScheme()
   const { users, loading } = useUsers()
   const barbers = useMemo(
      () => users.filter((user) => user.isBarber && user.profileCompleted),
      [users]
   ) as Barber[]
   const others = useMemo(
      () => users.filter((user) => user.isBarber && !user.profileCompleted),
      [users]
   )
   const clients = useMemo(
      () => users.filter((user) => !user.isBarber),
      [users]
   )
   const activeSubscription = barbers.filter(
      (b) => b.subscriptionStatus === 'active'
   ).length

   const inActiveSubscription = barbers.filter(
      (b) => b.subscriptionStatus !== 'active'
   ).length

   const subscriptionData = [
      {
         value: activeSubscription,
         label: 'Active',
         color: 'green'
      },
      {
         value: inActiveSubscription,
         label: 'Inactive',
         color: 'red'
      }
   ]

   const clientsData = [
      {
         value: clients.length,
         label: 'Clients',
         color: colors.accent
      },
      {
         value: barbers.length,
         label: 'Barbers',
         color: colors.primary
      }
   ]
   return (
      <Container>
         <View className="flex-1 p-2 gap-3">
            <View>
               <Text variant={'largeTitle'} className="text-center">
                  Dashboard
               </Text>
               <Text className="text-center my-1 text-xl font-roboto-bold">
                  Users
               </Text>
               <View className="flex-row gap-2 items-center justify-center">
                  <Card title="Barbers" value={barbers.length} />
                  <Card title="Clients" value={clients.length} />
                  <Card title="Others" value={others.length} />
               </View>
            </View>

            <View>
               <Text className="text-center my-1 text-xl font-roboto-bold">
                  Subscriptions
               </Text>
               <View className="flex-row gap-2 items-center justify-center">
                  <Card title="Active" value={activeSubscription} />
                  <Card
                     title="Trailing"
                     value={
                        barbers.filter(
                           (b) => b.subscriptionStatus === 'trialing'
                        ).length
                     }
                  />
                  <Card title="Others" value={1000} />
               </View>
            </View>
            <View className="flex-row justify-evenly">
               <Animated.View style={{ alignItems: 'center' }}>
                  <PieChart
                     data={subscriptionData}
                     radius={SIZES.width * 0.2}
                     innerRadius={SIZES.width * 0.25 * 0.5}
                     showText
                     textColor="black"
                     textSize={16}
                     //textPosition="center"
                     strokeColor="white"
                     strokeWidth={2}
                     centerLabelComponent={() => (
                        <Text adjustsFontSizeToFit className="font-roboto-bold">
                           Subscriptions
                        </Text>
                     )}
                  />
               </Animated.View>
               <Animated.View style={{ alignItems: 'center' }}>
                  <PieChart
                     data={clientsData}
                     radius={SIZES.width * 0.2}
                     innerRadius={SIZES.width * 0.25 * 0.5}
                     showText
                     textColor="black"
                     textSize={18}
                     //textPosition="center"
                     strokeColor="white"
                     strokeWidth={2}
                     centerLabelComponent={() => (
                        <Text adjustsFontSizeToFit className="font-roboto-bold">
                           Clients
                        </Text>
                     )}
                  />
               </Animated.View>
            </View>
         </View>
      </Container>
   )
}

export default Dashboard

type Props = {
   title: string
   value: number
}
const Card = ({ title, value }: Props) => (
   <View className="shadow-sm p-3 rounded-lg justify-center flex-grow items-center bg-card dark:shadow-none">
      <Text className="text-xl">{title}</Text>
      <Text className="text-2xl font-roboto-bold">{value}</Text>
   </View>
)
