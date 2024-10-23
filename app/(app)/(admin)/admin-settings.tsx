import { View, Text } from 'react-native'
import React from 'react'
import { Container } from '~/components/Container'
import { ThemeToggle } from '~/components/nativewindui/ThemeToggle'
import LogoutButton from '~/components/LogoutButton'

const AdminSttings = () => {
   return (
      <Container>
         <View className="flex-row justify-evenly items-center mt-2">
            <ThemeToggle />
            <LogoutButton />
         </View>
      </Container>
   )
}

export default AdminSttings
