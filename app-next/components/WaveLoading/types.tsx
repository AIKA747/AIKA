import { StyleProp, ViewStyle } from 'react-native';

export type DotLoadingProps = {
  size?: number;
  repeat?: number;
  color?: string;
  style?: StyleProp<ViewStyle> | undefined;
  run: boolean;
};
