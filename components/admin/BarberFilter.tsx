import { View } from 'react-native'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { useSettingsStore } from '~/providers/useSettingsStore'

const BarberFilter = () => {
   const { setShowAllIndex, showAllIndex } = useSettingsStore()

   return (
      <View
         style={{
            height: 40,
            width: '50%',
            alignSelf: 'flex-end'
         }}
      >
         <SegmentedControl
            values={['Active', 'All']}
            selectedIndex={showAllIndex}
            style={{
               width: '100%',
               height: '100%',
               alignSelf: 'flex-end'
            }}
            onChange={(val) => {
               setShowAllIndex(val.nativeEvent.selectedSegmentIndex)
            }}
         />
      </View>
   )
}

export default BarberFilter
