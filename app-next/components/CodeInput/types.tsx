import { StyleProp, ViewStyle } from 'react-native';

export interface CodeInputProps {
  style?: StyleProp<ViewStyle>;
  error?: boolean;

  length?: number;

  value?: string;
  onChange?: (value: string) => void;
}
