import React from 'react'
import { View } from 'react-native'

import { Text } from './nativewindui/Text'

import { Days, ScheduleDay } from '~/shared/types'
import { useTranslate } from '~/hooks/useTranslation'

type Props = {
   day: Days
   slot: ScheduleDay
}

const ScheduleDayCard = ({ day, slot }: Props) => {
   const translate = useTranslate()
   return (
      <View key={day} className="flex-1 flex-row items-center gap-3 p-1">
         <View className="w-1/5">
            <Text className="font-semibold text-muted dark:text-white">
               {translate(`days.${day}`)}
            </Text>
         </View>
         <View className="flex-grow flex-row items-center gap-3">
            <Text className="text-start text-sm text-muted dark:text-white">
               {slot.startTime} - {slot.lunchBreak.start}
            </Text>
            <View className="h-1 w-1 rounded-full bg-slate-300" />
            <Text className="text-start text-sm text-muted dark:text-white">
               {slot.lunchBreak.end} - {slot.endTime}
            </Text>
         </View>
      </View>
   )
}

export default ScheduleDayCard
