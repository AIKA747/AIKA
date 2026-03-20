// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 用户注销 DELETE /user/app/delete */
export async function deleteUserAppOpenApiDelete(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/user/app/delete', {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 绑定firebasetoken POST /user/app/firebase/bind/${param0} */
export async function postUserAppFirebaseBindToken(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postUserAppFirebaseBindTokenParams,
  options?: { [key: string]: any },
) {
  const { token: param0, ...queryParams } = params;
  return request<Record<string, any>>(`/user/app/firebase/bind/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 标记关注用户最新更新已读（旧） PUT /user/app/follower/last-read-time */
export async function putUserAppFollowerLastReadTime(
  body: {
    /** 被关注用户id */
    followingId: string;
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/user/app/follower/last-read-time', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 编辑用户信息（新）（1.1改） 注意：该接口需要校验，用户填写的邮箱是否已通过验证 PATCH /user/app/info */
export async function patchUserAppInfo(
  body: {
    /** 用户名 */
    username?: string;
    nickname?: string;
    /** 性别：'MALE','HIDE','FEMALE','OTHER' */
    gender?: string;
    /** 头像 */
    avatar?: string;
    /** 多个标签使用逗号分隔 */
    tags?: string[];
    /** 系统通知1：0x001；关注用户创建机器人通知2：0x010；被订阅收藏关注4：0x100 */
    notifyFlag?: number;
    /** 国家,ISO 3166-1国际标准代码 */
    country?: string;
    /** 语言,ISO 639-1国际标准代码 */
    language?: string;
    /** 体育类兴趣 */
    sport?: Record<string, any>;
    /** 娱乐类兴趣 */
    entertainment?: Record<string, any>;
    /** 新闻类兴趣 */
    news?: Record<string, any>;
    /** 游戏类兴趣 */
    gaming?: Record<string, any>;
    /** 艺术类兴趣 */
    artistic?: Record<string, any>;
    /** 生活方式向量 */
    lifestyle?: Record<string, any>;
    /** 技术与发明类兴趣 */
    technology?: Record<string, any>;
    /** 社交类兴趣 */
    social?: Record<string, any>;
    /** 感兴趣的性别，'MALE','FEMALE','ALL' */
    interestGender?: string;
    /** 是否显示性别 */
    showGender?: boolean;
    /** 生日 */
    birthday?: string;
    /** 职业 */
    occupation?: string;
    bio?: string;
    /** 自动允许加入群聊 */
    allowJoinToChat?: boolean;
    /** 背景图片 */
    backgroundImage?: string;
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
    };
  }>('/user/app/info', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取兴趣列表（新）（Habit、Personality 都可以看成是特殊的兴趣） 前两个表示两种“用户习惯”，返回的每个习惯都提供多个备选项，备选项为单选  。 
    PERSONALITY,
    HABIT,
    
后面 5 个分别是 5 种类型的 “兴趣” 每个 都没有备选项，所有没有备选项的兴趣都可视为 0、1 的开关，即：选中为1，不选则为0

   COMPETITIVE,
    SKILLBASED,
    ARTISTIC,
    LIFESTYLE,
    INTELLIGENCE

最后一个枚举，是为了方便前端特别设计的，传 OTHER，则返回所有的 “兴趣”，也就是前面五个类型
    OTHER GET /user/app/interest-items */
export async function getUserAppInterestItems(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserAppInterestItemsParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      itemType: string;
      itemName: string;
      multiple: boolean;
      valueArray: { optName: string; value: string }[];
      id: number;
      orderNum: number;
      itemNameLab: string;
      itemTypeLab: string;
    }[];
  }>('/user/app/interest-items', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 退出登录 用户退出登录时，需先调用该接口在清理本地用户登录信息 DELETE /user/app/logout */
export async function deleteUserAppLogout(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/user/app/logout', {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 当前登录用户信息（改） GET /user/app/me */
export async function getUserAppMe(options?: { [key: string]: any }) {
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
      nickname: string;
      birthday: string;
      bio: string;
      expiredDate: string;
      allowJoinToChat: boolean;
      backgroundImage: string;
    };
  }>('/user/app/me', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 修改密码 PATCH /user/app/pwd */
export async function patchUserAppPwd(
  body: {
    /** 原密码 */
    oldPwd: string;
    /** 新密码 */
    newPwd: string;
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/user/app/pwd', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询用户订阅信息 GET /user/app/subscription */
export async function getUserAppSubscription(options?: { [key: string]: any }) {
  return request<{
    code: number;
    msg: string;
    data: {
      packageId: string;
      packageName: string;
      expiredDate: string;
      cover: string;
      description: string;
      subscriptTime: string;
    }[];
  }>('/user/app/subscription', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取标签列表 GET /user/app/tags */
export async function getUserAppTags(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserAppTagsParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: { total: number; pageNum: number; pageSize: number; pages: number; list: string[] };
  }>('/user/app/tags', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 根据username查询指定用户信息 GET /user/app/user */
export async function getUserAppUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserAppUserParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      id: number;
      username: string;
      avatar: string;
      gender: string;
      followerTotal: number;
      botTotal: number;
      storyTotal: number;
      followed: boolean;
      friend: boolean;
      nickname: string;
      backgroundImage: string;
      bio: string;
      isBlacked: boolean;
      status: string;
    };
  }>('/user/app/user', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 修改当前用户的地理位置信息（新） 更新当前用户的经纬度。从Header中取用户信息。 PATCH /user/app/user-location */
export async function patchUserAppUserLocation(
  body: {
    /** 当前纬度 */
    curLat: number;
    /** 当前经度 */
    curLng: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/user/app/user-location', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询指定用户信息 GET /user/app/user/${param0} */
export async function getUserAppUserId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserAppUserIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    code: number;
    msg: string;
    data: {
      id: number;
      username: string;
      avatar: string;
      gender: string;
      followerTotal: number;
      botTotal: number;
      storyTotal: number;
      followed: boolean;
      friend: boolean;
      nickname: string;
      backgroundImage: string;
      bio: string;
      isBlacked: boolean;
      status: string;
    };
  }>(`/user/app/user/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 隐私政策 数据从redis中取得，redisKey: user:confidentiality-policy GET /user/public/confidentiality-policy */
export async function getUserPublicConfidentialityPolicy(options?: { [key: string]: any }) {
  return request<{ code: number; msg: string; data: string }>('/user/public/confidentiality-policy', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 使用条款 数据从redis中取得，redisKey: user:use-terms GET /user/public/use-terms */
export async function getUserPublicUseTerms(options?: { [key: string]: any }) {
  return request<{ code: number; msg: string; data: string }>('/user/public/use-terms', {
    method: 'GET',
    ...(options || {}),
  });
}
