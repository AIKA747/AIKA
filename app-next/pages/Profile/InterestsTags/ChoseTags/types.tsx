import { StyleProp, ViewStyle } from 'react-native';

export interface ChoseTagsProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  style?: StyleProp<ViewStyle>;
  page: 'sign' | 'profile';
}
