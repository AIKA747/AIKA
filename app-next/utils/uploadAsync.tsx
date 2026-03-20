import { File } from 'expo-file-system';

import { getConfig } from '@/constants/Config';
import request from '@/utils/request';

export default async function ({
  fileUrl,
  options,
}: {
  fileUrl: string;
  options?: { [key: string]: any };
}): Promise<string> {
  try {
    const serverUrl = `${getConfig().api}/user/public/file-upload`;
    const file = new File(fileUrl);
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type || 'application/octet-stream',
      size: file.size,
    } as any);

    // 3. 使用 axios 上传
    const response = await request(serverUrl, {
      data: formData,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...(options || {}),
    });
    return response?.data?.data || '';
  } catch (e) {
    console.log('UploadAsync error:', e);
    return '';
  }
}
