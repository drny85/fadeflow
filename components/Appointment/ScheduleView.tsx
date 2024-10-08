import { View } from 'react-native'

import ScheduleDayCard from '../ScheduleDayCard'
import { Text } from '../nativewindui/Text'

import { dayOrder, Days, Schedule, ScheduleDay } from '~/shared/types'
import { useTranslate } from '~/hooks/useTranslation'

type Props = {
   schedule: Schedule
}
const ScheduleView = ({ schedule }: Props) => {
   const translate = useTranslate()
   return (
      <View className="rounded-lg bg-card shadow-sm">
         <View className="p-2">
            <Text className="mb-2" variant="title3">
               {translate('barber.schedule')}
            </Text>
            {Object.entries(schedule)
               .sort(
                  (a, b) =>
                     dayOrder.indexOf(a[0] as Days) -
                     dayOrder.indexOf(b[0] as Days)
               )
               .map(([day, hours]) => {
                  if ((hours as ScheduleDay).isOff) return null
                  const d = day as Days
                  const slot = hours as ScheduleDay
                  return <ScheduleDayCard key={d} day={d} slot={slot} />
               })}
         </View>
      </View>
   )
}

export default ScheduleView
