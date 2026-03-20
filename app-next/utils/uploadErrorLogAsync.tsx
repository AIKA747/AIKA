import { Directory, File, Paths } from 'expo-file-system';
import { uuid } from 'expo-modules-core';
import DeviceInfo from 'react-native-device-info';

import { getConfig } from '@/constants/Config';
import request from '@/utils/request';

export default async function ({
  logText,
  userId,
  remark = '',
}: {
  logText: string;
  userId: string;
  remark?: string;
}): Promise<string> {
  const serverUrl = `${getConfig().api}/user/public/app/error-logs/upload`;
  const logCacheDir = new Directory(Paths.cache, 'logs');
  const logFile = new File(logCacheDir, `${uuid.v4()}.log`);
  logFile.create();
  logFile.write(logText);

  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('device', DeviceInfo.getDeviceId());
  formData.append('systemVersion', DeviceInfo.getSystemVersion());
  formData.append('remark', remark);
  formData.append('file', {
    uri: logFile.uri,
    name: logFile.name,
    type: logFile.type || 'application/octet-stream',
    size: logFile.size,
  } as any);

  // 3. 使用 axios 上传
  const response = await request(serverUrl, {
    data: formData,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response?.data?.data || '';
}
