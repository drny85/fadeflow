import React from 'react'

import ModernSettingsPage from '~/components/ModernSettingsPage'
import { useStatusBarColor } from '~/hooks/useStatusBarColor'

const BarberProfile = () => {
    useStatusBarColor('light')
    return <ModernSettingsPage />
}

export default BarberProfile
