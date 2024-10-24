import { format } from 'date-fns'

type LunchBreak = {
   start: string
   end: string
}

type BlockTime = {
   date: string
   start: string
   end: string
}

type TimeSlot = {
   time: string
   isBooked: boolean
}

export const generateAvailableTimeSlots = (
   startTime: string,
   endTime: string,
   incrementMinutes: number,
   bookedSlots: { start: string; end: string }[], // Booked slots now contain start and end times
   currentDate: Date,
   lunchBreak: LunchBreak,
   duration: number, // Total duration of the next appointment to be booked
   blockedTime?: BlockTime
): TimeSlot[] => {
   const slots: TimeSlot[] = []
   const now = new Date()
   const isToday = currentDate.toDateString() === now.toDateString()

   const [startHoursDefault, startMinutesDefault] = parseTime12Hour(startTime)
   const [endHours, endMinutes] = parseTime12Hour(endTime)

   const [lunchStartHours, lunchStartMinutes] = parseTime12Hour(
      lunchBreak.start
   )
   const [lunchEndHours, lunchEndMinutes] = parseTime12Hour(lunchBreak.end)

   let startHours = startHoursDefault
   let startMinutes = startMinutesDefault

   // Adjust start if current time is after startTime and it's today
   if (
      isToday &&
      (now.getHours() > startHoursDefault ||
         (now.getHours() === startHoursDefault &&
            now.getMinutes() > startMinutesDefault))
   ) {
      startHours = now.getHours()
      startMinutes = now.getMinutes()

      // Adjust to the nearest increment
      if (startMinutes % incrementMinutes !== 0) {
         startMinutes =
            Math.ceil(startMinutes / incrementMinutes) * incrementMinutes
         if (startMinutes >= 60) {
            startMinutes %= 60
            startHours += 1
         }
      }
   }

   // Calculate the latest time a slot can start based on the total duration
   const [latestSlotHours, latestSlotMinutes] = calculateLatestSlot(
      endHours,
      endMinutes,
      duration
   )

   // Sort booked slots by start time for comparison
   bookedSlots.sort(
      (a, b) =>
         parseTime12Hour(a.start)[0] * 60 +
         parseTime12Hour(a.start)[1] -
         (parseTime12Hour(b.start)[0] * 60 + parseTime12Hour(b.start)[1])
   )

   // Parse blocked time if provided
   let blockStartHours: number | null = null
   let blockEndHours: number | null = null
   let blockStartMinutes: number | null = null
   let blockEndMinutes: number | null = null

   if (blockedTime && format(currentDate, 'yyyy-MM-dd') === blockedTime.date) {
      blockStartHours = parseTime12Hour(blockedTime.start)[0]
      blockStartMinutes = parseTime12Hour(blockedTime.start)[1]
      blockEndHours = parseTime12Hour(blockedTime.end)[0]
      blockEndMinutes = parseTime12Hour(blockedTime.end)[1]
   }

   while (
      (startHours < latestSlotHours ||
         (startHours === latestSlotHours &&
            startMinutes <= latestSlotMinutes)) &&
      (startHours > startHoursDefault ||
         (startHours === startHoursDefault &&
            startMinutes >= startMinutesDefault))
   ) {
      const timeSlotStart = formatTime12Hour(startHours, startMinutes)
      const timeSlotEnd = addMinutesToTime(startHours, startMinutes, duration)

      // Check if the slot is during lunch break
      const isDuringLunchBreak =
         (startHours < lunchEndHours ||
            (startHours === lunchEndHours && startMinutes < lunchEndMinutes)) &&
         (startHours > lunchStartHours ||
            (startHours === lunchStartHours &&
               startMinutes >= lunchStartMinutes))

      // Check if the slot is blocked
      const isBlockedTime =
         blockStartHours !== null &&
         blockEndHours !== null &&
         blockStartMinutes !== null &&
         blockEndMinutes !== null &&
         isTimeInRange(
            startHours,
            startMinutes,
            blockStartHours,
            blockStartMinutes,
            blockEndHours,
            blockEndMinutes
         )

      // Check if the slot overlaps with a booked slot
      let isBookedSlot = false
      for (const booked of bookedSlots) {
         const [bookedStartHours, bookedStartMinutes] = parseTime12Hour(
            booked.start
         )
         const [bookedEndHours, bookedEndMinutes] = parseTime12Hour(booked.end)

         if (
            isTimeOverlap(
               startHours,
               startMinutes,
               timeSlotEnd.hours,
               timeSlotEnd.minutes,
               bookedStartHours,
               bookedStartMinutes,
               bookedEndHours,
               bookedEndMinutes
            )
         ) {
            isBookedSlot = true
            break
         }
      }

      // Only add slot if it's not during lunch break, not booked, and not blocked
      if (!isDuringLunchBreak && !isBookedSlot && !isBlockedTime) {
         slots.push({ time: timeSlotStart, isBooked: false })
      }

      // Increment start time
      startMinutes += incrementMinutes
      if (startMinutes >= 60) {
         startMinutes %= 60
         startHours += 1
      }
   }

   return slots
}

