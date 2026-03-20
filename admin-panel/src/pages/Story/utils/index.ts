import { message, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';

export const FileSizeLimit = function (file: RcFile, limit = 2) {
  const isLessThan2M = file.size / 1024 / 1024 < limit;
  if (!isLessThan2M) {
    message.error(`The image is too large, it should not exceed ${limit}MB.`);
  }
  return isLessThan2M || Upload.LIST_IGNORE;
};
