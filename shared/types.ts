import Stripe from 'stripe'

export type Barber = {
   // Unique identifier for the barber
   id: string
   name: string // Barber's name
   email: string
   phone: string
   image: string | null // URL of the barber's profile image
   isAvailable: boolean // Optional rating for the barber
   isActive: boolean
   bio?: string
   gallery: Photo[]
   pushToken: string | null
   minutesInterval: number
   schedule: Schedule
   profileCompleted: boolean
   profile: BarberProfile | null
   blockedTimes?: BlockTimeParams[]
   subscriptionStatus: Stripe.Subscription.Status // Optional biography or description of the barber
}
export type Photo = {
   id: string
   uri: string
   date: string
}

export type BarberProfile = {
   barbershopName: string
   address: string
   apt?: string
   city: string
   state: string
   phone: string
   zip: string
   bio?: string
   country: string
   coords: { lat: number; lng: number } | null
}

export type SubscriptionStatusResponse = {
   isSubscribed: boolean
}
export type CreateSubscriptionRequest = {
   email: string
}
export type PaymentIntentResponse = {
   paymentIntent: string
   clientSecret?: string | null
   status: Stripe.Subscription.Status
   customer_id: string
}
export type CreateSubscriptionResponse = {
   success: boolean
   result: PaymentIntentResponse | string
}

export type Review = {
   customerId?: string
   id?: string
   barberId?: string
   profileImage: string
   name: string
   date: string
   rating: number
   reviewTitle: string
   reviewText: string
}

export type AppUser = {
   id?: string
   email: string
   name?: string
   phone?: string
   gallery?: Photo[]
   image: string | null
   pushToken: string | null
   isBarber?: boolean
   provider: 'google' | 'apple' | 'email'
   createdAt: string
} & (
   | {
        isBarber: false
        favoriteBarber: string | null
     }
   | (Barber & { isBarber: true })
)

export type AppointmentStatus =
   | 'pending'
   | 'confirmed'
   | 'cancelled'
   | 'completed'
   | 'no-show'

export type Appointment = {
   id?: string
   customer: Pick<AppUser, 'id' | 'name' | 'image' | 'phone' | 'pushToken'>
   date: string
   startTime: string
   barber: Pick<Barber, 'id' | 'phone' | 'name' | 'image' | 'pushToken'>
   services: Service[]
   updatedCount: number
   status: AppointmentStatus
   changesMadeBy: 'customer' | 'barber'
   reminderSent: boolean
}

export type BarberFilter = {
   distance: number
   isAvailable: boolean
   rating: number
}

export type BarbersFiltered = Barber & {
   distance: number
   rating: number
   available: boolean
}

export type Response = {
   success: boolean
   result: string | null
}
export type IconNames =
   | 'haircut'
   | 'beardTrimming'
   | 'kids'
   | 'lotion'
   | 'towel'
   | 'razor'
export type IconImageType = {
   [key in IconNames]: any
}

export type Service = {
   id?: string
   name: string
   barberId: string
   price: number
   duration: number
   description?: string
   quantity: number
   icon: IconNames
}
export type BlockTimeParams = {
   allDay: boolean
   date: string
} & ({ allDay: true } | { allDay: false; start: string; end: string })

export type Days = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'
export const dayOrder: Days[] = [
   'Sun',
   'Mon',
   'Tue',
   'Wed',
   'Thu',
   'Fri',
   'Sat'
]

type MarkedDates = {
   selected?: boolean
   marked?: boolean
   selectedColor?: string
   markedColor?: string
   dotColor?: string
   disabled?: boolean
   disableTouchEvent?: boolean
}
export type BlockTime = {
   date: string
   start: string
   end: string
}

export type MarkedDate = {
   [date: string]: MarkedDates
}

export type DayAvailability = {
   date: string // e.g., '2024-08-06'
   timeSlots: TimeSlot[]
}
export type LunchBreak = {
   start: string
   end: string
}
export type BroadcastMessage = {
   title: string
   message: string
   users: string[]
   barberId: string
   createdAt?: string
}
export type NotificationMessage = {
   to: string
   title: string
   body: string
   data: NotificationData
   notififationType: NOTIFICATION_TYPE
}

export type ScheduleDay = {
   isOff: boolean
   lunchBreak: LunchBreak
   startTime: string
   endTime: string
}

export type Schedule = Record<Days, ScheduleDay>

export type WeekDay = { date: Date; label: string; isPast: boolean }
export type TimeSlot = {
   time: string
   isBooked: boolean
}

export type NOTIFICATION_TYPE =
   | 'new-appointment'
   | 'appointment-updates'
   | 'reminder'
   | 'subscription'
   | 'broadcast'

export type NotificationData = {
   id: string
   notificationType: NOTIFICATION_TYPE
}
