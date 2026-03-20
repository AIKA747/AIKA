import { Q } from '@nozbe/watermelondb';
import { map } from '@nozbe/watermelondb/utils/rx';

import { MessageItem } from '@/components/Chat/types';
import { database } from '@/database';
import { GroupMsg } from '@/database/models';
import GroupConversation from '@/database/models/group_conversation';
import { TableName } from '@/database/schema';
import { ContentType } from '@/hooks/useChatClient';

export async function createConversation(conversation: Partial<GroupConversation>): Promise<GroupConversation> {
  return await database.write(async () => {
    return await database.get<GroupConversation>(TableName.GROUP_CONVERSATION).create((c) => {
      // c.id = conversation.conversationId || ''; // 使用 conversationId 作为 WatermelonDB 的主键
      c.conversationId = conversation.conversationId || '';
      c.roomName = conversation.roomName || '';
      c.roomCode = conversation.roomCode || '';
      c.roomAvatar = conversation.roomAvatar || '';
      c.roomType = conversation.roomType || '';
      c.groupType = conversation.groupType || '';
      c.memberLimit = conversation.memberLimit || 0;
      c.description = conversation.description || '';
      c.unreadNum = conversation.unreadNum || 0;
      c.lastMessage = conversation.lastMessage ? JSON.stringify(conversation.lastMessage) : '';
      c.lastMessageCreatedAt = conversation.lastMessage
        ? new Date(JSON.parse(JSON.stringify(conversation.lastMessage)).createdAt)
        : new Date();
      c.lastReadTime = conversation.lastReadTime ? new Date(conversation.lastReadTime) : new Date();
      c.lastLoadTime = conversation.lastLoadTime ? new Date(conversation.lastLoadTime) : new Date();
      c.createdAt = new Date();
      c.creator = conversation.creator || '';
      c.updatedAt = new Date();
      c.updater = conversation.updater || '';
    });
  });
}

/**
 * 存储聊天记录
 */
export async function saveGroupMessages(messages: MessageItem[], curUserId?: string, curChatId?: string) {
  if (!messages.length) return;

  try {
    const collection = database.get<GroupMsg>(TableName.GROUP_MSGS);

    await database.write(async () => {
      for (const msg of messages) {
        if (curUserId && curUserId === msg.userId) msg.isRead = true;
        if (curChatId && `${curChatId}` === `${msg.objectId}`) msg.isRead = true;
        msg.isRead = !!msg.isRead;
        const dbMessages = await collection.query(Q.where('msg_id', msg.msgId!)).fetch();
        const oldMessage = dbMessages?.find((x) => x.msgId === msg.msgId);
        try {
          if (oldMessage) {
            await oldMessage.update((message) => Object.assign(message, msg));
            console.log(`Message ${msg.msgId} updated successfully`);
          } else {
            await collection.create((record) => Object.assign(record, msg));
            console.log('WatermelonDB 插入消息完成', JSON.stringify(msg, null, 2));
          }
        } catch (error) {
          console.log('saveGroupMessages error:', error, `[${msg.msgId}]`);
          // @ts-ignore
          if (error?.message?.includes?.('UNIQUE constraint failed')) {
            // console.log(`msg_id ${msg.msgId} 已存在，跳过插入`);
          }
        }
      }
    });
  } catch (error) {
    console.error('WatermelonDB 插入消息出错:', error);
    throw error;
  }
}

export async function fetchConversations() {
  return database.get<GroupConversation>(TableName.GROUP_CONVERSATION).query().fetch();
}

export async function fetchConversationById(id: string) {
  return await database
    .get<GroupConversation>(TableName.GROUP_CONVERSATION)
    .query(Q.where('conversation_id', id))
    .fetch()
    .then((result) => result[0] || null);
}

export async function getConversationMessages(conversationId: string): Promise<GroupMsg[]> {
  // 先查出对应的 Conversation
  const conversation = await fetchConversationById(conversationId);

  if (!conversation) {
    return [];
  }

  // 通过 @children 自动关联查询 messages
  return await conversation.messages.fetch();
}

/**
 * 查询会话列表并加载最新一条消息
 */
export async function getConversationsWithLastMessage() {
  const conversations = await database
    .get<GroupConversation>(TableName.GROUP_CONVERSATION)
    .query(Q.sortBy('last_message_created_at', Q.desc))
    .fetch();

  return await Promise.all(
    conversations.map(async (conv) => {
      const lastMessage = await conv.fetchLatestMessage();
      return {
        ...conv,
        lastMessageContent: lastMessage?.textContent ?? null,
        lastMessageCreatedAt: lastMessage?.createdAt ?? null,
      };
    }),
  );
}

