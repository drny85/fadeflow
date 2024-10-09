// src/i18n.js

import { getLocales } from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import translation files
import en from '~/locales/en.json'
import es from '~/locales/es.json'
import { getStoredLanguage } from '~/providers/languague'
const languague = getStoredLanguage()
// Detect the device language
const getDeviceLanguage = () => {
   if (languague) {
      return languague
   }
   const locales = getLocales()
   if (Array.isArray(locales)) {
      return locales[0].languageCode
   }
   return 'en' // default language
}

i18n
   .use(initReactI18next) // Passes i18n down to react-i18next
   .init({
      resources: {
         en: { translation: en },
         es: { translation: es }
      },
      lng: getDeviceLanguage() || 'en',
      fallbackLng: 'en',
      compatibilityJSON: 'v3',

      interpolation: {
         escapeValue: false // React already safeguards from XSS
      }
   })

export { i18n }
