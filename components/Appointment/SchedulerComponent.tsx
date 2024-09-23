import DateTimePicker from '@react-native-community/datetimepicker'
import { startOfDay, addHours } from 'date-fns'
import React, { useState } from 'react'
import {
    View,
    TouchableOpacity,
    ScrollView,
    TextInput,
    StyleSheet
} from 'react-native'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated'

import { Text } from '../nativewindui/Text'

import { ScheduleDay, LunchBreak } from '~/shared/types' // Assuming your types are imported

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const initialSchedule: ScheduleDay[] = Array(7).fill({
    isOff: false,
    startTime: '09:00 AM',
    endTime: '08:00 PM',
    lunchBreak: { start: '12:00 PM', end: '01:00 PM' }
})

const ScheduleComponent: React.FC = () => {
    const [schedule, setSchedule] = useState<ScheduleDay[]>(initialSchedule)
    const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0)
    const [showStartPicker, setShowStartPicker] = useState(false)
    const [showEndPicker, setShowEndPicker] = useState(false)
    const [showLunchStartPicker, setShowLunchStartPicker] = useState(false)
    const [showLunchEndPicker, setShowLunchEndPicker] = useState(false)

    const dayHeight = useSharedValue(0)
    const selectedDay = schedule[selectedDayIndex]

    const animatedStyle = useAnimatedStyle(() => ({
        height: withTiming(dayHeight.value, { duration: 300 })
    }))

    const handleDayPress = (index: number) => {
        setSelectedDayIndex(index)
        dayHeight.value = 200 // Expand when a day is selected
    }

    const updateDaySchedule = (
        key: keyof ScheduleDay,
        value: string | LunchBreak
    ) => {
        const updatedSchedule = [...schedule]
        updatedSchedule[selectedDayIndex] = {
            ...updatedSchedule[selectedDayIndex],
            [key]: value
        }
        setSchedule(updatedSchedule)
    }

    const showTimePicker = (type: string) => {
        switch (type) {
            case 'start':
                setShowStartPicker(true)
                break
            case 'end':
                setShowEndPicker(true)
                break
            case 'lunchStart':
                setShowLunchStartPicker(true)
                break
            case 'lunchEnd':
                setShowLunchEndPicker(true)
                break
        }
    }

    const onChangeTime = (
        event: any,
        selectedTime: Date | undefined,
        type: string
    ) => {
        const formattedTime = selectedTime?.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        })
        switch (type) {
            case 'start':
                if (formattedTime) updateDaySchedule('startTime', formattedTime)
                setShowStartPicker(false)
                break
            case 'end':
                if (formattedTime) updateDaySchedule('endTime', formattedTime)
                setShowEndPicker(false)
                break
            case 'lunchStart':
                if (formattedTime)
                    updateDaySchedule('lunchBreak', {
                        ...selectedDay.lunchBreak,
                        start: formattedTime
                    })
                setShowLunchStartPicker(false)
                break
            case 'lunchEnd':
                if (formattedTime)
                    updateDaySchedule('lunchBreak', {
                        ...selectedDay.lunchBreak,
                        end: formattedTime
                    })
                setShowLunchEndPicker(false)
                break
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ height: 100 }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.weekdayScroll}
                >
                    {weekDays.map((day, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleDayPress(index)}
                        >
                            <View
                                style={[
                                    styles.dayButton,
                                    index === selectedDayIndex &&
                                        styles.selectedDay
                                ]}
                            >
                                <Text style={styles.dayText}>{day}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            <Animated.View style={[styles.detailsContainer, animatedStyle]}>
                {!selectedDay.isOff ? (
                    <View>
                        <Text style={styles.label}>Start Time</Text>

                        <View className="flex-row items-center justify-evenly">
                            <Text className="font-roboto-bold text-xl">
                                {selectedDay.startTime}
                            </Text>
                            <DateTimePicker
                                value={addHours(startOfDay(new Date()), 8)}
                                mode="time"
                                minuteInterval={15}
                                is24Hour={false}
                                onChange={(event, date) =>
                                    onChangeTime(event, date, 'start')
                                }
                            />
                        </View>

                        <Text style={styles.label}>End Time</Text>
                        <View className="flex-row items-center justify-evenly">
                            <Text className="font-roboto-bold text-xl">
                                {schedule[selectedDayIndex].endTime}
                            </Text>
                            <DateTimePicker
                                value={addHours(startOfDay(new Date()), 16)}
                                mode="time"
                                is24Hour={false}
                                onChange={(event, date) =>
                                    onChangeTime(event, date, 'end')
                                }
                            />
                        </View>

                        <Text style={styles.label}>Lunch Break</Text>
                        <View style={styles.lunchContainer}>
                            <TouchableOpacity
                                onPress={() => showTimePicker('lunchStart')}
                                style={styles.inputContainer}
                            >
                                <TextInput
                                    value={selectedDay.lunchBreak.start}
                                    editable={false}
                                    style={styles.input}
                                />
                            </TouchableOpacity>
                            {showLunchStartPicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="time"
                                    is24Hour={false}
                                    onChange={(event, date) =>
                                        onChangeTime(event, date, 'lunchStart')
                                    }
                                />
                            )}
                            <TouchableOpacity
                                onPress={() => showTimePicker('lunchEnd')}
                                style={styles.inputContainer}
                            >
                                <TextInput
                                    value={selectedDay.lunchBreak.end}
                                    editable={false}
                                    style={styles.input}
                                />
                            </TouchableOpacity>
                            {showLunchEndPicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="time"
                                    is24Hour={false}
                                    onChange={(event, date) =>
                                        onChangeTime(event, date, 'lunchEnd')
                                    }
                                />
                            )}
                        </View>
                    </View>
                ) : (
                    <Text>This day is off</Text>
                )}
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    weekdayScroll: {
        marginBottom: 20
    },
    dayButton: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#e0e0e0',
        marginRight: 10
    },
    selectedDay: {
        backgroundColor: '#1976d2'
    },
    dayText: {
        fontSize: 16,
        color: '#fff'
    },
    detailsContainer: {
        overflow: 'hidden',
        backgroundColor: '#fffddd',
        borderRadius: 10,
        padding: 15,
        flexGrow: 1,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold'
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#fff',
        elevation: 1
    },
    input: {
        padding: 10,
        fontSize: 16
    },
    lunchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})

export default ScheduleComponent
