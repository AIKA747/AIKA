// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 文件压缩上传 POST /user/app/file-upload-resize */
export async function postUserAppFileUploadResize(
  body: {},
  file?: File,
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<{ code: number; msg: string; data: string }>(
    '/user/app/file-upload-resize',
    {
      method: 'POST',
      data: formData,
      requestType: 'form',
      ...(options || {}),
    },
  );
}

/** app异常日志文件上传 POST /user/public/app/error-logs/upload */
export async function postUserPublicAppErrorLogsUpload(
  body: {
    /** 用户id，用户登录状态时选传，可定位到用户的使用异常 */
    userId?: string;
    /** 设备 */
    device?: string;
    /** 系统版本 */
    systemVersion?: string;
    /** 备注信息 */
    remark?: string;
  },
  file?: File,
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<{ code: number; msg: string; data: string }>(
    '/user/public/app/error-logs/upload',
    {
      method: 'POST',
      data: formData,
      requestType: 'form',
      ...(options || {}),
    },
  );
}

/** 通用配置 GET /user/public/config */
export async function getUserPublicConfig(options?: { [key: string]: any }) {
  return request<{ code: number; msg: string; data: { googleLogin: boolean } }>(
    '/user/public/config',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** 文件上传 POST /user/public/file-upload */
export async function postUserPublicFileUpload(
  body: {},
  file?: File,
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<{ code: number; msg: string; data: string }>(
    '/user/public/file-upload',
    {
      method: 'POST',
      data: formData,
      requestType: 'form',
      ...(options || {}),
    },
  );
}
