// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 当前用户菜单列表 GET /admin/current/resources */
export async function getAdminCurrentResources(options?: {
  [key: string]: any;
}) {
  return request<{
    code: number;
    msg: string;
    data: {
      id?: number;
      name?: string;
      parentId?: string;
      type?: string;
      icon?: string;
      route?: string;
      sortNo?: string;
      defaultResource?: string;
      childrens?: {
        id?: number;
        name?: string;
        childrens?: {
          id?: number;
          name?: string;
          parentId?: string;
          type?: string;
          icon?: string;
          route?: string;
          sortNo?: string;
          defaultResource?: string;
          childrens?: Record<string, any>[];
        }[];
        parentId?: string;
        type?: string;
        icon?: string;
        route?: string;
        sortNo?: string;
        defaultResource?: string;
      }[];
    }[];
  }>('/admin/current/resources', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 修改初始密码 PATCH /admin/first/pwd */
export async function patchAdminFirstPwd(
  body: {
    /** 新密码 */
    newPwd: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/admin/first/pwd',
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

/** 获取当前用户信息 GET /admin/me */
export async function getAdminMe(options?: { [key: string]: any }) {
  return request<{
    code: number;
    msg: string;
    data: {
      username: string;
      nickname: string;
      roleId: string;
      roleName: string;
      userId: string;
    };
  }>('/admin/me', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 管理员登录 POST /admin/public/login */
export async function postAdminPublicLogin(
  body: {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
    clientCode: string;
    /** 验证码 */
    verifyCode: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: { token: string; firstTimeLogin: boolean };
  }>('/admin/public/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取图形验证码 GET /admin/public/verify-code */
export async function getAdminPublicVerifyCode(options?: {
  [key: string]: any;
}) {
  return request<{
    code: number;
    msg: string;
    data: { clientCode: string; verifyCode: string };
  }>('/admin/public/verify-code', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获得图形验证码图片 通过此请求获得验证码图片的流 GET /admin/public/verify-code/image/${param0} */
export async function getAdminPublicVerifyCodeImageClientCode(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminPublicVerifyCodeImageClientCodeParams,
  options?: { [key: string]: any },
) {
  const { clientCode: param0, ...queryParams } = params;
  return request<Record<string, any>>(
    `/admin/public/verify-code/image/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 修改密码 PATCH /admin/pwd */
export async function patchAdminPwd(
  body: {
    /** 原密码 */
    oldPwd: string;
    /** 新密码 */
    newPwd: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>('/admin/pwd', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
