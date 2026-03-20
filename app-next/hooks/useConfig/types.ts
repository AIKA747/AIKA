import { EventEmitter } from 'ahooks/lib/useEventEmitter';
import type { NetworkState } from 'expo-network';
import { Dispatch, SetStateAction } from 'react';

import { MessageItem } from '@/components/Chat/types';
import { Colors } from '@/constants/Colors';
import { getContentPublicReportList } from '@/services/tiezijubao';
import { getUserPublicConfig } from '@/services/tongyongjiekou';
import { getBotAppAssistant } from '@/services/zhushouxiangguangongneng';

export type Config = Awaited<ReturnType<typeof getUserPublicConfig>>['data']['data'];
export type AssistantDetail = Awaited<ReturnType<typeof getBotAppAssistant>>['data']['data'];

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export type EventValue =
  | { method: 'delete-messages'; data: string }
  | { method: 'position-message'; data: MessageItem }
  | { method: 'mqtt-connected-and-synced' }
  | { method: 'refresh-profile-comments' }
  | { method: 'home_page_back_top' };

export interface ConfigContentProps {
  netInfo: NetworkState | null;
  eventEmitter?: EventEmitter<EventValue>;
  /**
   * 助手信息
   */
  assistant?: AssistantDetail;
  /**
   * 助手信息，根据性别计算后的组合值
   */
  computeAssistant?: { greetVideo?: string; idleVideo?: string; avatar: string };
  /**
   * 刷新助手信息，如更改性别后
   */
  refreshAssistant: () => void;
  /**
   * 跨页面刷新数据
   */
  refreshConfig?: {
    homePage?: {
      feedRefresh?: boolean;
      followRefresh?: boolean;
      privateRefresh?: boolean;
    };
  };
  setRefreshConfig: Dispatch<SetStateAction<ConfigContentProps['refreshConfig']>>;
  config?: Config;
  /**
   * 设置页面之间跳转传递数据
   */
  pageShareData?: { [key: string]: any };
  /**
   * 设置页面之间跳转传递数据，为了避免数据混乱，每次使用后需要手动清空
   * @param value
   */
  setPageShareData: (value: any) => void;

  theme: Theme;
  computedTheme: Exclude<Theme, Theme.SYSTEM>;
  computedThemeColor: (typeof Colors)['light'];
  setTheme: (theme: Theme) => void;
  postReportList: Awaited<ReturnType<typeof getContentPublicReportList>>['data']['data'];
  /**
   * 同步 Agora 的点赞、评论等消息数
   */
  synchronizeAgoraData: {
    id: number;
    likes?: number; // 点赞数
    reposts?: number; // 回复数
    thumbed?: boolean; // 是否点赞
  }[];
  onSynchronizeAgoraData: (data: {
    id: number;
    likes?: number;
    reposts?: number;
    thumbed?: boolean;
    reportId?: number;
  }) => void;
  clearSynchronizeAgoraData: () => void;
}
