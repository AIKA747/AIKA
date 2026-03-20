import React from 'react';
import { useIntl } from 'react-intl';
import { Text, TextStyle, View } from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import { CopilotStep, walkthroughable, useCopilot } from 'react-native-copilot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AgoraFilled, ChatOutline, SphereOutline, UserCircleOutline } from '@/components/Icon';
import PageView from '@/components/PageView';
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
  height: pxToDp(100),
  gap: pxToDp(6),
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
export default function Home() {
  const insets = useSafeAreaInsets();
  const intl = useIntl();
  const { start } = useCopilot();
  return (
    <PageView
      style={{
        position: 'relative',
      }}
      source={require('@/assets/images/onboarding/home.png')}>
      <View
        onLayout={() => {
          requestAnimationFrame(() => {
            start();
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
        <CopilotStep text={intl.formatMessage({ id: 'copilot.agora' })} order={1} name="Agora">
          <WalkthroughableView style={[tabItemStyle, activeTabItemStyle]}>
            <AgoraFilled width={pxToDp(42)} height={pxToDp(42)} color={activeTextColor} />
            <Text style={[tabItemTextStyle, activeTabItemTextStyle]}>Agora</Text>
          </WalkthroughableView>
        </CopilotStep>
        <View style={tabItemStyle}>
          <SphereOutline width={pxToDp(42)} height={pxToDp(42)} color={unActiveTextColor} />
          <Text style={tabItemTextStyle}>Sphere</Text>
        </View>
        <View style={tabItemStyle}>
          <ChatOutline width={pxToDp(42)} height={pxToDp(42)} color={unActiveTextColor} />
          <Text style={tabItemTextStyle}>{intl.formatMessage({ id: 'Chats' })}</Text>
        </View>
        <View style={tabItemStyle}>
          <UserCircleOutline width={pxToDp(42)} height={pxToDp(42)} color={unActiveTextColor} />
          <Text style={tabItemTextStyle}>{intl.formatMessage({ id: 'Profile' })}</Text>
        </View>
      </View>
    </PageView>
  );
}
