type Coords = {
    lat: number
    lng: number
}

export function getDistanceFromLatLonInMeters(
    loc1: Coords,
    loc2: Coords
): number {
    function deg2rad(deg: number): number {
        return deg * (Math.PI / 180)
    }

    const R = 6371000 // Radius of the Earth in meters
    const dLat = deg2rad(loc2.lat - loc1.lat)
    const dLon = deg2rad(loc2.lng - loc1.lng)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(loc1.lat)) *
            Math.cos(deg2rad(loc2.lat)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distance in meters
    const distanceInMiles = distance / 1609.34 // Convert meters to miles

    return distanceInMiles
}
