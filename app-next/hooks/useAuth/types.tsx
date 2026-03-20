import { RefObject } from 'react';

import { getUserAppMe } from '@/services/userService';

export type Token = string;

export type UserInfo = Awaited<ReturnType<typeof getUserAppMe>>['data']['data'];

export interface AuthContextProps {
  signIn: (token: Token) => Promise<void>;
  signOut: () => Promise<void>;
  /**
   * 登录token
   */
  token: string | null;
  /**
   * 登录信息
   */
  userInfo: UserInfo | null | undefined;
  userInfoRef?: RefObject<UserInfo | null | undefined>;
  refreshUserInfo: () => Promise<UserInfo | null>;
  isUserInfoLoading: boolean;
  /**
   * Storage 是异步的，为 true 表示异步加载完成
   */
  isLoaded: boolean;
}
