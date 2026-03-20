import { View, type ViewProps } from 'react-native';

import { useConfigProvider } from '@/hooks/useConfig';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const { computedThemeColor } = useConfigProvider();

  return <View style={[{ backgroundColor: computedThemeColor.bg_primary }, style]} {...otherProps} />;
}
