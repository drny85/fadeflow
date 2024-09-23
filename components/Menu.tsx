import React, { useState, useRef } from 'react';
import { View, Button, Text } from 'react-native';
import * as DropdownMenu from 'zeego/dropdown-menu';

type MenuItemType = {
   label: string;
   action: () => void;
};

type ResageMenuProps = {
   items: MenuItemType[];
};

const MenuItems: React.FC<ResageMenuProps> = ({ items }) => {
   const [visible, setVisible] = useState(false);
   const buttonRef = useRef(null);

   return <View />;
};

export default MenuItems;
