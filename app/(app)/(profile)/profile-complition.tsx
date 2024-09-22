import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { z } from 'zod';
import { updateUser } from '~/actions/users';
import { Button } from '~/components/Button';
import KeyboardScreen from '~/components/KeyboardScreen';
import TextInput from '~/components/TextInput';
import { toastMessage } from '~/lib/toast';
import { useAuth } from '~/providers/AuthContext';
import { getCoordinatesFromProfile } from '~/utils/getCoordinates';

const profileScheme = z.object({
   barbershopName: z.string().min(3, { message: 'Name is too short' }),
   bio: z.string().optional(),
   address: z.string().min(3, { message: 'Address is too short' }),
   apt: z.string().optional(),
   city: z.string().min(3, { message: 'City is too short' }),
   state: z.string().min(2, { message: 'State is invalid' }),
   zip: z.string().min(5, { message: 'Zip is too short' }),
   phone: z.string().min(14, { message: 'Phone is too short' }),
   country: z.string().min(3, { message: 'Country is too short' }),
});

type Profile = z.infer<typeof profileScheme>;

const ProfileComplition = () => {
   const { user } = useAuth();
   const profile = user?.isBarber && user.profile;
   const {
      control,
      handleSubmit,
      formState: { isSubmitting, isLoading },
   } = useForm<Profile>({
      defaultValues: {
         barbershopName: (profile && profile.barbershopName) || '',
         address: (profile && profile.address) || '',
         apt: (profile && profile.apt) || '',
         city: (profile && profile.city) || '',
         state: (profile && profile.state) || '',
         zip: (profile && profile.zip) || '',
         phone: (profile && profile.phone) || user?.phone || '',
         bio: (profile && profile.bio) || '',
         country: (profile && profile.country) || 'United States',
      },
      resolver: zodResolver(profileScheme),
   });

   const onSubmit = async (data: Profile) => {
      if (!user || !user.isBarber) return;
      try {
         const coords = await getCoordinatesFromProfile({ ...data, coords: null });

         const saved = await updateUser({
            ...user,
            profile: { ...data, coords },
            profileCompleted: true,
            phone: data.phone,
         });
         if (saved) {
            toastMessage({
               title: 'success',
               message: 'Profile updated',
               preset: 'done',
            });
            router.dismiss();
         }
      } catch (error) {
         console.log(error);
      }
   };
   return (
      <KeyboardScreen style={{ flex: 1 }}>
         <ScrollView contentContainerClassName="p-2 gap-2" showsVerticalScrollIndicator={false}>
            <TextInput
               control={control}
               autoFocus
               name="barbershopName"
               placeholder="Barbershop Name"
               autoCapitalize="words"
            />
            <TextInput control={control} name="bio" multiline placeholder="About me (optional)" />
            <TextInput
               control={control}
               name="address"
               placeholder="Address"
               autoCapitalize="words"
            />
            <TextInput control={control} name="apt" placeholder="Apt, Suite, etc (optional)" />
            <TextInput control={control} name="city" placeholder="City" autoCapitalize="words" />
            <View className=" w-[100%] flex-row gap-2">
               <TextInput
                  control={control}
                  containerStyle={{ flex: 0.5 }}
                  name="state"
                  placeholder="State"
                  className="w-full"
                  maxLength={2}
               />
               <TextInput
                  containerStyle={{ flex: 0.5 }}
                  control={control}
                  name="zip"
                  placeholder="Zip"
                  keyboardType="numeric"
               />
            </View>
            <TextInput
               control={control}
               name="phone"
               placeholder="(718) 777-8899"
               keyboardType="numeric"
            />

            <TextInput
               control={control}
               defaultValue="United States"
               name="country"
               placeholder="Country"
            />

            <Button
               title="Save"
               onPress={handleSubmit(onSubmit)}
               disabled={isSubmitting}
               isLoading={isSubmitting || isLoading}
            />
         </ScrollView>
      </KeyboardScreen>
   );
};

export default ProfileComplition;
