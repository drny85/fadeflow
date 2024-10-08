import { useTranslation } from 'react-i18next'

export const useTranslate = () => {
   const { t } = useTranslation()
   const translate = t
   return translate
}
