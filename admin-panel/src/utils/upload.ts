import { message } from 'antd';
import { RcFile } from 'antd/lib/upload';
// import { UploadFile } from 'antd/lib/upload/interface';

interface ValidateFileOptions {
  maxSize?: number; // 文件最大大小，单位为 MB
  fileTypes?: string[]; // 允许的文件类型
}

export const validateFileUpload = (
  options: ValidateFileOptions = { maxSize: 2, fileTypes: ['*'] },
) => {
  const { maxSize = 2, fileTypes } = options;

  return (file: RcFile): boolean | Promise<void | Blob | File> => {
    console.log('file.type', file.type);
    // 检查文件大小
    const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
    if (!isLtMaxSize) {
      message.error(
        `The image is too large, it should not exceed ${maxSize}MB!`,
      );
      return false;
    }

    // 如果指定了文件类型，则进行检查
    if (fileTypes && fileTypes.length > 0) {
      const isValidType =
        fileTypes.includes(file.type) || fileTypes.includes('*');
      if (!isValidType) {
        message.error(`只支持 ${fileTypes.join(', ')} 格式!`);
        return false;
      }
    }

    return true;
  };
};
