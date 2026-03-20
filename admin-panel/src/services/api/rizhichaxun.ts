// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 发送邮件记录 GET /admin/email-logs */
export async function getAdminEmailLogs(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminEmailLogsParams,
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
        email: string;
        content: string;
        status: 'Success' | 'Failed';
        sendTime: string;
      }[];
    };
  }>('/admin/email-logs', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 操作日志记录 GET /admin/operation-logs */
export async function getAdminOperationLogs(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminOperationLogsParams,
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
        adminName: string;
        module: string;
        record: string;
        initialValue?: string;
        finalValue: string;
        operatedTime: string;
        action: string;
      }[];
    };
  }>('/admin/operation-logs', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 发送短信记录 GET /admin/sms-logs */
export async function getAdminSmsLogs(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminSmsLogsParams,
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
        phone: string;
        content: string;
        status: string;
        sendTime: string;
      }[];
    };
  }>('/admin/sms-logs', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
