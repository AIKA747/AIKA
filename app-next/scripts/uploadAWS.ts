// uploadAWS.ts
import fs from 'fs';

import axios from 'axios';
import FormData from 'form-data';

// 应用路径常量
const APP_PATH_IOS = '../ios/aika/aika.ipa';
const APP_PATH_ANDROID = '../android/app/build/outputs/apk/release/app-release.apk';
const APP_PATH_ANDROID_AAB = '../android/app/build/outputs/bundle/release/app-release.aab';

// 文件上传响应类型
interface FileUploadResponse {
  data: {
    url: string;
    // 根据实际API响应补充其他字段
  };
  [key: string]: any;
}

// 企业微信通知响应类型
interface WechatNoticeResponse {
  errcode: number;
  errmsg: string;
}

async function uploadFile(file: fs.ReadStream): Promise<string> {
  const data = new FormData();
  data.append('file', file);

  const config = {
    method: 'post',
    url: 'https://api-test.aikavision.com/user/public/file-upload',
    headers: {
      ...data.getHeaders(),
    },
    data,
  };

  try {
    const response = await axios<FileUploadResponse>(config);
    return response.data.data.url;
  } catch (error) {
    throw new Error(`文件上传失败: ${(error as Error).message}`);
  }
}

function notice(urls: string[]): void {
  const payload = {
    msgtype: 'markdown',
    markdown: {
      content: urls.join('\n'),
    },
  };

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=cda79c76-ded1-4d86-aa5b-b39b8e23588c',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(payload),
  };

  axios
    .request<WechatNoticeResponse>(config)
    .then((response) => {
      console.log('通知发送成功:', JSON.stringify(response.data));
    })
    .catch((error) => {
      console.error('通知发送失败:', error);
    });
}

async function run(): Promise<void> {
  try {
    const [url1, url2, url3] = await Promise.all([
      uploadFile(fs.createReadStream(APP_PATH_IOS)),
      uploadFile(fs.createReadStream(APP_PATH_ANDROID)),
      uploadFile(fs.createReadStream(APP_PATH_ANDROID_AAB)),
    ]);

    notice([url1, url2, url3]);
  } catch (error) {
    console.error('程序运行失败:', (error as Error).message);
    process.exit(1);
  }
}

run();
