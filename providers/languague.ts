import { MMKV } from 'react-native-mmkv'
import { Languague } from '~/shared/types'

export const storage = new MMKV({
   id: 'fadeflow-languague-storage'
})

// Functions to get/set data from MMKV
export const getStoredLanguage = (): Languague | null => {
   return storage.getString('language') as Languague | null
}

export const setStoredLanguage = (language: Languague) => {
   storage.set('language', language)
}
