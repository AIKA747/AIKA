import { ViewProps } from 'react-native';

export type SwitchProps = Omit<ViewProps, ''> & {
  value?: boolean;
  loading?: boolean;
  onChange?: (value: boolean) => void;
  trackColors?: { on: string; off: string };
};
