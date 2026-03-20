// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 举报贴子 POST /content/app/post/report */
export async function postContentAppPostReport(
  body: {
    /** 贴子id */
    postId: number;
    /** 举报分类id */
    reportId: number;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>('/content/app/post/report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 取消举报贴子 DELETE /content/app/post/report/${param0} */
export async function deleteContentAppPostReportPostId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteContentAppPostReportPostIdParams,
  options?: { [key: string]: any },
) {
  const { postId: param0, ...queryParams } = params;
  return request<{ code: number; msg: string; data: string }>(`/content/app/post/report/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 举报分类列表 GET /content/public/report-list */
export async function getContentPublicReportList(options?: { [key: string]: any }) {
  return request<{ code: number; msg: string; data: { id: number; title: string; description: string }[] }>(
    '/content/public/report-list',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}
