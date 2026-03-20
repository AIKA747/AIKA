// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 用户注册-手机验证码 暂不实现 POST /user/public/verify-phone */
export async function postUserPublicVerifyPhone(
  body: {
    /** 手机号 */
    phone: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/user/public/verify-phone',
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
