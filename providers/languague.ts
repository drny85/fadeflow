import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV({
   id: 'fadeflow-languague-storage'
})

// Functions to get/set data from MMKV
export const getStoredLanguage = (): string | null => {
   return storage.getString('language') || null
}

export const setStoredLanguage = (language: string) => {
   storage.set('language', language)
}
