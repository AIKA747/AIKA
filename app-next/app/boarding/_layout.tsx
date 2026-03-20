import { Stack } from 'expo-router';
import { View } from 'react-native';
import { CopilotProvider } from 'react-native-copilot';

import { CopilotTooltip } from '@/components/CopilotTooltip';
import pxToDp from '@/utils/pxToDp';

export default function OnBoardingLayout() {
  return (
    <CopilotProvider
      animated
      overlay={'svg'}
      tooltipStyle={{
        backgroundColor: 'rgba(27, 27, 34, 1)',
        borderWidth: pxToDp(1),
        borderColor: 'rgba(52, 46, 63, 1)',
        borderRadius: pxToDp(24),
      }}
      arrowColor={'transparent'} // 不展示箭头
      // stopOnOutsideClick
      androidStatusBarVisible={false}
      tooltipComponent={CopilotTooltip}
      // verticalOffset={Platform.select({ default: 0, android: -pxToDp(80) })}
      backdropColor={'rgba(0, 0, 0, 0.7)'} // 遮罩背景色
      stepNumberComponent={() => <View style={{ display: 'none' }} />}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="chats" options={{ headerShown: false }} />
        <Stack.Screen name="sphere" options={{ headerShown: false }} />
        <Stack.Screen name="fairyTales" options={{ headerShown: false }} />
        <Stack.Screen name="fairyTalesDetails" options={{ headerShown: false }} />
        <Stack.Screen name="fairyTalesChat" options={{ headerShown: false }} />
      </Stack>
    </CopilotProvider>
  );
}
