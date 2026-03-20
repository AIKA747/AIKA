import { useEventEmitter, useRequest } from 'ahooks';
import { type AxiosResponse } from 'axios';
import { addNetworkStateListener, getNetworkStateAsync, type NetworkState } from 'expo-network';
import {
  createContext,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppState } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Gender } from '@/constants/types';
import { useAuth } from '@/hooks/useAuth';
import { ConfigContentProps, EventValue, Theme } from '@/hooks/useConfig/types';
import { useStorageState } from '@/hooks/useStorageState';
import { getContentPublicReportList } from '@/services/tiezijubao';
import { getUserPublicConfig } from '@/services/tongyongjiekou';
import { getBotAppAssistant } from '@/services/zhushouxiangguangongneng';
import downloadCacheFile from '@/utils/downloadCacheFile';

const ConfigContext = createContext<ConfigContentProps>({
  netInfo: null,
  refreshAssistant: function (): void {
    throw new Error('Function not implemented.');
  },
  setRefreshConfig: function (
    value: SetStateAction<
      | {
          homePage?: { feedRefresh?: boolean; followRefresh?: boolean; privateRefresh?: boolean };
        }
      | undefined
    >,
  ): void {
    throw new Error('Function not implemented.');
  },
  setPageShareData: function (value: any): void {
    throw new Error('Function not implemented.');
  },
  theme: Theme.LIGHT,
  computedTheme: Theme.LIGHT,
  computedThemeColor: Colors.light,
  setTheme: function (theme: Theme): void {
    throw new Error('Function not implemented.');
  },
  synchronizeAgoraData: [],
  postReportList: [],
  onSynchronizeAgoraData: () => {},
  clearSynchronizeAgoraData: () => {},
});

const ConfigProvider = (props: PropsWithChildren) => {
  const eventEmitter = useEventEmitter<EventValue>();
  const [theme, setTheme] = useStorageState('ThemeKey', Theme.SYSTEM);
  const [netInfo, setNetInfo] = useState<NetworkState | null>(null);
  const [pageShareData, setPageShareData] = useState<{ [key: string]: any }>();
  const [computedTheme, setComputedTheme] = useState<Exclude<Theme, Theme.SYSTEM>>(Theme.LIGHT);
  const [refreshConfig, setRefreshConfig] = useState<ConfigContentProps['refreshConfig']>({});
  const [computeAssistant, setAssistantCompute] = useState<ConfigContentProps['computeAssistant']>();
  const [synchronizeAgoraData, setSynchronizeAgoraData] = useState<ConfigContentProps['synchronizeAgoraData']>([]);
  const { token } = useAuth();

  const { data: config } = useRequest(async () => {
    const resp = await getUserPublicConfig();
    return resp.data.data;
  });
  const { data: assistant, refresh: refreshAssistant } = useRequest(
    async () => {
      // TODO 开放匿名范围
      if (!token) return;
      const resp = await getBotAppAssistant();
      return resp.data.data;
    },
    {
      refreshDeps: [token],
    },
  );
  const { data: reportList, run: getReportList } = useRequest(
    () => {
      if (!token)
        return new Promise<
          AxiosResponse<{
            code: number;
            msg: string;
            data: { id: number; title: string; description: string }[];
          }>
        >((resolve) => {
          resolve({ data: { code: 0, msg: '', data: [] } } as any);
        });
      return getContentPublicReportList();
    },
    {
      manual: true,
      refreshDeps: [token],
      debounceWait: 300,
    },
  );
  const computedThemeColor = useMemo(
    () => (computedTheme === Theme.DARK ? Colors.dark : Colors.light),
    [computedTheme],
  );
  const handleSynchronizeAgoraData = useCallback((data: ConfigContentProps['synchronizeAgoraData'][0]) => {
    setSynchronizeAgoraData((prev) => {
      const index = prev.findIndex((item) => item.id === data.id);
      if (index === -1) {
        return [...prev, data];
      }
      return prev.map((item) => {
        if (item.id === data.id) {
          return { ...item, ...data };
        }
        return item;
      });
    });
  }, []);

  useEffect(() => {
    async function run() {
      const maleIdleVideo = assistant?.maleIdleVideo
        ? await downloadCacheFile({ httpUrl: assistant?.maleIdleVideo })
        : '';
      const femaleIdleVideo = assistant?.femaleIdleVideo
        ? await downloadCacheFile({ httpUrl: assistant?.femaleIdleVideo })
        : '';

      const maleGreetVideo = assistant?.maleGreetVideo
        ? await downloadCacheFile({ httpUrl: assistant?.maleGreetVideo })
        : '';
      const femaleGreetVideo = assistant?.femaleGreetVideo
        ? await downloadCacheFile({ httpUrl: assistant?.femaleGreetVideo })
        : '';

      const idleVideo = assistant && assistant.userSettingGender === Gender.MALE ? maleIdleVideo : femaleIdleVideo;

      const greetVideo = assistant && assistant.userSettingGender === Gender.MALE ? maleGreetVideo : femaleGreetVideo;

      const avatar =
        assistant && assistant.userSettingGender === Gender.MALE
          ? assistant?.maleAvatar || ''
          : assistant?.femaleAvatar || '';

      setAssistantCompute({ idleVideo, greetVideo, avatar });
    }
    run();
  }, [assistant]);

  useEffect(() => {
    const unsubNetInfo = addNetworkStateListener((state) => setNetInfo(state));

    const appStateSub = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') setNetInfo(await getNetworkStateAsync());
    });

    return () => {
      unsubNetInfo.remove();
      appStateSub.remove();
    };
  }, []);

  useEffect(() => {
    if (token) {
      getReportList();
    }
  }, [token, getReportList]);

  // 暂时固定为暗黑模式
  useEffect(() => {
    setTheme(Theme.DARK);
    setComputedTheme(Theme.DARK);
  }, [setTheme]);

  return (
    <ConfigContext.Provider
      value={{
        netInfo,
        eventEmitter,
        theme: theme || Theme.SYSTEM,
        setTheme,
        config,
        computedTheme,
        computedThemeColor,
        assistant,
        computeAssistant,
        refreshAssistant,
        pageShareData,
        setPageShareData,
        refreshConfig,
        setRefreshConfig,
        postReportList: reportList?.data?.data || [],
        synchronizeAgoraData,
        onSynchronizeAgoraData: handleSynchronizeAgoraData,
        clearSynchronizeAgoraData: () => setSynchronizeAgoraData([]),
      }}>
      {props.children}
    </ConfigContext.Provider>
  );
};
export { ConfigContentProps, Theme };
export const useConfigProvider = () => useContext(ConfigContext);
export default ConfigProvider;
