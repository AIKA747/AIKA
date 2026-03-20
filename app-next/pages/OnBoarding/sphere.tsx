import React from 'react';
import { useIntl } from 'react-intl';
import { ImageBackground, Text, TextStyle, View, TouchableOpacity } from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import { CopilotStep, useCopilot, walkthroughable } from 'react-native-copilot';
import DropShadow from 'react-native-drop-shadow';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AgoraOutline, ChatOutline, PlushFilled, SphereTwoTone, UserCircleOutline } from '@/components/Icon';
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
const blockTitle: StyleProp<TextStyle> = {
  paddingTop: pxToDp(30),
  paddingHorizontal: pxToDp(30),
  fontFamily: 'ProductSansBold',
  fontSize: pxToDp(36),
  lineHeight: pxToDp(42),
};
const blockDesc: StyleProp<TextStyle> = {
  paddingTop: pxToDp(10),
  paddingHorizontal: pxToDp(30),
  fontSize: pxToDp(24),
  lineHeight: pxToDp(29),
};
const WalkthroughableView = walkthroughable(TouchableOpacity);
export function Sphere() {
  const insets = useSafeAreaInsets();
  const intl = useIntl();
  const { start, goToNth, currentStepNumber } = useCopilot();
  const { computedThemeColor } = useConfigProvider();
  return (
    <PageView
      style={{
        position: 'relative',
      }}
      source={require('@/assets/images/onboarding/sphere.png')}>
      <DropShadow
        onLayout={() => {
          requestAnimationFrame(() => {
            start();
            goToNth(3);
          });
        }}
        style={{
          width: pxToDp(40 * 2),
          height: pxToDp(40 * 2),
          borderRadius: pxToDp(40),
          position: 'absolute',
          top: insets.top + pxToDp(24),
          right: pxToDp(16 * 2),
          shadowColor: 'rgba(32, 22, 53, 0.3)',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 4,
        }}>
        <CopilotStep text={intl.formatMessage({ id: 'copilot.sphere' })} order={3} name="Sphere">
          <WalkthroughableView
            style={{
              width: '100%',
              height: '100%',
              borderRadius: pxToDp(40),
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: computedThemeColor.primary,
            }}>
            <PlushFilled width={pxToDp(34)} height={pxToDp(34)} color="#ffffff" />
          </WalkthroughableView>
        </CopilotStep>
      </DropShadow>
      <View
        style={{
          position: 'absolute',
          flex: 1,
          width: '100%',
          bottom: insets.bottom + pxToDp(120),
          height: pxToDp(600),
          padding: pxToDp(24),
          flexDirection: 'row',
          gap: pxToDp(24),
        }}>
        <CopilotStep
          text={intl.formatMessage({ id: 'copilot.fairy-tales' })}
          order={6}
          name={intl.formatMessage({ id: 'Sphere.FairyTales' })}>
          <WalkthroughableView style={{ flex: 1 }}>
            <ImageBackground
              source={require('@/pages/Sphere/fairyTales.png')}
              imageStyle={{ borderRadius: pxToDp(28) }}
              resizeMode="cover"
              style={{ width: '100%', height: '100%' }}>
              <Text
                style={[
                  blockTitle,
                  {
                    color: '#fff',
                  },
                ]}>
                {intl.formatMessage({ id: 'Sphere.FairyTales' })}
              </Text>
              <Text
                style={[
                  blockDesc,
                  {
                    color: '#fff',
                  },
                ]}>
                {intl.formatMessage({ id: 'Sphere.FairyTales.desc' })}
              </Text>
            </ImageBackground>
          </WalkthroughableView>
        </CopilotStep>
        <View style={{ flex: 1, gap: pxToDp(24) }}>
          <CopilotStep
            text={intl.formatMessage({ id: 'copilot.games' })}
            order={4}
            name={intl.formatMessage({ id: 'Sphere.Games' })}>
            <WalkthroughableView style={{ flex: 1 }}>
              <ImageBackground
                source={require('@/pages/Sphere/games.png')}
                imageStyle={{ borderRadius: pxToDp(28) }}
                resizeMode="cover"
                style={{ width: '100%', height: '100%' }}>
                <Text
                  style={[
                    blockTitle,
                    {
                      color: '#fff',
                    },
                  ]}>
                  {intl.formatMessage({ id: 'Sphere.Games' })}
                </Text>
                <Text
                  style={[
                    blockDesc,
                    {
                      color: '#fff',
                    },
                  ]}>
                  {intl.formatMessage({ id: 'Sphere.Games.desc' })}
                </Text>
              </ImageBackground>
            </WalkthroughableView>
          </CopilotStep>
          <CopilotStep
            text={intl.formatMessage({ id: 'copilot.experts' })}
            order={5}
            name={intl.formatMessage({ id: 'Sphere.Experts' })}>
            <WalkthroughableView style={{ flex: 1 }}>
              <ImageBackground
                source={require('@/pages/Sphere/experts.png')}
                imageStyle={{ borderRadius: pxToDp(28) }}
                resizeMode="cover"
                style={{
                  width: '100%',
                  height: '100%',
                }}>
                <Text
                  style={[
                    blockTitle,
                    {
                      color: '#fff',
                    },
                  ]}>
                  {intl.formatMessage({ id: 'Sphere.Experts' })}
                </Text>
                <Text
                  style={[
                    blockDesc,
                    {
                      color: '#fff',
                    },
                  ]}>
                  {intl.formatMessage({ id: 'Sphere.Experts.desc' })}
                </Text>
              </ImageBackground>
            </WalkthroughableView>
          </CopilotStep>
        </View>
      </View>
      <View
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
        <View style={[tabItemStyle, activeTabItemStyle]}>
          <SphereTwoTone
            width={pxToDp(42)}
            height={pxToDp(42)}
            color={activeTextColor}
            twoToneColor={computedThemeColor.text_black}
          />
          <Text style={[tabItemTextStyle, activeTabItemTextStyle]}>Sphere</Text>
        </View>
        <View style={[tabItemStyle]}>
          <ChatOutline width={pxToDp(42)} height={pxToDp(42)} color={unActiveTextColor} />
          <Text style={[tabItemTextStyle]}>{intl.formatMessage({ id: 'Chats' })}</Text>
        </View>
        <View style={tabItemStyle}>
          <UserCircleOutline width={pxToDp(42)} height={pxToDp(42)} color={unActiveTextColor} />
          <Text style={tabItemTextStyle}>{intl.formatMessage({ id: 'Profile' })}</Text>
        </View>
      </View>
    </PageView>
  );
}
