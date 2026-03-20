import { Q } from '@nozbe/watermelondb';
import { synchronize, SyncPullArgs, SyncPushArgs } from '@nozbe/watermelondb/sync';
import SyncLogger from '@nozbe/watermelondb/sync/SyncLogger';
import dayjs from 'dayjs';

import { database } from '@/database';
import { GroupMsg, GroupConversation } from '@/database/models';
import { TableName } from '@/database/schema';
import { getBotAppChatroomGroupChatRecords, getBotAppChatroomList } from '@/services/pinyin2';

const handlePullChanges = async ({ lastPulledAt, schemaVersion, migration }: SyncPullArgs) => {
  console.log('Pull changes to local', schemaVersion, lastPulledAt, migration);

  const chatListRes = await getBotAppChatroomList({ pageNo: '1', pageSize: '1000' });
  const conversations = chatListRes.data?.data?.list ?? [];

  // 缓存变更数据
  const convCreated: any[] = [];
  const convUpdated: any[] = [];
  const msgCreated: any[] = [];
  const msgUpdated: any[] = [];
  const deleted: string[] = [];

  for (const conv of conversations) {
    const {
      id,
      roomName,
      roomCode,
      roomAvatar,
      roomType,
      groupType,
      memberLimit,
      description,
      unreadNum,
      lastMessage,
      lastReadTime,
      lastLoadTime,
      createdAt,
      updatedAt,
      creator,
      updater,
    } = conv;

    // 构造标准化数据
    const convPayload = {
      id: String(id),
      conversation_id: String(id),
      room_name: roomName,
      room_code: roomCode,
      room_avatar: roomAvatar,
      room_type: roomType,
      group_type: groupType,
      member_limit: memberLimit,
      description,
      unread_num: unreadNum,
      last_message: JSON.stringify(lastMessage),
      last_message_created_at: lastMessage ? dayjs(lastMessage.createdAt).valueOf() : 0,
      last_read_time: dayjs(lastReadTime).valueOf(),
      last_load_time: dayjs(lastLoadTime).valueOf(),
      created_at: dayjs(createdAt).valueOf(),
      updated_at: dayjs(updatedAt).valueOf(),
      creator: String(creator),
      updater: String(updater),
    };

    // 查询数据库是否存在
    const existsConv = await database
      .get<GroupConversation>(TableName.GROUP_CONVERSATION)
      .query(Q.where('conversation_id', String(id)))
      .fetch();

    (existsConv.length === 0 ? convCreated : convUpdated).push(convPayload);

    // === 处理消息 ===
    const groupChatRecordsRes = await getBotAppChatroomGroupChatRecords({ roomId: +id, pageNo: '1', pageSize: '999' });
    const messages = groupChatRecordsRes.data?.data?.list ?? [];

    for (const msg of messages) {
      const {
        msgId,
        objectId,
        userId,
        avatar,
        nickname,
        userType,
        contentType,
        json,
        media,
        gender,
        textContent,
        fileProperty,
        msgStatus,
        replyMessageId,
        forwardInfo,
        memberIds,
        createdAt,
        sourceType,
      } = msg;

      const msgPayload = {
        id: msgId,
        msg_id: msgId,
        conversation_id: String(objectId),
        is_read: true,
        user_id: String(userId),
        avatar,
        nickname,
        user_type: userType,
        content_type: contentType,
        source_type: sourceType,
        json,
        media,
        gender,
        text_content: textContent,
        file_property: fileProperty,
        msg_status: msgStatus,
        reply_message_id: replyMessageId,
        forward_info: forwardInfo,
        member_ids: memberIds,
        created_at: dayjs(createdAt).valueOf(),
      };

      if (String(objectId) === '61') {
        console.log('itemsssssss: ', msgPayload);
      }

      const existsMsg = await database.get<GroupMsg>(TableName.GROUP_MSGS).query(Q.where('msg_id', msgId!)).fetch();

      (existsMsg.length === 0 ? msgCreated : msgUpdated).push(msgPayload);
    }
  }

  console.log('Conversations created:', convCreated.length);
  console.log('Conversations updated:', convUpdated.length);
  console.log('Messages created:', msgCreated.length);
  console.log('Messages updated:', msgUpdated.length);

  return {
    changes: {
      [TableName.GROUP_CONVERSATION]: {
        created: [],
        updated: [...convCreated, ...convUpdated],
        deleted,
      },
      [TableName.GROUP_MSGS]: {
        created: [],
        updated: [...msgCreated, ...msgUpdated],
        deleted: [],
      },
    },
    timestamp: Date.now(),
  };
};

const handlePushChanges = async ({ changes, lastPulledAt }: SyncPushArgs) => {
  console.log('Push changes to server', changes, lastPulledAt);
};

/**
 * 同步本地数据库与服务器的会话数据
 */
export async function syncWithServerConversations() {
  const logger = new SyncLogger(10 /* limit of sync logs to keep in memory */);

  // this returns all logs (censored and safe to use in production code)
  // console.log(logger.logs);
  // same, but pretty-formatted to a string (a user can easy copy this for diagnostic purposes)
  // console.log(logger.formattedLogs);

  await synchronize({
    database,
    log: logger.newLog(),
    pullChanges: handlePullChanges,
    pushChanges: handlePushChanges,
    sendCreatedAsUpdated: true,
    conflictResolver: (local, remote) => {
      // 如果 ID 相同，则保留更新时间较新的
      return local.last_message_at > remote.last_message_at ? local : remote;
    },
  });
}

/**
 * 清空数据库中的所有记录 （请谨慎使用）
 */
export async function clearAllDatabaseData() {
  await database.write(async () => {
    await database.unsafeResetDatabase();
  });
}
