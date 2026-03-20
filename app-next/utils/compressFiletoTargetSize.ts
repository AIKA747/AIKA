import { File, FileInfo } from 'expo-file-system';
import { Image } from 'react-native-compressor';
import { CompressorOptions } from 'react-native-compressor/lib/typescript/Image';

export async function compressFileToTargetSize(
  uri: string,
  targetSizeMB: number,
  options?: CompressorOptions,
): Promise<string> {
  const targetSizeBytes = targetSizeMB * 1024 * 1024;

  const info = new File(uri);
  if (!info.exists) return '';
  if (info.size <= targetSizeBytes) return uri;

  let { quality = 0.8, maxWidth = 1600, ...restOptions } = options || {};

  let qualityCompressInvalid = false; // 质量压缩是否已达极限，默认 false

  let compressedUri = '';
  let prevFileInfo: FileInfo | undefined = undefined;
  let fileInfo: FileInfo | undefined = undefined;

  let resUri = '';

  while (true) {
    prevFileInfo = fileInfo;

    compressedUri = await Image.compress(uri, {
      quality,
      maxWidth,
      compressionMethod: 'manual',
      ...restOptions,
    });

    fileInfo = new File(compressedUri).info();

    if (!fileInfo.exists) break;

    // 质量压缩极限后若还不能满足目标大小，通过缩小图片进行压缩
    if (qualityCompressInvalid || prevFileInfo?.size === fileInfo.size) {
      if ((fileInfo?.size || 0) > targetSizeBytes) {
        qualityCompressInvalid = true;
        maxWidth = maxWidth - 200;
        if (maxWidth <= 0) break;
        continue;
      }
      resUri = fileInfo.uri || '';
      break;
    }

    if (!qualityCompressInvalid && (fileInfo.size ?? 0) > targetSizeBytes) {
      quality = quality - 0.2;
      if (quality <= 0) {
        maxWidth = maxWidth - 200;
        qualityCompressInvalid = true;
      }
      continue;
    }
    resUri = fileInfo.uri || '';
    break;
  }

  return resUri;
}
