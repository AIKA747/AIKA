import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import RootSiblingsManager from 'react-native-root-siblings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NoticeBarProps, NoticeBarRouteMap } from '@/components/NoticeBar/types';
import FontFamily from '@/constants/FontFamily';
import pxToDp from '@/utils/pxToDp';
let rootNode: RootSiblingsManager | null;
export function notification(props: Omit<NoticeBarProps, 'onClose'>) {
  const onClose = () => {
    rootNode?.destroy();
    rootNode = null;
  };
  if (rootNode) {
    onClose();
  }
  rootNode = new RootSiblingsManager(<NoticeBar {...props} onClose={onClose} />);
  return onClose;
}

function NoticeBar(props: NoticeBarProps) {
  const { title, body, id, type, onClose } = props;

  const insets = useSafeAreaInsets();

  const timeRef = useRef<NodeJS.Timeout>(undefined);
  useEffect(() => {
    timeRef.current = setTimeout(props.onClose, 5000);
  }, [props.onClose]);

  const handleAction = useCallback(() => {
    if (type && id && NoticeBarRouteMap[type]) {
      try {
        const routeHandler = NoticeBarRouteMap[type];
        router.push({
          pathname: routeHandler.pathname as any,
          params: routeHandler.params({ id } as Record<string, string>),
        });
      } catch (error) {
        console.error(`Error handling notification type ${type}:`, error);
      }
    } else {
      console.log('Unhandled notification type:', type);
    }
  }, [type, id]);

  return (
    <Animated.View
      entering={FadeInUp.duration(100)}
      exiting={FadeOutUp.duration(100)}
      style={{
        position: 'absolute',
        top: insets.top + pxToDp(24),
        left: '3.2%',
        width: '93.6%',
        zIndex: 99,
        backgroundColor: '#ffffffee',
        borderRadius: pxToDp(16),
        overflow: 'hidden',
      }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          clearTimeout(timeRef.current);
          onClose();
          if (id) handleAction();
        }}
        onPressIn={() => clearTimeout(timeRef.current)}
        onPressOut={() => {
          clearTimeout(timeRef.current);
          onClose();
        }}
        style={{ flexDirection: 'row', alignItems: 'center', padding: pxToDp(20) }}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={{
            width: pxToDp(88),
            height: pxToDp(88),
            borderRadius: pxToDp(12),
            overflow: 'hidden',
          }}
        />
        <View style={{ flex: 1, marginLeft: pxToDp(24), gap: pxToDp(14) }}>
          {!!title && (
            <Text
              style={{
                fontSize: pxToDp(28),
                lineHeight: pxToDp(32),
                fontFamily: FontFamily.InterSemiBold,
                marginBottom: pxToDp(1),
                letterSpacing: pxToDp(0.2),
                color: '#222222',
              }}>
              {title}
            </Text>
          )}

          {!!body && (
            <Text
              style={{
                fontSize: pxToDp(22),
                lineHeight: pxToDp(28),
                fontFamily: FontFamily.InterRegular,
                letterSpacing: pxToDp(0.2),
                color: '#3f3f3f',
              }}>
              {body}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
