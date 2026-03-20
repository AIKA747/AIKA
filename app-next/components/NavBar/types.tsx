import { ReactNode } from 'react';
import { ViewProps } from 'react-native';

import { Theme } from '@/hooks/useConfig/types';

export type NavBarProps = Omit<ViewProps, ''> & {
  position?: 'Normal' | 'Sticky';
  theme?: Theme;
  title?: ReactNode;
  more?: ReactNode;
  onBack?: () => void;
  isShowShadow?: boolean;
};
