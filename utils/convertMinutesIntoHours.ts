export function convertMinutesToHours(minutes: number): string {
   const hours = Math.floor(minutes / 60) // Get the whole number of hours
   const remainingMinutes = minutes % 60 // Get the remaining minutes
   return `${hours}h ${remainingMinutes}m`
}
