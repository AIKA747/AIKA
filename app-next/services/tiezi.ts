// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 搜索流行的posts 这个实现的方式与 feed是近似的，但是不同的是，它能够返回直接返回Posts中的thread节点的数据。 GET /content/app/pop-posts */
export async function getContentAppPopPosts(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppPopPostsParams,
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
        nickname: string;
        type: string;
        author: string;
        username: string;
        content?: string;
        images?: string[];
        title?: string;
        threadIndex: number;
        createdAt: string;
        avatar: string;
        postId: number;
        video?: string;
      }[];
    };
  }>('/content/app/pop-posts', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查看帖子详情 帖子详情 GET /content/app/post/${param0} */
export async function getContentAppPostId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppPostIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    code: number;
    msg: string;
    data: {
      title: string;
      summary: string;
      thread: { title: string; content?: string; video?: string; fileProperty?: string; images: string[] }[];
      id: number;
      cover: string;
      video: string;
      topicTags: string;
      createdAt: string;
      updatedAt: string;
      author: string;
      type: string;
      likes: number;
      reposts: number;
      visits: number;
      keywords: string;
      recommendTags: string;
      nickname: string;
      avatar: string;
      thumbed: boolean;
    };
  }>(`/content/app/post/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 发表文章（新） 发表文章的时候要额外做的事情。
1.保存文章。
2. 把文章丢到队列里，然后做数据处理，分解出关键词。

 POST /content/app/posts */
export async function postContentAppPosts(body: API.PostVO, options?: { [key: string]: any }) {
  return request<API.BaseResult>('/content/app/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除帖子（新改） 第一版：只能删除自己的帖子
改动后：
1.删除自己的帖子，删除的帖子所有人不可见
2.删除别人的帖子，当前删除则查询不到这个帖子，其他人还是能够查询到 DELETE /content/app/posts/${param0} */
export async function deleteContentAppPostsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteContentAppPostsIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<Record<string, any>>(`/content/app/posts/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** feed文章列表（新） 获得feed的文章列表。这里的feed未来将实现一个推荐算法，故将此接口单独设计。
注：要修改此接口返回Thread GET /content/app/posts/feed */
export async function getContentAppPostsFeed(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppPostsFeedParams,
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
        title: string;
        summary: string;
        id: number;
        cover: string;
        video?: string;
        topicTags: string;
        createdAt: string;
        updatedAt?: string;
        author: number;
        type: string;
        likes: number;
        reposts: number;
        keywords: string;
        nickname: string;
        avatar: string;
        thread: { title: string; content: string; video?: string; fileProperty?: string; images?: string[] }[];
        thumbed: string;
        reportId?: number;
      }[];
    };
  }>('/content/app/posts/feed', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 我关注的用户发表的文章列表（新） 我关注的文章列表
图片地址都是原图片地址
比如说：https://s3.aws.com/mybulk/111.png
它的缩略图为 https://s3.aws.com/mybulk/111-small.png GET /content/app/posts/follow */
export async function getContentAppPostsFollow(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppPostsFollowParams,
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
        title: string;
        summary: string;
        id: number;
        cover: string;
        video?: string;
        topicTags: string;
        createdAt: string;
        updatedAt?: string;
        author: number;
        type: string;
        likes: number;
        reposts: number;
        keywords: string;
        nickname: string;
        avatar: string;
        thread: { title?: string; content?: string; images?: string[]; video?: string; fileProperty?: string }[];
        thumbed: boolean;
        reportId?: number;
      }[];
    };
  }>('/content/app/posts/follow', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 用户发表的文章列表（新改） GET /content/app/posts/private */
export async function getContentAppPostsPrivate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppPostsPrivateParams,
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
        title: string;
        summary: string;
        id: number;
        cover: string;
        video?: string;
        topicTags: string;
        createdAt: string;
        updatedAt?: string;
        author: string;
        type: string;
        likes: number;
        reposts: number;
        keywords: string;
        nickname: string;
        avatar: string;
        thread: { title: string; content: string; video?: string; fileProperty?: string; images?: string[] }[];
        thumbed: boolean;
        reportId?: number;
      }[];
    };
  }>('/content/app/posts/private', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
