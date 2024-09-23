import { BarberProfile } from '~/shared/types'

export async function getCoordinatesFromProfile(
    profile: BarberProfile
): Promise<{ lat: number; lng: number } | null> {
    const address = `${profile.address}, ${profile.city}, ${profile.state} ${profile.zip}, ${profile.country}`
    const encodedAddress = encodeURIComponent(address)
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`

    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`)
        }

        const data = await response.json()
        if (data.length > 0) {
            const location = data[0]
            return {
                lat: parseFloat(location.lat),
                lng: parseFloat(location.lon)
            }
        } else {
            console.error('Address not found.')
            return null
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error)
        return null
    }
}
