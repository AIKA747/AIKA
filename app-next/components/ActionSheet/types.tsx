import { ReactNode } from 'react';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

export interface ActionSheetItem {
  icon?: ReactNode;
  label: ReactNode;
  value: string;
  type?: 'default' | 'danger';
  style?: StyleProp<ViewStyle> | undefined;
}
export interface ActionSheetProps {
  position?: 'CENTER' | 'BOTTOM';
  layout?: 'horizontal' | 'vertical';
  visible?: boolean;
  title: string;
  items: ActionSheetItem[];
  value?: string;
  onChange: (value: string) => void;
  onCancel?: () => void;
  cancelText?: string;
}
