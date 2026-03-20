import { withObservables } from '@nozbe/watermelondb/react';
// eslint-disable-next-line import/named
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import React, { ReactNode } from 'react';
import { useIntl } from 'react-intl';
import { Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Badge from '@/components/Badge';
import { HapticTab } from '@/components/HapticTab';
import {
  AgoraFilled,
  AgoraOutline,
  ChatOutline,
  MessagesTwoTone,
  SphereOutline,
  SphereTwoTone,
  UserCircleFilled,
  UserCircleOutline,
} from '@/components/Icon';
import { AFEventKey } from '@/constants/AFEventKey';
import { observeUnreadCount } from '@/database/services';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import { sendAppsFlyerEvent } from '@/utils/appsFlyerEvent';
import pxToDp from '@/utils/pxToDp';

function TabLayout({ unreadTotal = 0 }: { unreadTotal: number }) {
  const intl = useIntl();
  const insets = useSafeAreaInsets();
  const { computedThemeColor, computedTheme, eventEmitter } = useConfigProvider();

  // 未选中状态文字
  const unActiveTextColor = computedTheme === Theme.LIGHT ? '#A07BED' : '#80878E';
  // 选中状态文字
  const activeTextColor = '#FFFFFF';

  // 未选中状态背景
  const unActiveBgColor = '#0B0C0A';
  // 选中状态背景
  const activeBgColor = computedTheme === Theme.LIGHT ? computedThemeColor.bg_secondary : '#1B1B22';

  const renderTabButton = (
    props: BottomTabBarButtonProps & {
      icon: ReactNode;
      selectedIcon: ReactNode;
      onDoubleClick?: () => void;
    },
  ) => {
    const { accessibilityState, accessibilityLargeContentTitle, icon, selectedIcon, ...rest } = props;
    const { selected = false } = accessibilityState || {
      selected: props['aria-selected'] || false,
    };
    return (
      <HapticTab
        {...rest}
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: pxToDp(12),
          paddingBlockStart: pxToDp(4),
        }}>
        <View
          style={[
            {
              flex: 1,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: pxToDp(12),
              borderRadius: pxToDp(28),
              paddingVertical: pxToDp(6),
              backgroundColor: selected ? activeBgColor : unActiveBgColor,
            },
          ]}>
          <View>{selected ? selectedIcon : icon}</View>
          <Text
            style={[
              {
                fontSize: pxToDp(20),
                fontFamily: 'ProductSansRegular',
                color: selected ? activeTextColor : unActiveTextColor,
              },
            ]}>
            {accessibilityLargeContentTitle}
          </Text>
        </View>
      </HapticTab>
    );
  };

  return (
    <Tabs
      screenOptions={{
        lazy: false,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarHideOnKeyboard: true,
        tabBarStyle: Platform.select({
          ios: {
            height: pxToDp(89 + insets.bottom * 2),
            borderTopColor:
              computedTheme === Theme.LIGHT ? computedThemeColor.bg_secondary : computedThemeColor.bg_primary,
            backgroundColor: '#0B0C0A',
          },
          default: {
            height: pxToDp(110 + insets.bottom),
            borderColor:
              computedTheme === Theme.LIGHT ? computedThemeColor.bg_secondary : computedThemeColor.bg_primary,
            backgroundColor: '#0B0C0A',
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Agora',
          tabBarButton: (props) => {
            return renderTabButton({
              ...props,
              icon: <AgoraOutline width={pxToDp(42)} height={pxToDp(42)} color={unActiveTextColor} />,
              selectedIcon: <AgoraFilled width={pxToDp(42)} height={pxToDp(42)} color={activeTextColor} />,
              onPressIn: (e) => {
                sendAppsFlyerEvent(AFEventKey.AFAgoraTabClicked);
                props.onPressIn?.(e);
              },
              ...(props?.['aria-selected']
                ? {
                    onPress: () => {
                      eventEmitter?.emit({ method: 'home_page_back_top' });
                    },
                  }
                : {}),
            });
          },
        }}
      />

      <Tabs.Screen
        name="sphere"
        options={{
          title: 'Sphere',
          tabBarButton: (props) => {
            return renderTabButton({
              ...props,
              selectedIcon: (
                <SphereTwoTone
                  width={pxToDp(42)}
                  height={pxToDp(42)}
                  color={activeTextColor}
                  twoToneColor={computedThemeColor.text_black}
                />
              ),
              icon: <SphereOutline width={pxToDp(42)} height={pxToDp(42)} color={unActiveTextColor} />,
              onPressIn: (e) => {
                sendAppsFlyerEvent(AFEventKey.AFSphereTabClicked);
                props.onPressIn?.(e);
              },
            });
          },
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: intl.formatMessage({ id: 'Chats' }),
          tabBarButton: (props) => {
            return renderTabButton({
              ...props,
              icon: (
                <Badge
                  count={unreadTotal}
                  offset={{
                    x: -pxToDp(26),
                    y: -pxToDp(2),
                  }}>
                  <ChatOutline width={pxToDp(42)} height={pxToDp(42)} color={unActiveTextColor} />
                </Badge>
              ),
              selectedIcon: (
                <Badge
                  count={unreadTotal}
                  offset={{
                    x: -pxToDp(26),
                    y: -pxToDp(2),
                  }}>
                  <MessagesTwoTone
                    width={pxToDp(42)}
                    height={pxToDp(42)}
                    color={activeTextColor}
                    twoToneColor={computedThemeColor.text_black}
                  />
                </Badge>
              ),
              onPressIn: (e) => {
                sendAppsFlyerEvent(AFEventKey.AFChatsTabClicked);
                props.onPressIn?.(e);
              },
            });
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: intl.formatMessage({ id: 'Profile' }),
          tabBarButton: (props) => {
            return renderTabButton({
              ...props,
              icon: <UserCircleOutline width={pxToDp(42)} height={pxToDp(42)} color={unActiveTextColor} />,
              selectedIcon: <UserCircleFilled width={pxToDp(42)} height={pxToDp(42)} color={activeTextColor} />,
              onPressIn: (e) => {
                sendAppsFlyerEvent(AFEventKey.AFProfileTabClicked);
                props.onPressIn?.(e);
              },
            });
          },
        }}
      />
    </Tabs>
  );
}

export default withObservables([], () => ({
  unreadTotal: observeUnreadCount(),
}))(TabLayout);
