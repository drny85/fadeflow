import { useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { SearchBarProps } from 'react-native-screens';
import { COLORS } from '~/theme/colors';

const defaultSearchOptions: SearchBarProps = {
   tintColor: COLORS.light.accent,
   hideWhenScrolling: false,
};

export const useNavigationSearch = ({
   searchBarOptions,
}: {
   searchBarOptions?: SearchBarProps;
}) => {
   const [search, setSearch] = useState('');

   const navigation = useNavigation();

   const handleOnChangeText: SearchBarProps['onChangeText'] = ({ nativeEvent: { text } }) => {
      setSearch(text);
   };

   useLayoutEffect(() => {
      navigation.setOptions({
         headerSearchBarOptions: {
            ...defaultSearchOptions,
            ...searchBarOptions,
            onChangeText: handleOnChangeText,
         },
      });
   }, [navigation, searchBarOptions]);

   return search;
};