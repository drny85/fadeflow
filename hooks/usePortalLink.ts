import { useCallback, useState } from 'react'
import { getPortalUrl } from '~/firebase-collections'
import * as WebBrowser from 'expo-web-browser'

WebBrowser.warmUpAsync()
export const usePortalLink = () => {
   const [loading, setLoading] = useState(false)
   const getCustomerPortal = useCallback(async () => {
      try {
         setLoading(true)
         const res = await getPortalUrl()
         WebBrowser.dismissBrowser()
         console.log(res.data)
         if (res.data.success && res.data.result) {
            WebBrowser.openBrowserAsync(res.data.result, {
               presentationStyle:
                  WebBrowser.WebBrowserPresentationStyle.FORM_SHEET
            }).then((r) => console.log(r))
            //setPortalUrl(res.data.result);
         }
      } catch (error) {
         console.log(error)
      } finally {
         setLoading(false)
      }
   }, [])

   return {
      loading,
      getCustomerPortal
   }
}
