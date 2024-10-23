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
   bookedSlots: string[],
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
      duration // Use total duration to calculate the latest available slot
   )

   // Sort bookedSlots by time
   bookedSlots.sort(
      (a, b) =>
         parseTime12Hour(a)[0] * 60 +
         parseTime12Hour(a)[1] -
         (parseTime12Hour(b)[0] * 60 + parseTime12Hour(b)[1])
   )

   let currentSlotIndex = 0
   let currentBookedSlot =
      bookedSlots.length > 0
         ? parseTime12Hour(bookedSlots[currentSlotIndex])
         : null

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

   // Loop through each time slot and check conditions
   while (
      (startHours < latestSlotHours ||
         (startHours === latestSlotHours &&
            startMinutes <= latestSlotMinutes)) &&
      (startHours > startHoursDefault ||
         (startHours === startHoursDefault &&
            startMinutes >= startMinutesDefault))
   ) {
      if (
         !isToday ||
         startHours > now.getHours() ||
         (startHours === now.getHours() && startMinutes >= now.getMinutes())
      ) {
         const timeSlot = formatTime12Hour(startHours, startMinutes)

         const isDuringLunchBreak =
            (startHours < lunchEndHours ||
               (startHours === lunchEndHours &&
                  startMinutes < lunchEndMinutes)) &&
            (startHours > lunchStartHours ||
               (startHours === lunchStartHours &&
                  startMinutes >= lunchStartMinutes))

         let isBookedSlot = false
         let slotEndConflictsWithBookedSlot = false

         if (currentBookedSlot) {
            const [bookedHours, bookedMinutes] = currentBookedSlot

            const slotEnd = addMinutes(
               //@ts-ignore
               new Date().setHours(startHours, startMinutes),
               duration
            )
            const bookedSlotStart = new Date().setHours(
               bookedHours,
               bookedMinutes
            )

            // Check if the current slot ends after the start of the booked slot
            if (slotEnd.getTime() > bookedSlotStart) {
               slotEndConflictsWithBookedSlot = true
            }

            const bookedSlotEnd = addMinutes(
               //@ts-ignore
               new Date().setHours(bookedHours, bookedMinutes),
               duration
            )
            const nextBookedSlotStart = addMinutes(
               bookedSlotEnd,
               incrementMinutes
            )

            if (
               startHours * 60 + startMinutes >=
                  bookedHours * 60 + bookedMinutes &&
               startHours * 60 + startMinutes <
                  nextBookedSlotStart.getHours() * 60 +
                     nextBookedSlotStart.getMinutes()
            ) {
               isBookedSlot = true
            } else if (
               startHours * 60 + startMinutes >=
               nextBookedSlotStart.getHours() * 60 +
                  nextBookedSlotStart.getMinutes()
            ) {
               currentSlotIndex++
               currentBookedSlot = bookedSlots[currentSlotIndex]
                  ? parseTime12Hour(bookedSlots[currentSlotIndex])
                  : null
            }
         }

         const isBlockedTime =
            blockedTime &&
            blockStartHours !== null &&
            blockEndHours !== null &&
            blockStartMinutes !== null &&
            blockEndMinutes !== null &&
            (startHours < blockEndHours ||
               (startHours === blockEndHours &&
                  startMinutes < blockEndMinutes)) &&
            (startHours > blockStartHours ||
               (startHours === blockStartHours &&
                  startMinutes >= blockStartMinutes))

         // Add the slot if it's not during lunch, not booked, not blocked, and no conflict with booked slot
         if (
            !isDuringLunchBreak &&
            !isBookedSlot &&
            !isBlockedTime &&
            !slotEndConflictsWithBookedSlot
         ) {
            slots.push({ time: timeSlot, isBooked: false })
         }
      }

      // Increment to the next slot
      startMinutes += incrementMinutes
      if (startMinutes >= 60) {
         startMinutes %= 60
         startHours += 1
      }
   }

   return slots
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
const parseTime12Hour = (time: string): [number, number] => {
   const [timePart, period] = time.split(' ')
   let [hours, minutes] = timePart.split(':').map(Number)

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

// Helper function to add minutes to a Date object and return a new Date object
const addMinutes = (date: Date, minutes: number): Date => {
   const newDate = new Date(date)
   newDate.setMinutes(newDate.getMinutes() + minutes)
   return newDate
}
