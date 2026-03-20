import axios from 'axios';
import { router } from 'expo-router';
import { Alert } from 'react-native';

import { getConfig } from '@/constants/Config';
import { AuthTokenKey } from '@/constants/StorageKey';
import { authReload } from '@/hooks/useAuth/utils';
import { getIntl } from '@/hooks/useLocale';
import { getItem, setItem } from '@/hooks/useStorageState/utils';

import en from '../i18n/en';

const request = axios.create({
  // baseURL: process.env.EXPO_PUBLIC_API_URL,
});
request.interceptors.request.use(
  async (config) => {
    config.baseURL = getConfig().api;
    const token = (await getItem<string>(AuthTokenKey)) || '';
    if (token) {
      config.headers.Authorization = token;
    }
    console.log(
      'request:',
      JSON.stringify(
        {
          url: config.url,
          method: config.method?.toUpperCase(),
          params: config.params,
          data: config.data,
        },
        null,
        2,
      ),
    );
    return config;
  },
  (error) => {
    console.log('request', 'error', JSON.stringify(error, null, 2));
    return Promise.reject(error);
  },
);

// 避免重复弹窗
let isShowAlert = false;
request.interceptors.response.use(
  async (resp) => {
    // console.log('response', resp.config.method?.toUpperCase(), resp.config.url);
    // console.log('response', 'data', JSON.stringify(resp.data, null, 2));

    // if (resp.data.code !== 0) {
    //   Toast.error(resp.data.msg);
    // }

    return resp;
  },
  async (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);

    const intl = getIntl();
    const data = error?.response?.data;
    console.log('get 7001', data?.code);
    if (data && data.code !== 0 && data.msg) {
      // 系统维护中 7001
      if (data.code === 7001) {
        if (!isShowAlert) {
          isShowAlert = true;
          Alert.alert(intl.formatMessage({ id: 'failed' }), data.msg, [
            {
              text: intl.formatMessage({ id: 'OK' }),
              onPress: () => {
                isShowAlert = false;
              },
            },
          ]);
        }
      } else {
        const key = `ServerCode.${data.code}`;
        const msg = key in en ? getIntl().formatMessage({ id: key as any }) : data.msg;
        console.log('msg: ', msg);
        // Toast.error(msg);
      }
    }

    // 401 token无效
    // 20003 账号被禁用
    if (data && (data.code === 401 || data.code === 20003)) {
      goLogin();
    }
    delete error.stack;
    delete error.config;
    console.log(
      'response',
      'error',
      JSON.stringify(
        {
          baseURL: error?.response?.config?.baseURL,
          url: error?.response?.config?.url,
          method: error?.response?.config?.method,
          requestParams: error?.response?.config?.params,
          status: error?.response?.status,
          responseData: data,
        },
        null,
        2,
      ),
    );
    return Promise.reject(error);
  },
);

// 21秒钟内不重复跳转login
let isInLogin = false;
async function goLogin() {
  console.log('goLogin', isInLogin);
  if (isInLogin) {
    return;
  }
  isInLogin = true;
  await setItem(AuthTokenKey, null);
  await authReload?.();
  router.replace('/login');
  setTimeout(() => {
    isInLogin = false;
  }, 2000);
}

export default request;
