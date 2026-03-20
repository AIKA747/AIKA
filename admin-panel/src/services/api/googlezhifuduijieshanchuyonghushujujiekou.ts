// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 通过邮箱中的链接删除用户数据 DELETE /user/public/delete/user/data */
export async function deleteUserPublicOpenApiDeleteUserData(
  body: {
    /** 客户端验证编码 */
    clientCode: string;
    /** 验证码 */
    verifyCode: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/user/public/delete/user/data',
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 提交删除用户数据请求（google网页调用） 用户在请求删除用户数据页面填写邮箱，后台会将用户验证信息发送到填写的邮箱中，在邮箱中进行用户身份验证，并删除用户数据 POST /user/public/delete/user/data/submit */
export async function postUserPublicOpenApiDeleteUserDataSubmit(
  body: {
    /** 用户账号邮箱 */
    email: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/user/public/delete/user/data/submit',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}
