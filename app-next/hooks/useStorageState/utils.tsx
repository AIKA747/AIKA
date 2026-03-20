import { File, Directory, Paths } from 'expo-file-system';

// 类型定义
export interface CacheInfo {
  exists: boolean;
  size: number;
  fileCount?: number;
}

// 配置
const STORAGE_CONFIG = {
  cacheDirectoryName: 'storage',
  suffix: '.json',
} as const;

// 路径
const cacheDirectoryPath = STORAGE_CONFIG.cacheDirectoryName;

// 确保目录存在
async function ensureCacheDirectory(): Promise<Directory> {
  const cacheDir = new Directory(Paths.document, cacheDirectoryPath);
  if (!cacheDir.exists) {
    cacheDir.create();
  }
  return cacheDir;
}

// 获取文件实例
async function getCacheFile(key: string): Promise<File> {
  const directory = await ensureCacheDirectory();
  return new File(directory.uri, `${key}${STORAGE_CONFIG.suffix}`);
}
export async function setItem<T>(key: string, value: T | null) {
  try {
    const file = await getCacheFile(key);
    if (value === null) {
      if (file.exists) {
        file.delete();
      }
    } else {
      const valueString = JSON.stringify(value);
      file.write(valueString);
    }
  } catch (error) {
    console.error('Storage setItem error:', error);
  }
}

export async function getItem<T>(key: string) {
  try {
    const file = await getCacheFile(key);

    if (!file.exists) {
      return null;
    }

    const valueString = await file.text();
    return JSON.parse(valueString || 'null') as T;
  } catch (error) {
    console.error('Storage getItem error:', error);
    return null;
  }
}

export async function clearCache() {
  try {
    const directory = await ensureCacheDirectory();
    if (directory.exists) {
      directory.delete();
    }
  } catch (error) {
    console.error('Storage clear error:', error);
  }
}
export async function getCacheInfo(): Promise<CacheInfo> {
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
export async function getAllKeys(): Promise<string[]> {
  try {
    const directory = await ensureCacheDirectory();

    if (!directory.exists) {
      return [];
    }

    const contents = directory.list();
    const files = contents.filter((item) => item instanceof File) as File[];

    return files
      .filter((file) => file.name.endsWith(STORAGE_CONFIG.suffix))
      .map((file) => file.name.replace(STORAGE_CONFIG.suffix, ''));
  } catch (error) {
    console.log('Storage getAllKeys error:', error);
    return [];
  }
}
export async function multiRemove(keys: string[]): Promise<void> {
  try {
    await Promise.all(keys.map((key) => setItem(key, null)));
  } catch (error) {
    console.error('Storage multiRemove error:', error);
  }
}
