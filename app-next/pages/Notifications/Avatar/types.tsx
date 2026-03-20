import { StyleProp, ViewStyle } from 'react-native';

export interface AvatarProps {
  size?: number;
  images: string[];
  shape?: 'square' | 'circle';
  style?: StyleProp<ViewStyle>;
}
