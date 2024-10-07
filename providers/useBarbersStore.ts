import { create } from 'zustand'

import { Barber, BarberFilter } from '~/shared/types'

type BarberStoreParams = {
   barbers: Barber[]
   loading: boolean
   setLoading: (loading: boolean) => void
   setBarbers: (barbers: Barber[]) => void
   getBarberById: (id: string) => Barber
   barbersFilter: null | BarberFilter
   setBarbersFilter: (filter: BarberFilter | null) => void
}

export const useBarbersStore = create<BarberStoreParams>((set, get) => ({
   barbers: [],
   loading: false,
   barbersFilter: null,
   setBarbersFilter: (filter) => set({ barbersFilter: filter }),
   setLoading: (loading) => set({ loading }),
   setBarbers: (barbers) => set({ barbers }),
   getBarberById: (id) => get().barbers.find((barber) => barber.id === id)!
}))
