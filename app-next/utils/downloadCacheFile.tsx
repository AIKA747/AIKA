import * as Crypto from 'expo-crypto';
import { File, Directory, Paths } from 'expo-file-system';

// 确保目录存在
export async function ensureCacheDirectory(): Promise<Directory> {
  const cacheDir = new Directory(Paths.cache, 'temp');
  if (!cacheDir.exists) {
    cacheDir.create();
  }
  return cacheDir;
}

/**
 * 获取文件后缀名
 * @param httpUrl
 */
const getSuffix = (httpUrl: string) => {
  let suffix = httpUrl.substring(httpUrl.lastIndexOf('.')) || '.unknown';
  suffix = suffix.split('?')[0];
  suffix = suffix.split('#')[0];
  return suffix;
};

/**
 * 判断文件是否已经缓存
 */
export async function downloadCacheFileCheck({ httpUrl }: { httpUrl: string }) {
  const cacheDirectoryInfo = await ensureCacheDirectory();
  const key = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, httpUrl);
  console.log('key:', key);
  const fileInfo = new File(cacheDirectoryInfo, `${key}${getSuffix(httpUrl)}`).info();
  return fileInfo.exists ? fileInfo.uri : '';
}
/**
 * 把文件下载到本地存储，相当于视频音频缓存
 */
export default async function ({
  httpUrl,
  localUrl,
}: {
  httpUrl: string;
  /**
   * 直接从本地文件复制
   */
  localUrl?: string;
}) {
  const cacheDirectoryInfo = await ensureCacheDirectory();
  const key = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, httpUrl);
  const fileInfo = new File(cacheDirectoryInfo, `${key}${getSuffix(httpUrl)}`);

  if (!fileInfo.exists) {
    if (localUrl) {
      const localFile = new File(localUrl);
      localFile.copy(cacheDirectoryInfo);
      return localFile.uri;
    }
    try {
      const output = await File.downloadFileAsync(httpUrl, fileInfo);
      return output.uri;
    } catch (e) {
      console.log('Download File Async Error:', e);
      return Promise.reject(e);
    }
  }

  return fileInfo.uri;
}
