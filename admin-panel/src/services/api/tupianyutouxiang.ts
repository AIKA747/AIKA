// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 查询用户的图片或头像（新） 获得用户当前的图片列表 GET /user/app/user-image */
export async function getUserAppUserImage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserAppUserImageParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      total: number;
      pageNum: number;
      pageSize: number;
      pages: number;
      list: {
        id: number;
        createdAt: string;
        type: string;
        imageUrl: string;
        remark: string;
        checked?: boolean;
      };
    };
  }>('/user/app/user-image', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 添加图片或头像接口（新） 上传图片后，将图片存储到数据库。 POST /user/app/user-image */
export async function postUserAppUserImage(
  body: {
    /** 枚举 :IMAGE,AVATAR */
    type: string;
    /** 图片地址 */
    imageUrl: string;
    /** 图片备注 */
    remark: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/user/app/user-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除图片（新） 删除一个图片 DELETE /user/app/user-image/${param0} */
export async function deleteUserAppUserImageId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserAppUserImageIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResult>(`/user/app/user-image/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 设置某个头像为当前使用的头像（新） 设置某个头像为当前使用的头像 PUT /user/app/user-image/active */
export async function putUserAppUserImageActive(
  body: {
    /** 用户图片ID */
    id: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/user/app/user-image/active', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
