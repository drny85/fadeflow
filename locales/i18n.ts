// src/i18n.js

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import translation files
import en from '~/locales/en.json'
import es from '~/locales/es.json'
import zh from '~/locales/zh.json'
import fr from '~/locales/fr.json'
import { getDeviceLanguage } from '~/utils/languague'

const resources = {
   en: { translation: en },
   es: { translation: es },
   zh: { translation: zh },
   fr: { translation: fr }
}
const lng = getDeviceLanguage() || 'en'

i18n
   .use(initReactI18next) // Passes i18n down to react-i18next
   .init({
      resources,
      lng,
      fallbackLng: 'en',
      compatibilityJSON: 'v3',

      interpolation: {
         escapeValue: false // React already safeguards from XSS
      }
   })

export { i18n }
