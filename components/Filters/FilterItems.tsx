import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native' // assuming the type is in a separate file
import Animated, {
   useSharedValue,
   useAnimatedStyle,
   withSpring
} from 'react-native-reanimated'
import { useColorScheme } from '~/lib/useColorScheme'
import { Appointment, AppointmentStatus } from '~/shared/types'
import { Text } from '../nativewindui/Text'
import { Button } from '../Button'
import { useAppointmentStore } from '~/providers/useAppointmentStore'

const CIRCLE_SIZE = 24

const statusOptions: AppointmentStatus[] = [
   'pending',
   'confirmed',
   'cancelled',
   'completed',
   'no-show'
]
type Props = {
   appointments: Appointment[]
   onPress: () => void
}

const AnimatedCheckbox = ({ isSelected }: { isSelected: boolean }) => {
   const scale = useSharedValue(1)
   const { colors } = useColorScheme()

   // Trigger animation on selection change
   scale.value = withSpring(isSelected ? 1.2 : 1, {
      stiffness: 300,
      damping: 15
   })

   // Style with animation
   const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }]
   }))

   return (
      <Animated.View
         style={[
            {
               width: CIRCLE_SIZE,
               height: CIRCLE_SIZE,
               borderRadius: CIRCLE_SIZE / 2,
               borderColor: colors.accent,
               borderWidth: 2,
               justifyContent: 'center',
               marginVertical: 4,
               alignItems: 'center',
               backgroundColor: isSelected ? colors.primary : colors.accent
            },
            animatedStyle
         ]}
      >
         <Animated.View
            style={[
               {
                  width: CIRCLE_SIZE - 4,
                  height: CIRCLE_SIZE - 4,
                  borderRadius: (CIRCLE_SIZE - 4) / 2,
                  borderColor: '#000',

                  backgroundColor: isSelected
                     ? colors.primary
                     : colors.background
               },
               animatedStyle
            ]}
         />
      </Animated.View>
   )
}

const AppointmentFilter = ({ appointments, onPress }: Props) => {
   const [selectedStatuses, setSelectedStatuses] = useState<
      AppointmentStatus[]
   >(['cancelled', 'completed', 'confirmed', 'no-show', 'pending'])
   const { setFiltered, setFilteredAppointments } = useAppointmentStore()

   const toggleStatus = (status: AppointmentStatus) => {
      if (selectedStatuses.includes(status)) {
         setSelectedStatuses(selectedStatuses.filter((s) => s !== status))
      } else {
         setSelectedStatuses([...selectedStatuses, status])
      }
   }

   const onApplyFilter = () => {
      const filteredAppointments = appointments.filter(
         (appointment) =>
            selectedStatuses.length === 0 ||
            selectedStatuses.includes(appointment.status)
      )

      setFilteredAppointments(
         filteredAppointments.sort((a, b) => (a.date > b.date ? 1 : -1))
      )
      setFiltered(true)
      onPress()
   }

   return (
      <View style={{ padding: 20 }}>
         {/* Checkboxes for filtering */}
         {statusOptions.map((status) => (
            <TouchableOpacity
               key={status}
               onPress={() => toggleStatus(status)}
               style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 5
               }}
            >
               <AnimatedCheckbox
                  isSelected={selectedStatuses.includes(status)}
               />
               <Text style={{ marginLeft: 10 }}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
               </Text>
            </TouchableOpacity>
         ))}

         <View className="mt-5">
            <Button title="Apply Filter" onPress={onApplyFilter} />
         </View>
      </View>
   )
}

export default AppointmentFilter
