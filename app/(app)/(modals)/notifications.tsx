import { FlashList } from '@shopify/flash-list'
import { formatDistanceToNow } from 'date-fns'
import React from 'react'
import { View } from 'react-native'
import Animated, { SlideInLeft } from 'react-native-reanimated'
import Loading from '~/components/Loading'
import { Text } from '~/components/nativewindui/Text'
import { useBroadcastMessages } from '~/hooks/useBroadcastMessages'
import { useAuth } from '~/providers/AuthContext'

const Notification = () => {
   const { messages, loading } = useBroadcastMessages()
   const { user } = useAuth()

   if (loading) return <Loading />
   return (
      <View className="flex-1">
         <FlashList
            data={messages}
            estimatedItemSize={120}
            contentContainerClassName="p-2"
            ListEmptyComponent={() => (
               <View className="p-4 items-center justify-center mt-4">
                  <Text>No notifications</Text>
               </View>
            )}
            renderItem={({ index, item }) => (
               <Animated.View entering={SlideInLeft.delay(index * 150)}>
                  <View className="bg-card p-2 shadow-md dark:shadow-none my-1 mx-1 rounded-md">
                     {item.from && (
                        <Text className="text-muted dark:text-slate-300">
                           From {user?.id === item.barberId ? 'Me' : item.from}
                        </Text>
                     )}
                     <View className="p-1">
                        <Text variant={'heading'}>{item.title}</Text>
                        <Text variant={'callout'}>{item.message}</Text>
                        {item.createdAt && (
                           <Text className="text-sm text-muted dark:text-slate-400">
                              {formatDistanceToNow(item.createdAt)}
                           </Text>
                        )}
                     </View>
                  </View>
               </Animated.View>
            )}
         />
      </View>
   )
}

export default Notification
