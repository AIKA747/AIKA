import { File } from 'expo-file-system';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';

import { ensureCacheDirectory } from '@/utils/downloadCacheFile';

export const saveImageToGallery = async (mediaUrl: string) => {
  if (!mediaUrl || typeof mediaUrl !== 'string') {
    throw new Error('Invalid mediaUrl provided.');
  }

  let localCachePath = await Image.getCachePathAsync(mediaUrl);

  if (!localCachePath) {
    await Image.loadAsync(mediaUrl, {
      onError(error: Error, retry: () => void) {
        throw new Error(`Failed to load image ${mediaUrl} into cache: ${error}`);
      },
    });
    localCachePath = await Image.getCachePathAsync(mediaUrl);
  }
  if (!localCachePath) {
    throw new Error(
      `Could not retrieve image from cache for ${mediaUrl}, even after attempting to load. Ensure it's a valid and accessible image.`,
    );
  }

  const { status } = await MediaLibrary.requestPermissionsAsync(false, ['video', 'photo']);
  if (status !== 'granted') throw new Error('Insufficient permissions');

  // 缓存的文件可能没有类型标识，保存会抛错，catch 后尝试获取文件类型保存
  try {
    await MediaLibrary.createAssetAsync(`file://${localCachePath}`);
  } catch {
    const directory = await ensureCacheDirectory();
    const fileType = mediaUrl.slice(mediaUrl.lastIndexOf('.') + 1).toLowerCase();
    const tempFileName = `temp_image_${Date.now()}.${fileType}`;
    const oldFile = new File(`file://${localCachePath}`);
    if (oldFile.exists) {
      const newFile = new File(directory, tempFileName);
      oldFile.copy(newFile);
      await MediaLibrary.createAssetAsync(newFile.uri);
      oldFile.delete();
    }
  }
};
