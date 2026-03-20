import React from 'react';
import { GestureResponderEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { SharedValue } from 'react-native-reanimated';

export interface FloatingActionButtonItemProps {
  isExpanded: SharedValue<boolean>;
  index: number;
  onClose?: () => void;
  item: {
    icon?: React.ReactNode;
    label?: React.ReactNode;
    color?: string;
    onPress?: null | ((event: GestureResponderEvent) => void) | undefined;
  } & ({ icon: React.ReactNode } | { label: React.ReactNode });
}
export interface FloatingActionButtonProps {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  onPress?: null | ((event: GestureResponderEvent) => void) | undefined;
  items: FloatingActionButtonItemProps['item'][];
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
}
