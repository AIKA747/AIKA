import { ViewProps } from 'react-native';

export type CheckboxGroupProps<T> = Omit<ViewProps, ''> & {
  value?: T;
  onChange?: (value?: T) => void;
  options: { key: T; label: string }[];
};