export async function deleteConversation(id: string) {
  return database.write(async () => {
    const conversation = await fetchConversationById(id);
    const messages = await getConversationMessages(id);
    if (conversation) {
      await database.batch(...messages.map((msg) => msg.prepareMarkAsDeleted()));
      await conversation.markAsDeleted();
    }
  });
}
export async function getAllMessages(): Promise<GroupMsg[]> {
  return database.get<GroupMsg>(TableName.GROUP_MSGS).query(Q.sortBy('created_at', Q.desc)).fetch();
}
export async function getMessagesByConversationId(conversationId: string): Promise<GroupMsg[]> {
  return database
    .get<GroupMsg>(TableName.GROUP_MSGS)
    .query(Q.where('conversation_id', `${conversationId}`), Q.sortBy('created_at', Q.desc))
    .fetch();
}

/**
 * 分页查询聊天记录
 * @param conversationId
 * @param createdAt
 * @param pageNo
 * @param pageSize
 */
export async function fetchConversationMessages(
  conversationId: string, // 群 id
  createdAt: number, // 时间戳
  pageNo: number,
  pageSize: number,
): Promise<{ list: GroupMsg[]; total: number }> {
  try {
    const collection = database.get<GroupMsg>(TableName.GROUP_MSGS);
    const totalQuery = collection.query(
      Q.where('conversation_id', `${conversationId}`), // 群 id 过滤
      Q.sortBy('created_at', Q.desc),
    );
    const query = collection.query(
      Q.where('conversation_id', `${conversationId}`), // 群 id 过滤
      Q.sortBy('created_at', Q.desc), // created_at 降序，目前后端对消息时间精度只到秒，可优化到毫秒以降低时间相同导致的顺序问题及其他对消息时间敏感的问题
      // Q.sortBy('msg_id', Q.desc), // 若 created_at 相同, msg_id 降序
      Q.where('created_at', Q.lte(createdAt)), // createdAt 应始终固定一个值（第一次查询时的当前时间或第一次查询时的最新消息的时间），往后翻页才不会因为新数据的插入而导致分页数据获取重复
      Q.skip((pageNo - 1) * pageSize),
      Q.take(pageSize),
    );
    const list = await query.fetch();
    const total = await totalQuery.fetchCount();
    return {
      list,
      total,
    };
  } catch (err) {
    console.log('Query chat' + conversationId + 'date error:', err);
    return {
      list: [],
      total: 0,
    };
  }
}

/**
 * 监听 unreadNum 并返回总和
 */
export function observeUnreadCount() {
  return database
    .get<GroupConversation>(TableName.GROUP_CONVERSATION)
    .query()
    .observeWithColumns(['unread_num']) // Observable<GroupConversation[]>
    .pipe(
      map((conversations) => {
        // 累加 unreadNum
        return conversations.reduce((sum, conv) => sum + (conv.unreadNum ?? 0), 0);
      }),
    );
}

const escapeLikeString = (text: string) => {
  return text.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
};

/**
 * 过滤搜索某个 chatroom 的消息文本
 * @param conversationId
 * @param textContent
 */
export const queryGroupMsgsByText = async (conversationId: string, textContent: string) =>
  await database
    .get<GroupMsg>(TableName.GROUP_MSGS)
    .query(
      Q.where('conversation_id', `${conversationId}`),
      Q.where('content_type', ContentType.TEXT),
      // Q.where('text_content', Q.includes(textContent)),
      Q.unsafeSqlExpr(`text_content LIKE '%${escapeLikeString(textContent)}%' ESCAPE '\\'`),
      Q.sortBy('created_at', Q.desc),
      // Q.sortBy('msg_id', Q.desc),
    )
    .fetch();

/**
 * 查询某个 chatroom 的所有图片
 * @param objectId
 */
export const queryGroupImages = async (objectId: string) =>
  await database
    .get(TableName.GROUP_MSGS)
    .query(
      Q.unsafeSqlQuery(
        `SELECT msg_id, media, created_at FROM ${TableName.GROUP_MSGS} WHERE _status != 'deleted' AND conversation_id = ? AND content_type = '${ContentType.IMAGE}' ORDER BY created_at ASC`,
        [objectId],
      ),
    )
    .unsafeFetchRaw();

/**
 * message 'is_read' 标记已读
 * @param objectIds
 */
export const markMsgsAsRead = async (objectIds: string[]) => {
  await database.adapter.unsafeExecute({
    sqls: [
      [
        `UPDATE ${TableName.GROUP_MSGS}
         SET is_read = 1
         WHERE is_read = 0 AND conversation_id in (${objectIds.map(() => `?`).join(',')});
        `,
        objectIds.map((id) => `${id}`),
      ],
    ],
  });
};

export async function deleteMessage(id: string) {}
