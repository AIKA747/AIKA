import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRequest } from 'ahooks';
import { router } from 'expo-router';
import React, { createContext, PropsWithChildren, useContext, useEffect, useRef } from 'react';

import { AuthTokenKey, ChatsRecommendCloseKey, RecentSearches } from '@/constants/StorageKey';
import { clearAllDatabaseData } from '@/database/services/sync';
import { deleteUserAppLogout, getUserAppMe } from '@/services/userService';
import { bindMessagingId } from '@/utils/bindMessagingId';
import initTrackingPermission from '@/utils/initTrackingPermission';

import { useLocale } from '../useLocale';
import { useStorageState } from '../useStorageState';
import { setItem } from '../useStorageState/utils';

import { AuthContextProps, Token, UserInfo } from './types';
import { setAuthReload } from './utils';

const AuthContext = createContext<AuthContextProps>({
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  token: null,
  userInfo: null,
  refreshUserInfo: () => Promise.resolve(null),
  isUserInfoLoading: true,
  isLoaded: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props: PropsWithChildren) {
  const { setLocale } = useLocale();
  const [token, setToken, isLoaded, handleReload] = useStorageState<Token>(AuthTokenKey);
  const userInfoRef = useRef<UserInfo | null | undefined>(null);
  const {
    data: userInfo,
    runAsync: refreshUserInfo,
    loading: isUserInfoLoading,
  } = useRequest(
    async () => {
      if (!isLoaded) {
        return null;
      }
      const resp = await getUserAppMe();

      // 后端主动更新，比如更新email或者username时，或者主动续期token
      if (resp.data.data.token) {
        await setToken(resp.data.data.token);
      }

      setLocale((resp.data.data.language as FormatjsIntl.IntlConfig['locale']) || 'en');
      return resp.data.data || null;
    },
    {
      refreshDeps: [isLoaded],
    },
  );

  useEffect(() => {
    setAuthReload(handleReload);
    return () => {
      setAuthReload(undefined);
    };
  }, [handleReload]);

  useEffect(() => {
    if (!token) return;
    initTrackingPermission().then((res) => {
      if (res) {
        bindMessagingId();
      }
    });
  }, [token]);

  useEffect(() => {
    userInfoRef.current = userInfo;
  }, [userInfo]);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (token) => {
          await setToken(token);
          await refreshUserInfo();
        },
        signOut: async () => {
          try {
            await deleteUserAppLogout();
            await clearAllDatabaseData(); //重置数据库
          } finally {
            await setToken(null);
            // TODO 统一清理缓存
            await setItem(ChatsRecommendCloseKey, null);
            await setItem(RecentSearches, null);
            // const token = await GoogleSignin.getTokens();
            // console.log('Google sign out token:', token);
            // 为了实现在Android 端退出登录后，重现使用Google登录时，能够重新弹出Google登录界面
            await GoogleSignin.signOut();

            setTimeout(() => {
              router.dismissAll();
              router.push('/login');
            });
          }
        },
        token,
        userInfo,
        userInfoRef,
        refreshUserInfo,
        isUserInfoLoading,
        isLoaded,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
