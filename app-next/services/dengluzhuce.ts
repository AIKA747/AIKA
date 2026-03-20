// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 验证用户名是否可用（新） 验证用户名是否可用 （用户名不重复，就是可用） GET /user/app/user/check-username */
export async function getUserAppUserCheckUsername(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserAppUserCheckUsernameParams,
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>('/user/app/user/check-username', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** apple登录 POST /user/public/apple/login */
export async function postUserPublicAppleLogin(
  body: {
    /** 客户端通过用户授权获取到的idToken */
    identityToken: string;
    /** 苹果用户id */
    appleUserId: string;
    /** 国家,ISO 3166-1国际标准代码 */
    country?: string;
    /** 语言,ISO 639-1国际标准代码 */
    language?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      username: string;
      userId: string;
      avatar: string;
      phone: string;
      email: string;
      gender: string;
      tags: string[];
      botTotal: number;
      storyTotal: number;
      followerTotal: number;
      commentTotal: number;
      notifyFlag: number;
      status: string;
      token: string;
      setPassword: boolean;
      country: string;
      language: string;
      loginType: string;
    };
  }>('/user/public/apple/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** app账号密码登录 POST /user/public/auth */
export async function postUserPublicAuth(
  body: {
    /** 手机号或邮箱 */
    account: string;
    /** 密码 */
    password: string;
    /** 国家 */
    country?: string;
    /** 语言 */
    language?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      username: string;
      userId: string;
      avatar: string;
      phone: string;
      email: string;
      gender: string;
      tags: string[];
      botTotal: number;
      storyTotal: number;
      followerTotal: number;
      commentTotal: number;
      notifyFlag: number;
      status: string;
      token: string;
      setPassword: boolean;
      country: string;
      language: string;
      loginType: string;
    };
  }>('/user/public/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** facebook登录 POST /user/public/facebook/login */
export async function postUserPublicFacebookLogin(
  body: {
    /** client端获取到的用户授权token */
    accessToken: string;
    country?: string;
    language?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      username: string;
      userId: string;
      avatar: string;
      phone: string;
      email: string;
      gender: string;
      tags: string[];
      botTotal: number;
      storyTotal: number;
      followerTotal: number;
      commentTotal: number;
      notifyFlag: number;
      status: string;
      token: string;
      setPassword: boolean;
      country: string;
      language: string;
      loginType: string;
    };
  }>('/user/public/facebook/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Google登录 POST /user/public/google/login */
export async function postUserPublicGoogleLogin(
  body: {
    /** 客户端通过用户授权获取到的idToken */
    idToken: string;
    /** 设备类型 ios android */
    ostype: string;
    /** 国家,ISO 3166-1国际标准代码 */
    country?: string;
    /** 语言,ISO 639-1国际标准代码 */
    language?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      username: string;
      userId: string;
      avatar: string;
      phone: string;
      email: string;
      gender: string;
      tags: string[];
      botTotal: number;
      storyTotal: number;
      followerTotal: number;
      commentTotal: number;
      notifyFlag: number;
      status: string;
      token: string;
      setPassword: boolean;
      country: string;
      language: string;
      loginType: string;
    };
  }>('/user/public/google/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 邮箱登录(注册)-token置换 GET /user/public/refresh-token */
export async function getUserPublicRefreshToken(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserPublicRefreshTokenParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      username: string;
      userId: string;
      avatar: string;
      phone: string;
      email: string;
      gender: string;
      tags: string[];
      botTotal: number;
      storyTotal: number;
      followerTotal: number;
      commentTotal: number;
      notifyFlag: number;
      status: string;
      token: string;
      setPassword: boolean;
      country: string;
      language: string;
      loginType: string;
      firstLogin: boolean;
    };
  }>('/user/public/refresh-token', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 邮箱验证(改) 邮箱验证，会通过邮件的方式发送一个验证链接（前端H5页面），用户打开H5页面时(通过调用该接口)标记该邮箱已验证。
注册，修改邮箱 功能 的邮箱验证码验证都可以通过该接口进行验证 PUT /user/public/register-email-verify */
export async function putUserPublicRegisterEmailVerify(
  body: {
    /** 注册时返回的clientCode参数 */
    clientCode: string;
    /** 邮件中的验证码verifyCode参数 */
    verifyCode: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>('/user/public/register-email-verify', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 邮箱登录(注册)-发送邮件(新) 用户注册发送注册邮件，该接口会返回用户校验码，校验码用于查询发送的邮件中的链接是否已验证 POST /user/public/v2/verify-email */
export async function postUserPublicV2VerifyEmail(
  body: {
    email: string;
    password: string;
    /** 国家,ISO 3166-1国际标准代码 */
    country?: string;
    /** 语言,ISO 639-1国际标准代码 */
    language?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: { clientCode: string } }>('/user/public/v2/verify-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 邮箱登录(注册)-发送邮件 用户注册发送注册邮件，该接口会返回用户校验码，校验码用于查询发送的邮件中的链接是否已验证 POST /user/public/verify-email */
export async function postUserPublicVerifyEmail(
  body: {
    email: string;
    password: string;
    /** 国家,ISO 3166-1国际标准代码 */
    country?: string;
    /** 语言,ISO 639-1国际标准代码 */
    language?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>('/user/public/verify-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