// Helper function to check if time is in a range
const isTimeInRange = (
   hours: number,
   minutes: number,
   rangeStartHours: number,
   rangeStartMinutes: number,
   rangeEndHours: number,
   rangeEndMinutes: number
): boolean => {
   const time = hours * 60 + minutes
   const rangeStart = rangeStartHours * 60 + rangeStartMinutes
   const rangeEnd = rangeEndHours * 60 + rangeEndMinutes
   return time >= rangeStart && time < rangeEnd
}

// Helper function to check if two time periods overlap
const isTimeOverlap = (
   startHours1: number,
   startMinutes1: number,
   endHours1: number,
   endMinutes1: number,
   startHours2: number,
   startMinutes2: number,
   endHours2: number,
   endMinutes2: number
): boolean => {
   const start1 = startHours1 * 60 + startMinutes1
   const end1 = endHours1 * 60 + endMinutes1
   const start2 = startHours2 * 60 + startMinutes2
   const end2 = endHours2 * 60 + endMinutes2
   return start1 < end2 && end1 > start2
}

// Helper function to calculate the latest start time for a slot to finish within endTime
const calculateLatestSlot = (
   endHours: number,
   endMinutes: number,
   duration: number
): [number, number] => {
   let latestSlotHours = endHours
   let latestSlotMinutes = endMinutes - duration
   if (latestSlotMinutes < 0) {
      latestSlotMinutes += 60
      latestSlotHours -= 1
   }
   return [latestSlotHours, latestSlotMinutes]
}

// Helper function to parse time in 12-hour format (e.g., "2:30 PM") into 24-hour format numbers
// Helper function to parse time in 12-hour format (e.g., "2:30 PM") into 24-hour format numbers
const parseTime12Hour = (time: string | undefined): [number, number] => {
   if (!time || typeof time !== 'string') {
      throw new Error('Invalid time format or undefined time')
   }

   const [timePart, period] = time.split(' ')
   if (!timePart || !period) {
      throw new Error('Invalid time format. Expected format: "hh:mm AM/PM"')
   }

   let [hours, minutes] = timePart.split(':').map(Number)

   if (isNaN(hours) || isNaN(minutes)) {
      throw new Error(
         'Invalid time values. Hours and minutes should be numbers.'
      )
   }

   if (period === 'PM' && hours < 12) hours += 12
   if (period === 'AM' && hours === 12) hours = 0

   return [hours, minutes]
}
// Helper function to format time as 12-hour clock with AM/PM
const formatTime12Hour = (hours: number, minutes: number): string => {
   const period = hours >= 12 ? 'PM' : 'AM'
   const formattedHours = hours % 12 || 12
   const formattedMinutes = minutes.toString().padStart(2, '0')
   return `${formattedHours}:${formattedMinutes} ${period}`
}

// Helper function to add minutes to a time
const addMinutesToTime = (
   hours: number,
   minutes: number,
   duration: number
): { hours: number; minutes: number } => {
   let newMinutes = minutes + duration
   let newHours = hours
   if (newMinutes >= 60) {
      newHours += Math.floor(newMinutes / 60)
      newMinutes %= 60
   }
   return { hours: newHours, minutes: newMinutes }
}
