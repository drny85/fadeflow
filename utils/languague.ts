import { getStoredLanguage } from '~/providers/languague'
import { getLocales } from 'expo-localization'
import { Languague } from '~/shared/types'
const languague = getStoredLanguage()
// Detect the device language
export const getDeviceLanguage = (): Languague => {
   if (languague) {
      return languague
   }
   const locales = getLocales()
   if (Array.isArray(locales)) {
      const l = locales[0].languageCode
      if (!l) return 'en'
      if (l.startsWith('es')) return 'es'
      if (l.startsWith('en')) return 'en'
   }
   return 'en' // default language
}
