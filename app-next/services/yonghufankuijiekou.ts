// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 新增用户反馈 POST /user/app/feedback */
export async function postUserAppFeedback(
  body: {
    /** 设备 */
    device: string;
    /** 系统版本 */
    systemVersion: string;
    /** 反馈类型 */
    category: string;
    /** select框中选中的value，这里直接传文本显示的值，不要传id */
    titleValue: string;
    /** 反馈标题，与titleValue值保持一致，仅titleValue=Other时，保存用户填写的值 */
    title: string;
    /** 反馈详情 */
    description: string;
    /** 图片列表 */
    images: string[];
    /** 视频 */
    video: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>('/user/app/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 反馈id详情 GET /user/app/feedback/${param0} */
export async function getUserAppFeedbackId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserAppFeedbackIdParams,
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
      operationLogs: { status: string; operationUser: string; operationTime: string; remark: string }[];
    };
  }>(`/user/app/feedback/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 撤销反馈 DELETE /user/app/feedback/${param0} */
export async function deleteUserAppFeedbackId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserAppFeedbackIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; msg: string; data: string }>(`/user/app/feedback/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 反馈列表 GET /user/app/feedback/list */
export async function getUserAppFeedbackList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserAppFeedbackListParams,
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
      list: { id: string; title: string; status: string; submissionAt: string }[];
    };
  }>('/user/app/feedback/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
