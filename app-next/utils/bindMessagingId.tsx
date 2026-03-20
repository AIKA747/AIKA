import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { router } from 'expo-router';
import { Alert, Linking } from 'react-native';

import { notification } from '@/components/NoticeBar';
import { NoticeBarRouteMap, NoticeType } from '@/components/NoticeBar/types';
import { getIntl } from '@/hooks/useLocale';
import { postUserAppFirebaseBindToken } from '@/services/userService';

/**
 * 绑定firebase推送token
 */
export async function bindMessagingId() {
  const intl = getIntl();
  const messagingInstance = messaging();
  const authStatus = await messagingInstance.requestPermission();
  const enabled = [
    messaging.AuthorizationStatus.AUTHORIZED,
    messaging.AuthorizationStatus.PROVISIONAL,
    messaging.AuthorizationStatus.EPHEMERAL,
  ].includes(authStatus);
  console.log('message authorization status:', `authStatus: ${authStatus} , `, `enabled: ${enabled}`);

  function goSetting() {
    // 开发模式太打扰了
    // if (process.env.NODE_ENV === 'development') {
    //   return;
    // }
    Alert.alert(
      intl.formatMessage({ id: 'bindMessagingId.openSetting.title' }),
      intl.formatMessage({ id: 'bindMessagingId.openSetting.content' }),
      [
        {
          text: intl.formatMessage({ id: 'bindMessagingId.openSetting.go' }),
          onPress: () => {
            Linking.openSettings();
          },
        },
      ],
    );
  }
  if (!enabled) {
    console.log('通知已禁用, 请在设置中启用通知权限');
    goSetting();
  }

  try {
    const fcmToken = await messagingInstance.getToken();
    console.log('message token', fcmToken);
    await postUserAppFirebaseBindToken({
      token: fcmToken,
    });
  } catch (e) {
    console.log('FCM Token Error', e instanceof Error ? e.message : '获取 FCM Token 失败');
  }

  const handleOpenAppByNotification = (message: FirebaseMessagingTypes.RemoteMessage) => {
    const data = message.data || {};
    console.log('Notification data:', data);

    const notificationType = message.data?.type as NoticeType | undefined;

    if (notificationType && NoticeBarRouteMap[notificationType]) {
      try {
        const routeHandler = NoticeBarRouteMap[notificationType];
        router.push({
          pathname: routeHandler.pathname as any,
          params: routeHandler.params(data as Record<string, string>),
        });
      } catch (error) {
        console.error(`Error handling notification type ${notificationType}:`, error);
        console.log('Notification data:', data);
      }
    } else {
      console.log('Unhandled notification type:', notificationType);
      console.log('Full message:', JSON.stringify(message));
    }
  };

  const message = await messagingInstance.getInitialNotification();
  if (message) {
    handleOpenAppByNotification(message);
  }

  const unsubscribe = messagingInstance.onMessage(async (message) => {
    console.log('A new FCM message arrived!', JSON.stringify(message, null, 2));
    notification({
      title: message.notification?.title,
      body: message.notification?.body,
      type: message.data?.type as NoticeType | undefined,
      id: (message.data?.id as string) || undefined,
    });
  });

  messagingInstance.setBackgroundMessageHandler(async (message) => {
    console.log('Message handled in the background!', message);
    handleOpenAppByNotification(message);
  });

  const unsubscribeOpenedApp = messagingInstance.onNotificationOpenedApp((message) => {
    console.log('onNotificationOpenedApp', message);
    handleOpenAppByNotification(message);
  });

  return () => {
    unsubscribe();
    unsubscribeOpenedApp();
  };
}
