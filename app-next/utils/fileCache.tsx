import { File } from 'expo-file-system';

import { ensureCacheDirectory } from './downloadCacheFile';

// TODO
// import { cacheDirectoryPath as StorageCacheDirectoryPath } from '../hooks/useStorageState/utils';
// 录音 file:///data/user/0/com.umaylab.aisa/cache/Audio/recording-ac0698f7-29d7-42b4-991c-6eed04233989.m4a

/**
 * 缓存文件大小，单位bit
 * @returns
 */
export async function getSize() {
  try {
    const directory = await ensureCacheDirectory();

    if (!directory.exists) {
      return { exists: false, size: 0 };
    }

    const contents = directory.list();
    const files = contents.filter((item) => item instanceof File) as File[];

    return {
      exists: true,
      size: directory.size || 0,
      fileCount: files.length,
    };
  } catch (error) {
    console.log('Storage getCacheInfo error:', error);
    return { exists: false, size: 0 };
  }
}

export async function clear() {
  try {
    const directory = await ensureCacheDirectory();
    if (directory.exists) {
      directory.delete();
    }
  } catch (error) {
    console.error('Storage clear error:', error);
  }
}
