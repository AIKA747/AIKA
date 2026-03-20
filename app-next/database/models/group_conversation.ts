import { Model, Q, Query } from '@nozbe/watermelondb';
import { children, date, field, json, writer } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';

import GroupMsg from '@/database/models/group-msg';
import { TableName } from '@/database/schema';

export default class GroupConversation extends Model {
  static table = TableName.GROUP_CONVERSATION;

  static associations: Associations = {
    [TableName.GROUP_MSGS]: { type: 'has_many', foreignKey: 'conversation_id' },
  };

  @field('conversation_id') conversationId!: string;
  @field('room_name') roomName!: string;
  @field('room_code') roomCode!: string;
  @field('room_avatar') roomAvatar?: string;
  @field('room_type') roomType?: string;
  @field('group_type') groupType?: string;
  @field('member_limit') memberLimit?: number;
  @field('description') description?: string;
  @field('unread_num') unreadNum?: number;
  @json('last_message', (source, model) => {
    return JSON.parse(JSON.stringify(source, null, 2)) as GroupMsg;
  })
  lastMessage?: GroupMsg | string; // 可能是 GroupMsg 实例，也可能是 JSON 字符串
  @date('last_message_created_at') lastMessageCreatedAt?: Date; // 用于排序和显示最后一条消息的时间
  @date('last_read_time') lastReadTime?: Date;
  @date('last_load_time') lastLoadTime?: Date;
  @date('created_at') createdAt?: Date;
  @field('creator') creator?: string;
  @date('updated_at') updatedAt?: Date;
  @field('updater') updater?: string;

  @children(TableName.GROUP_MSGS) messages!: Query<GroupMsg>;

  @writer async clearUnread() {
    await this.update((record) => {
      record.unreadNum = 0;
      record.lastReadTime = new Date();
      record.lastLoadTime = new Date();
    });
  }

  @writer async updateConversation(data: Partial<GroupConversation>) {
    await this.update((record) => {
      record = { ...record, ...data };
    });
  }

  @writer async updateLastMessage(message: GroupMsg, unreadNum = 0) {
    console.log('updateLastMessage:', message);
    await this.update((record) => {
      record.lastMessage = message;
      record.lastMessageCreatedAt = message.createdAt;
      record.lastLoadTime = new Date();
      record.unreadNum = (record.unreadNum || 0) + unreadNum;
    });
  }

  @writer async deletedConversation() {
    await this.destroyPermanently(); //永久删除
  }

  // 获取最新一条消息
  async fetchLatestMessage(): Promise<GroupMsg | undefined> {
    return await this.messages
      .extend(Q.sortBy('created_at', Q.desc), Q.take(1))
      .fetch()
      .then((list) => list[0]);
  }

  toJSON() {
    return {
      conversationId: this.conversationId,
      roomName: this.roomName,
      roomCode: this.roomCode,
      roomAvatar: this.roomAvatar,
      roomType: this.roomType,
      groupType: this.groupType,
      memberLimit: this.memberLimit,
      description: this.description,
      unreadNum: this.unreadNum,
      lastMessage: this.lastMessage,
      lastMessageCreatedAt: this.lastMessageCreatedAt,
      lastReadTime: this.lastReadTime,
      lastLoadTime: this.lastLoadTime,
      createdAt: this.createdAt,
      creator: this.creator,
      updatedAt: this.updatedAt,
      updater: this.updater,
      messages: this.messages,
    };
  }
}
