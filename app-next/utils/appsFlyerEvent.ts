import { Platform } from 'expo-modules-core';
import appsFlyer from 'react-native-appsflyer';

/**
 * AppsFlyer 统计事件 只有在生产环境下才会发送
 * @param name 事件名称
 * @param values 事件参数
 */
export const sendAppsFlyerEvent = (name: string, values = {}) => {
  appsFlyer.logEvent(
    name,
    { af_platform: Platform.OS, ...values },
    (result) => {
      console.log(`AppsFlyer [eventName: ${name}] succeeded:`, result);
    },
    (error) => {
      console.error(`AppsFlyer [eventName: ${name}] failed:`, error);
    },
  );
};
