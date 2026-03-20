// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

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
  return request<{ code: number; msg: string; data: string }>(
    '/user/app/user-email/verify',
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

/** 新邮箱验证链接发送 POST /user/app/verify-new-email */
export async function postUserAppVerifyNewEmail(
  body: {
    /** 邮箱地址 */
    email: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/user/app/verify-new-email',
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

/** 旧邮箱验证发送 POST /user/app/verify-old-email */
export async function postUserAppVerifyOldEmail(options?: {
  [key: string]: any;
}) {
  return request<{ code: number; msg: string; data: string }>(
    '/user/app/verify-old-email',
    {
      method: 'POST',
      ...(options || {}),
    },
  );
}

/** 校验旧邮箱是否验证 PUT /user/public/old-email-verify-status */
export async function putUserPublicOldEmailVerifyStatus(
  body: {
    /** 校验码 */
    clientCode: string;
    /** 验证码 */
    verifyCode: string;
    /** 新邮箱 */
    newEmail: string;
    /** 新密码 */
    newPwd: string;
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/user/public/old-email-verify-status', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新用户邮箱 PATCH /user/public/user/email */
export async function patchUserPublicUserEmail(
  body: {
    /** clientCode */
    clientCode: string;
    /** 验证码 */
    verifyCode: string;
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/user/public/user/email', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
