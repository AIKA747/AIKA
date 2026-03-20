// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 新邮箱验证码发送 （新） POST /user/app/user-email/verify */
export async function postUserAppUserEmailVerify(
  body: {
    /** 邮箱地址 */
    email: string;
    /** 必选 */
    password?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>('/user/app/user-email/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
