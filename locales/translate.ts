import i18n from 'i18next'

import { Translation } from './Translation'

export function translation<
   K1 extends keyof Translation,
   K2 extends keyof Translation[K1],
   K3 extends keyof Translation[K1][K2]
>(key1: K1, key2?: K2, key3?: K3): string {
   if (key3 !== undefined && key2 !== undefined) {
      // If all three keys are provided, format the key as 'key1.key2.key3'
      return i18n.t(`${key1}.${String(key2)}.${String(key3)}`)
   }

   if (key2 !== undefined) {
      // If two keys are provided, format the key as 'key1.key2'
      return i18n.t(`${key1}.${String(key2)}`)
   }

   // Otherwise, return the top-level key as 'key1'
   return i18n.t(`${key1}`)
}
// // Enforce typing when accessing translations
// export const translate = (
//    key: keyof Translation,
//    options?: any
// ): string | any => {
//    return i18n.t(key as string, options)
// }
