// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** bot统计信息导出 GET /bot/manage/export/bot-conversation-count */
export async function getBotManageOpenApiExportBotConversationCount(options?: {
  [key: string]: any;
}) {
  return request<Record<string, any>>(
    '/bot/manage/export/bot-conversation-count',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** story统计信息导出 GET /content/manage/export/story-count */
export async function getContentManageOpenApiExportStoryCount(options?: {
  [key: string]: any;
}) {
  return request<Record<string, any>>('/content/manage/export/story-count', {
    method: 'GET',
    ...(options || {}),
  });
}
