import { Feather } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import * as DropdownMenu from 'zeego/dropdown-menu';

type MenuItemType = {
   items: Array<{
      key: string;
      title: string;

      icon?: string;
      iconAndroid?: string;
   }>;
   onSelect: (key: string) => void;
};

const MenuItems = ({ items, onSelect }: MenuItemType) => {
   return (
      <DropdownMenu.Root>
         <DropdownMenu.Trigger>
            <TouchableOpacity>
               <Feather name="menu" size={26} />
            </TouchableOpacity>
         </DropdownMenu.Trigger>
         {/* @ts-ignore */}
         <DropdownMenu.Content>
            {items.map((item, index) => (
               <DropdownMenu.Item key={index.toString()} onSelect={() => onSelect(item.title)}>
                  <DropdownMenu.ItemTitle>{item.title}</DropdownMenu.ItemTitle>
                  <DropdownMenu.ItemIcon
                     androidIconName={item.iconAndroid}
                     ios={{
                        name: item.icon,
                        pointSize: 18,
                     }}
                  />
               </DropdownMenu.Item>
            ))}
         </DropdownMenu.Content>
      </DropdownMenu.Root>
   );
};

export default MenuItems;
