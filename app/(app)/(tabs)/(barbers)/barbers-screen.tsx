import { useMemo } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import BarberImageHeader from '~/components/BarberImageHeader';
import { Text } from '~/components/nativewindui/Text';
import BarbersSkelenton from '~/components/Skeletons/BarbersSkeleton';
import { useNavigationSearch } from '~/hooks/useNavigationSeach';
import { useBarbersStore } from '~/providers/useBarbersStore';

const BarbersPage = () => {
   const { barbers, loading } = useBarbersStore();

   const search = useNavigationSearch({
      searchBarOptions: {
         placeholder: 'Search Barbers',
      },
   });

   const searchData = useMemo(() => {
      if (!search) return barbers;
      return barbers.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));
   }, [search, barbers]);

   if (loading) return <BarbersSkelenton />;
   return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
         <FlatList
            data={searchData}
            scrollEnabled={false}
            ListEmptyComponent={
               <View className="mt-10 flex-1 items-center justify-center">
                  <Text className="text-xl text-muted">No Barbers Found</Text>
               </View>
            }
            // contentContainerClassName="p-2 mb-3"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
               <View className="m-2">
                  <BarberImageHeader
                     showTopControl={false}
                     barber={item}
                     showBookingButton={true}
                     onPressBack={() => {}}
                  />
               </View>
               // <BarberCard barber={item} index={index} isOwner={false} />
            )}
         />
      </ScrollView>
   );
};

export default BarbersPage;
