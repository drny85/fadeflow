import { create } from 'zustand'

type SettingsStore = {
   showAllIndex: number
   setShowAllIndex: (showAllIndex: number) => void
}
export const useSettingsStore = create<SettingsStore>((set) => ({
   showAllIndex: 0,
   setShowAllIndex: (showAllIndex: number) => set({ showAllIndex })
}))
