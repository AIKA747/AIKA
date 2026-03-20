// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增/修改资源 POST /admin/resources */
export async function postAdminResources(
  body: {
    /** 若无上级默认值 0  */
    parentId: number;
    name: string;
    type: string;
    icon?: string;
    /** 前端的路由名称，若无则默认 default */
    route: string;
    /** 前端页面需要调用的后台接口地址，多个使用逗号分隔 */
    paths?: string;
    sortNo: number;
    /** 是否默认权限，默认权限无需分配所有账号默认拥有 */
    defaultResource: boolean;
    /** 若id不为null则修改资源，为null时新增 */
    id: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      parentId: number;
      name: string;
      type: string;
      icon: string;
      route: string;
      paths: string;
      sortNo: number;
      defaultResource: boolean;
      id: string;
      createdAt: string;
      creator: number;
      updatedAt: string;
      updater: number;
      dataVersion: number;
      deleted: boolean;
    };
  }>('/admin/resources', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除资源 DELETE /admin/resources/${param0} */
export async function deleteAdminResourcesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAdminResourcesIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; msg: string; data: string }>(
    `/admin/resources/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}
