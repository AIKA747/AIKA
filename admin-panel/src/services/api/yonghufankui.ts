// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 修改用户反馈状态 修改用户反馈数据状态  
当status=underReview时，可将状态修改为pending(继续处理), rejected(拒绝处理)  
当status=rejected时，可将状态修改为underReview(待复核状态) PATCH /user/manage/feedback */
export async function patchUserManageFeedback(
  body: {
    /** 反馈id */
    id: string;
    /** underReview, pending, rejected */
    status: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/user/manage/feedback',
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

/** 反馈详情 GET /user/manage/feedback/${param0} */
export async function getUserManageFeedbackId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserManageFeedbackIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    code: number;
    msg: string;
    data: {
      id: number;
      userId: number;
      username: string;
      email: string;
      device: string;
      systemVersion: string;
      category: string;
      title: string;
      titleValue: string;
      description: string;
      images: string[];
      video: string;
      status: string;
      submissionAt: string;
      replyAt: string;
      replyContent: string;
      iuessId: string;
      replyImages: string[];
      operationLogs: {
        status: string;
        operationUser: string;
        operationTime: string;
        remark: string;
      }[];
    };
  }>(`/user/manage/feedback/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 反馈列表 GET /user/manage/feedback/list */
export async function getUserManageFeedbackList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserManageFeedbackListParams,
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
        id: number;
        userId: number;
        username: string;
        email: string;
        category: string;
        title: string;
        device: string;
        systemVersion: string;
        status: string;
        submissionAt: string;
      }[];
    };
  }>('/user/manage/feedback/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 回复用户反馈 POST /user/manage/feedback/reply */
export async function postUserManageFeedbackReply(
  body: {
    /** 反馈id */
    id: number;
    /** 回复内容 */
    replyContent: string;
    /** 回复反馈图片集合 */
    replyImages: string[];
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      id: string;
      userId: string;
      username: string;
      email: string;
      device: string;
      systemVersion: string;
      category: string;
      title: string;
      titleValue: string;
      description: string;
      images: string[];
      video: string;
      status: string;
      submissionAt: string;
      replyAt: string;
      replyContent: string;
      iuessId: string;
      replyImages: string[];
      operationLogs: {
        status: string;
        operationUser: string;
        operationTime: string;
        remark: string;
      }[];
    };
  }>('/user/manage/feedback/reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户反馈数量统计 GET /user/manage/feedback/report-quantity */
export async function getUserManageFeedbackReportQuantity(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserManageFeedbackReportQuantityParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: { dayId: string; reportQuantity: number; userCount: number }[];
  }>('/user/manage/feedback/report-quantity', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 反馈状态统计 GET /user/manage/feedback/status-statistics */
export async function getUserManageFeedbackStatusStatistics(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserManageFeedbackStatusStatisticsParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: { status: string; quantity: number }[];
  }>('/user/manage/feedback/status-statistics', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 反馈标题统计 GET /user/manage/feedback/title-statistics */
export async function getUserManageFeedbackTitleStatistics(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserManageFeedbackTitleStatisticsParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: { titleValue: string; quantity: number }[];
  }>('/user/manage/feedback/title-statistics', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
