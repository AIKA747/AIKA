// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 游戏列表（新） GET /bot/app/game */
export async function getBotAppGame(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppGameParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: { total: number; pageNum: number; pageSize: number; pages: number; list: API.GameListDto[] };
  }>('/bot/app/game', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 开始游戏（新） POST /bot/app/game-thread */
export async function postBotAppGameThread(
  body: {
    gameId: string;
    restart?: boolean;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>('/bot/app/game-thread', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 游戏详情接口 GET /bot/app/game/${param0} */
export async function getBotAppGameId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppGameIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; msg: string; data: API.Game }>(`/bot/app/game/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 会话记录 该接口排序，按照消息记录的时间，越新越靠前 进行排序

查询当前登录用户与传入的botId之间的聊天记录 GET /bot/app/game/chat/records */
export async function getBotAppGameChatRecords(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppGameChatRecordsParams,
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
        objectId: string;
        contentType: string;
        json?: string;
        media?: string;
        textContent?: string;
        sourceType: string;
        userId: string;
        msgStatus: string;
        readFlag: boolean;
        readTime: string;
        replyMessageId: string;
        createdAt: string;
        msgId: string;
        fileProperty: string;
        videoUrl: string;
        videoStatus: string;
        digitHuman: boolean;
        badAnswer: boolean;
        gameStatus: string;
      }[];
    };
  }>('/bot/app/game/chat/records', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 我正在进行的游戏列表（新） GET /bot/app/my-game */
export async function getBotAppMyGame(options?: { [key: string]: any }) {
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
        gameId: number;
        status: string;
        cover: string;
        resultSummary: string;
        gameName: string;
        createdAt: string;
        updatedAt: string;
        listCoverDark: string;
        introduce: string;
      }[];
    };
  }>('/bot/app/my-game', {
    method: 'GET',
    ...(options || {}),
  });
}
