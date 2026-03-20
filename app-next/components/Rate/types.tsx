import { ViewProps } from 'react-native';

export type RatingProps = Omit<ViewProps, ''> & {
  value: number;
  color?: string;
  size?: number;
  onChange?: (value: number) => void;
};
