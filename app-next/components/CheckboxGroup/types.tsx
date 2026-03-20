import { StyleProp, ViewProps, ViewStyle } from 'react-native';

export type CheckboxGroupMode = 'radio' | 'block' | 'tag' | 'picker';
export type CheckboxGroupProps<T extends string | number> = Omit<ViewProps, ''> & {
  mode?: CheckboxGroupMode;
  multi?: boolean;
  value?: T[];
  onChange?: (value: T[]) => void;
  options: { key: T; label: string }[];
  itemStyle?: StyleProp<ViewStyle>;
};
