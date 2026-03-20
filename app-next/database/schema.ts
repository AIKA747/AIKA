import { appSchema, tableSchema } from '@nozbe/watermelondb';

export enum TableName {
  GROUP_CONVERSATION = 'group_conversation',
  GROUP_MSGS = 'group_msgs',
  GROUP_MSGS_MEDIA = 'group_msgs_media',
}

export default appSchema({
  version: 1, // Increment this version number when making schema changes
  tables: [
    tableSchema({
      name: TableName.GROUP_CONVERSATION,
      columns: [
        { name: 'conversation_id', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
        { name: 'creator', type: 'string', isOptional: true },
        { name: 'updated_at', type: 'number' },
        { name: 'updater', type: 'string', isOptional: true },
        { name: 'room_name', type: 'string' },
        { name: 'room_type', type: 'string', isOptional: true }, // TALES,EXPERT,GAME,GROUP_CHAT,CHAT 目前只有：GROUP_CHAT,CHAT
        { name: 'group_type', type: 'string', isOptional: true },
        { name: 'room_avatar', type: 'string', isOptional: true },
        { name: 'member_limit', type: 'number', isOptional: true },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'room_code', type: 'string' },
        { name: 'unread_num', type: 'number', isOptional: true },
        { name: 'last_message', type: 'string', isOptional: true },
        { name: 'last_message_created_at', type: 'number' }, // 用于排序和显示最后一条消息的时间
        { name: 'last_read_time', type: 'number' },
        { name: 'last_load_time', type: 'number' },
      ],
      // 对 conversation_id 建立唯一索引，可避免会话重复插入
      unsafeSql: (sql) => {
        sql = `${sql}CREATE UNIQUE INDEX IF NOT EXISTS "group_conversation_id" ON "${TableName.GROUP_CONVERSATION}"("conversation_id");`;
        return sql;
      },
    }),
    tableSchema({
      name: TableName.GROUP_MSGS,
      columns: [
        { name: 'conversation_id', type: 'string' }, // 关联 Conversation.id
        { name: 'is_read', type: 'boolean', isIndexed: true },
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'avatar', type: 'string', isOptional: true },
        { name: 'nickname', type: 'string', isOptional: true },
        { name: 'user_type', type: 'string', isOptional: true },
        { name: 'content_type', type: 'string', isOptional: true },
        { name: 'json', type: 'string', isOptional: true },
        { name: 'media', type: 'string', isOptional: true },
        { name: 'gender', type: 'string', isOptional: true },
        { name: 'text_content', type: 'string', isOptional: true },
        { name: 'file_property', type: 'string', isOptional: true },
        { name: 'msg_id', type: 'string', isIndexed: true },
        { name: 'chapter_status', type: 'string', isOptional: true },
        { name: 'chapter_process', type: 'string', isOptional: true },
        { name: 'digit_human', type: 'string', isOptional: true },
        { name: 'msg_status', type: 'string', isOptional: true },
        { name: 'reply_message_id', type: 'string', isOptional: true },
        { name: 'reply_message', type: 'string', isOptional: true },
        { name: 'source_type', type: 'string', isOptional: true },
        { name: 'game_status', type: 'string', isOptional: true },
        { name: 'video_status', type: 'string', isOptional: true },
        { name: 'video_url', type: 'string', isOptional: true },
        { name: 'forward_info', type: 'string', isOptional: true },
        { name: 'member_ids', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
      ],

      // 对 msg_id 建立唯一索引，可避免消息重复插入
      unsafeSql: (sql) => {
        sql = `${sql}CREATE UNIQUE INDEX IF NOT EXISTS "group_msgs_msg_id" ON "${TableName.GROUP_MSGS}"("msg_id");`;
        return sql;
      },
    }),
    tableSchema({
      // 用于记录用户所删除群聊中的媒体资源，用于在查看群聊文件时，不再显示已删除的资源
      name: TableName.GROUP_MSGS_MEDIA,
      columns: [
        { name: 'object_id', type: 'string', isIndexed: true },
        { name: 'room_id', type: 'string', isOptional: false },
        { name: 'member_id', type: 'string', isOptional: false },
        { name: 'media_id', type: 'string', isOptional: false },
        { name: 'media_type', type: 'string', isOptional: false },
        { name: 'media_url', type: 'string', isOptional: false },
        { name: 'created_at', type: 'number' },
      ],
    }),
  ],
});
