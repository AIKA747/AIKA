import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import dayjs from 'dayjs';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { isEmpty } from 'lodash';
import { PostHogProvider, PostHogSurveyProvider, usePostHog } from 'posthog-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { AppState, Linking, Platform } from 'react-native';
import appsFlyer from 'react-native-appsflyer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import DevTag from '@/components/DevTag';
import SplashScreen from '@/components/SplashScreen';
import { AFEventKey } from '@/constants/AFEventKey';
import { posthog } from '@/constants/posthog';
import { IsHideCopilot } from '@/constants/StorageKey';
import { database } from '@/database';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import ChatClientProvider from '@/hooks/useChatClient';
import ConfigProvider, { useConfigProvider } from '@/hooks/useConfig';
import { Theme } from '@/hooks/useConfig/types';
import GroupChatProvider from '@/hooks/useGroupChat';
import LocaleProvider, { useLocale } from '@/hooks/useLocale';
import { useStorageState } from '@/hooks/useStorageState';
import VideoProvider from '@/hooks/useVideo';
// eslint-disable-next-line import/order
import { messageMap } from '@/i18n';
import 'dayjs/locale/ru';
import 'dayjs/locale/fr';
import 'dayjs/locale/kk';
import 'dayjs/locale/en';
import 'dayjs/locale/zh';
import 'dayjs/locale/ja';
import 'dayjs/locale/ko';

import '@/utils/globalStylesReset';

import { sendAppsFlyerEvent } from '@/utils/appsFlyerEvent';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

GoogleSignin.configure({
  scopes: [],
  // scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  webClientId: Platform.select({
    android: '600258585781-j390oma5qjsp22r450jtr25gdbkr14p9.apps.googleusercontent.com',
    ios: '600258585781-5d2slqlpdhtrhiro3vt48mml5uo2rt2c.apps.googleusercontent.com',
  }), // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access.
  // offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  // hostedDomain: '', // specifies a hosted domain restriction`
  // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  // accountName: '', // [Android] specifies an account name on the device that should be used
  // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  iosClientId: Platform.select({
    android: '600258585781-j390oma5qjsp22r450jtr25gdbkr14p9.apps.googleusercontent.com',
    ios: '600258585781-5d2slqlpdhtrhiro3vt48mml5uo2rt2c.apps.googleusercontent.com',
  }),
  // googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
  // openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
  // profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});
// Prevent the splash screen from auto-hiding before asset loading is complete.
ExpoSplashScreen.preventAutoHideAsync().then((e) => {
  console.log('preventAutoHideAsync', e);
});

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: true, // Reanimated runs in strict mode by default
});

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

