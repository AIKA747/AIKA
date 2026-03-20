import React from 'react';
import { useIntl } from 'react-intl';
import { Text, TextStyle, View } from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import { CopilotStep, useCopilot, walkthroughable } from 'react-native-copilot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AgoraOutline, MessagesTwoTone, SphereOutline, UserCircleOutline } from '@/components/Icon';
import PageView from '@/components/PageView';
import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

// 选中状态文字
const activeTextColor = '#FFFFFF';
// 未选中状态文字
const unActiveTextColor = '#80878E';
const tabItemStyle: StyleProp<ViewStyle> = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: pxToDp(32),
  gap: pxToDp(6),
  height: pxToDp(100),
};
const tabItemTextStyle: StyleProp<TextStyle> = {
  fontSize: pxToDp(24),
  color: unActiveTextColor,
};

const activeTabItemStyle: StyleProp<ViewStyle> = {
  backgroundColor: '#1B1B22',
};
const activeTabItemTextStyle: StyleProp<TextStyle> = {
  color: activeTextColor,
};
const WalkthroughableView = walkthroughable(View);
export default function Chats() {
  const insets = useSafeAreaInsets();
  const intl = useIntl();
  const { start, goToNth } = useCopilot();
  const { computedThemeColor } = useConfigProvider();
  return (
    <PageView
      style={{
        position: 'relative',
      }}
      source={require('@/assets/images/onboarding/chats.png')}>
      <View
        onLayout={() => {
          requestAnimationFrame(() => {
            start();
            goToNth(2);
          });
        }}
        style={{
          position: 'absolute',
          bottom: 0,
          paddingBottom: insets.bottom + pxToDp(12),
          left: pxToDp(20),
          right: pxToDp(20),
          backgroundColor: '#0B0C0A',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: pxToDp(10),
        }}>
        <View style={[tabItemStyle]}>
          <AgoraOutline width={pxToDp(42)} height={pxToDp(42)} color={unActiveTextColor} />
          <Text style={[tabItemTextStyle]}>Agora</Text>
        </View>
        <View style={tabItemStyle}>
          <SphereOutline width={pxToDp(42)} height={pxToDp(42)} color={unActiveTextColor} />
          <Text style={tabItemTextStyle}>Sphere</Text>
        </View>
        <CopilotStep
          text={intl.formatMessage({ id: 'copilot.chats' })}
          order={2}
          name={intl.formatMessage({ id: 'Chats' })}>
          <WalkthroughableView style={[tabItemStyle, activeTabItemStyle]}>
            <MessagesTwoTone
              width={pxToDp(42)}
              height={pxToDp(42)}
              color={activeTextColor}
              twoToneColor={computedThemeColor.text_black}
            />
            <Text style={[tabItemTextStyle, activeTabItemTextStyle]}>{intl.formatMessage({ id: 'Chats' })}</Text>
          </WalkthroughableView>
        </CopilotStep>
        <View style={tabItemStyle}>
          <UserCircleOutline width={pxToDp(42)} height={pxToDp(42)} color={unActiveTextColor} />
          <Text style={tabItemTextStyle}>{intl.formatMessage({ id: 'Profile' })}</Text>
        </View>
      </View>
    </PageView>
  );
}
