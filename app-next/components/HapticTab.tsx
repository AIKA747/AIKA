import { type BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

import useOnDoublePress from '@/hooks/useOnDoublePress';

export function HapticTab(props: BottomTabBarButtonProps & { onDoubleClick?: () => void }) {
  const { onDoublePress } = useOnDoublePress();
  return (
    <PlatformPressable
      {...props}
      android_ripple={{ color: 'transparent' }}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onDoublePress({
          onClick: () => props.onPressIn?.(ev),
          onDoubleClick: () => props?.onDoubleClick?.(),
        });
      }}
    />
  );
}
