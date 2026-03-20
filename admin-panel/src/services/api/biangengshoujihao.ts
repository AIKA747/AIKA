// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 发送新手机验证码 POST /user/app/new-phone-verify-code */
export async function postUserAppNewPhoneVerifyCode(
  body: {
    /** 新手机号 */
    phone: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/user/app/new-phone-verify-code',
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

/** 发送旧手机验证码 POST /user/app/old-phone-verify-code */
export async function postUserAppOldPhoneVerifyCode(options?: {
  [key: string]: any;
}) {
  return request<{ code: number; msg: string; data: string }>(
    '/user/app/old-phone-verify-code',
    {
      method: 'POST',
      ...(options || {}),
    },
  );
}

/** 旧手机验证码校验 GET /user/app/old-phone-verify-status */
export async function getUserAppOldPhoneVerifyStatus(
  body: {
    /** 发送验证码时返回的data */
    clientCode: string;
    /** 手机号收到的验证码 */
    code: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/user/app/old-phone-verify-status',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 更新用户手机号 PATCH /user/app/phone */
export async function patchUserAppPhone(
  body: {
    /** 发送验证码时返回的data */
    clientCode: string;
    /** 手机号收到的验证码 */
    code: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/user/app/phone',
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}