function RootLayout() {
  const { computedTheme } = useConfigProvider();
  const activeTimer = useRef<NodeJS.Timeout>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loaded, error] = useFonts({
    ProductSansBold: require('../assets/fonts/ProductSansBold.ttf'),
    ProductSansBoldItalic: require('../assets/fonts/ProductSansBoldItalic.ttf'),
    ProductSansItalic: require('../assets/fonts/ProductSansItalic.ttf'),
    ProductSansRegular: require('../assets/fonts/ProductSansRegular.ttf'),
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const addActiveTimeListener = useCallback(() => {
    if (activeTimer.current) {
      // 从新进入 app 时，如果存在定时器，则将其清理掉，开始新的记时。
      clearInterval(activeTimer.current);
    }
    let min = 0;
    activeTimer.current = setInterval(() => {
      min += 1;
      if ([1, 3, 5, 7, 10].includes(min)) {
        let eventKey = '';
        switch (min) {
          case 1:
            eventKey = AFEventKey.AFTimeSpentOneMin;
            break;
          case 3:
            eventKey = AFEventKey.AFTimeSpentThreeMin;
            break;
          case 5:
            eventKey = AFEventKey.AFTimeSpentFiveMin;
            break;
          case 7:
            eventKey = AFEventKey.AFTimeSpentSevenMin;
            break;
          default:
            eventKey = AFEventKey.AFTimeSpentTenMin;
            break;
        }
        sendAppsFlyerEvent(eventKey, { time: min });
      }
      if (min >= 10) {
        clearInterval(activeTimer.current || 0);
      }
    }, 1000 * 60);
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    appsFlyer.initSdk(
      {
        devKey: '2LwHgwTiqRucTsX5joyp6U',
        isDebug: false,
        appId: '6745216707',
        manualStart: true,
        // onInstallConversionDataListener: true, //Optional
        // onDeepLinkListener: true, //Optional
        // timeToWaitForATTUserAuthorization: 10 //for iOS 14.5
      },
      (result) => {
        console.log('AppsFlyer.initSdk ok:', result);
      },
      (error) => {
        console.log('AppsFlyer.initSdk error:', error);
      },
    );
  }, []);

  useEffect(() => {
    if (loaded) {
      appsFlyer.startSdk(); // <--- Here we send launch
      ExpoSplashScreen.hideAsync().finally(() => {
        console.log('========================== hideAsync ========================');
        addActiveTimeListener();
      });
    }
  }, [addActiveTimeListener, loaded]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('App has come to the foreground!');
        addActiveTimeListener();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [addActiveTimeListener]);

  const handleAnimationComplete = () => {
    setIsLoading(false);
  };

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <KeyboardProvider>
        <ThemeProvider value={computedTheme === Theme.DARK ? DarkTheme : DefaultTheme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootSiblingParent>
              <LocaleProvider>
                <PostHogProvider
                  client={posthog}
                  autocapture={{
                    captureScreens: false, // expo-router requires this to be false and capture screens manually
                    captureTouches: true,
                    customLabelProp: 'ph-my-label',
                  }}
                  debug={true}>
                  <PostHogSurveyProvider client={posthog}>
                    <DatabaseProvider database={database}>
                      <VideoProvider>
                        <AuthProvider>
                          {isLoading ? (
                            <SplashScreen onAnimationComplete={handleAnimationComplete} />
                          ) : (
                            <RootNavigator />
                          )}
                        </AuthProvider>
                      </VideoProvider>
                    </DatabaseProvider>
                  </PostHogSurveyProvider>
                </PostHogProvider>
              </LocaleProvider>
            </RootSiblingParent>
          </GestureHandlerRootView>
        </ThemeProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}

const RootNavigator = () => {
  const { isLoaded, userInfo, token } = useAuth();
  const { locale } = useLocale();
  const posthog = usePostHog();
  const [isHideCopilot, setIsHideCopilot, isLoadedCopilot] = useStorageState<boolean>(IsHideCopilot, false);
  const routers = (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="boarding" options={{ headerShown: false }} />
      <Stack.Screen name="main" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="codeVerify" options={{ headerShown: false }} />
      <Stack.Screen name="iconPreview" options={{ headerShown: false }} />
      <Stack.Screen name="personalInfoFillNew" options={{ headerShown: false }} />
      <Stack.Screen name="restPassword" options={{ headerShown: false }} />
      <Stack.Screen name="updateEmailSucceed" options={{ headerShown: false }} />
      <Stack.Screen name="verifyEmailToRegister" options={{ headerShown: false }} />
      <Stack.Screen name="verifyEmailToRegisterSuccess" options={{ headerShown: false }} />
      <Stack.Screen name="verifyEmailToRestPwd" options={{ headerShown: false }} />
      <Stack.Screen name="testFlashList" options={{ headerShown: false }} />
      <Stack.Screen name="test_chat_screen" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

  // 浏览器回跳监听
  useEffect(() => {
    const handleDeepLink = (url: string) => {
      const [route, queryString] = url.split('?');

      const pathname = route.replace('aika://', '/');
      // const curRoute = navigation.getState();
      // const naviRoute = curRoute?.routes[curRoute.index];
      const searchParams = new URLSearchParams(queryString);
      // aika://lb/chatRoom?code=f068cd90e42244f28617d366d11693ad
      if (pathname === '/lb/chatRoom') {
        // 跳转群聊
        const code = searchParams.get('code') || '';
        router.replace({
          pathname: '/main/group-chat/join',
          params: { code },
        });
      }
      // aika://lb/agora?code=12
      if (pathname === '/lb/agora') {
        // 跳转 agora 详情页
        const id = searchParams.get('code') || '';
        router.replace({
          pathname: '/main/agora-details/[postId]',
          params: { postId: id },
        });
      }
      // aika://lb/users?code=@%E4%B8%A5%E8%89%AF
      if (pathname === '/lb/users') {
        // 跳转 用户详情页
        const code = searchParams.get('code') || '';
        router.replace({
          pathname: '/main/user-profile/[userId]',
          params: { username: code, userId: -1 },
        });
      }
    };

    const getInitialURL = async () => {
      const url = await Linking.getInitialURL();
      if (url) handleDeepLink(url);
    };
    getInitialURL();

    const subscription = Linking.addEventListener('url', ({ url }) => handleDeepLink(url));
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (isEmpty(token)) {
      router.replace('/login');
    } else {
      if (isLoadedCopilot && !isHideCopilot) {
        router.replace('/boarding');
      }
    }
  }, [isHideCopilot, isLoadedCopilot, token]);

  useEffect(() => {
    if (isLoaded && userInfo?.status === 'uncompleted') {
      router.replace('/personalInfoFillNew');
    }
  }, [isLoaded, userInfo?.status]);

  useEffect(() => {
    posthog.capture('$pageview', {
      screen: 'Home',
    });
  }, [posthog]);

  return (
    <IntlProvider locale={locale} messages={messageMap[locale]}>
      <ConfigProvider>
        <ChatClientProvider>
          <GroupChatProvider>
            {routers}
            <StatusBar style="light" />
            <DevTag />
          </GroupChatProvider>
        </ChatClientProvider>
      </ConfigProvider>
    </IntlProvider>
  );
};

export default RootLayout;
