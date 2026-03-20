import { useRequest } from 'ahooks';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useReducer } from 'react';
import { Platform } from 'react-native';

import { requestChatListProps } from '@/components/Chat/hooks/types';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(initialValue: [boolean, T | null] = [true, null]): UseStateHook<T> {
  return useReducer(
    (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
    initialValue,
  ) as UseStateHook<T>;
}

async function setStorageItemAsync(key: string, value: string | null) {
  if (Platform.OS === 'web') {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}

function useStorageState(key: string): UseStateHook<string> {
  // Public
  const [state, setState] = useAsyncState<string>();

  // Get
  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          setState(localStorage.getItem(key));
        }
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
    } else {
      SecureStore.getItemAsync(key).then((value) => {
        setState(value);
      });
    }
  }, [key, setState]);

  // Set
  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key, setState],
  );

  return [state, setValue];
}

export default function useChatRequest({ request, cacheKey }: requestChatListProps) {
  const [[stateLoading, messages], setMessages] = useStorageState(cacheKey);
  const {
    data,
    runAsync: loadData,
    mutate,
    loading,
  } = useRequest(
    async (p) => {
      return await request(p);
    },
    {
      manual: true,
      debounceWait: 300,
      loadingDelay: 300,
      throttleWait: 300,
      cacheKey,
      setCache: (value) => {
        setMessages(JSON.stringify(value));
      },
      getCache: () => {
        return JSON.parse(messages || '[]');
      },
    },
  );

  return {
    data,
    loadData,
    mutate,
    loading,
    stateLoading,
  };
}
