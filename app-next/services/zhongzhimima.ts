// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 重置密码 通过短信或邮件中的重置密码页面链接重置用户密码 PUT /user/public/password/reset */
export async function putUserPublicPasswordReset(
  body: {
    /** 邮件链接中生成的校验码 */
    clientCode: string;
    /** 验证码 */
    verifyCode: string;
    /** 密码 */
    password: string;
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/user/public/password/reset', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 忘记密码-发送邮件 忘记密码发送邮件，邮件中带上重置密码的url。url中需要带有临时生成得一个校验码，同时，邮件中需要有明确的显示此临时的校验码。 POST /user/public/user/reset-pwd-email */
export async function postUserPublicUserResetPwdEmail(
  body: {
    /** 邮件 */
    email: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>('/user/public/user/reset-pwd-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
