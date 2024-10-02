import Constants from 'expo-constants'
import { Dimensions } from 'react-native'

import { BlockTimeParams, Days, IconImageType, Schedule } from '~/shared/types'

const { width, height } = Dimensions.get('screen')

export const SIZES = {
   width,
   height,
   statusBarHeight: Constants.statusBarHeight
}

export const SITE_URL = 'https://fadeflow.vercel.app'

export const MAXIMUM_IMAGES_UPLOAD = 10
export const days: Record<Days, string> = {
   Sun: 'Sunday',
   Mon: 'Monday',
   Tue: 'Tuesday',
   Wed: 'Wednesday',
   Thu: 'Thursday',
   Fri: 'Friday',
   Sat: 'Saturday'
}

export const COORDS = {
   latitude: 40.83728,
   longitude: -73.90757
}
export const initialBlockedDates: BlockTimeParams[] = [
   {
      allDay: true,
      date: '2024-10-22'
   },
   {
      allDay: false,
      date: '2024-10-14',
      startTime: new Date('2024-10-01T12:00:00.000Z'),
      endTime: new Date('2024-10-02T03:00:00.000Z')
   }
]

export const DEFAULT_SCHEDULE: Schedule = {
   Sun: {
      isOff: false,
      startTime: '11:00 AM',
      endTime: '5:00 PM',
      lunchBreak: { start: '2:00 PM', end: '2:30 PM' }
   },
   Mon: {
      isOff: false,
      startTime: '10:00 AM',
      endTime: '7:00 PM',
      lunchBreak: { start: '1:00 PM', end: '1:30 PM' }
   },
   Tue: {
      isOff: false,
      startTime: '10:00 AM',
      endTime: '7:00 PM',
      lunchBreak: { start: '1:00 PM', end: '1:30 PM' }
   },
   Wed: {
      isOff: false,
      startTime: '10:00 AM',
      endTime: '7:00 PM',
      lunchBreak: { start: '1:00 PM', end: '1:30 PM' }
   },
   Thu: {
      isOff: false,
      startTime: '10:00 AM',
      endTime: '8:00 PM',
      lunchBreak: { start: '1:00 PM', end: '1:30 PM' }
   },
   Fri: {
      isOff: false,
      startTime: '10:00 AM',
      endTime: '8:00 PM',
      lunchBreak: { start: '1:00 PM', end: '1:30 PM' }
   },
   Sat: {
      isOff: false,
      startTime: '10:00 AM',
      endTime: '9:00 PM',
      lunchBreak: { start: '1:30 PM', end: '2:00 PM' }
   }
}

export const ICON_IMAGES: IconImageType = {
   haircut: require('~/assets/images/haircut.png'),
   shave: require('~/assets/images/shave.png'),
   beardTrimming: require('~/assets/images/beard-trimming.png'),
   kids: require('~/assets/images/kid.png'),
   lotion: require('~/assets/images/lotion.png'),
   towel: require('~/assets/images/towel.png'),
   razor: require('~/assets/images/razor.png')
}
