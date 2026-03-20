import { Model, Relation } from '@nozbe/watermelondb';
import { date, field, relation, writer } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';

import GroupConversation from '@/database/models/group_conversation';
import { TableName } from '@/database/schema';

export default class GroupMsg extends Model {
  static table = TableName.GROUP_MSGS;

  static associations: Associations = {
    [TableName.GROUP_CONVERSATION]: { type: 'belongs_to', key: 'conversation_id' },
  };

  @field('conversation_id') conversationId!: string;
  @field('msg_id') msgId!: string;
  @field('user_id') userId!: string;
  @field('avatar') avatar?: string;
  @field('nickname') nickname?: string;
  @field('user_type') userType?: string;
  @field('content_type') contentType?: string;
  @field('json') json?: string;
  @field('media') media?: string;
  @field('gender') gender?: string;
  @field('text_content') textContent?: string;
  @field('file_property') fileProperty?: string;
  @field('chapter_status') chapterStatus?: string;
  @field('chapter_process') chapterProcess?: string;
  @field('digit_human') digitHuman?: string;
  @field('msg_status') msgStatus?: string;
  @field('reply_message_id') replyMessageId?: string;
  @field('reply_message') replyMessage?: string;
  @field('forward_info') forwardInfo?: string;
  @field('source_type') sourceType?: string;
  @field('game_status') gameStatus?: string;
  @field('video_status') videoStatus?: string;
  @field('video_url') videoUrl?: string;
  @field('member_ids') memberIds?: string;
  @date('created_at') createdAt?: Date;
  @field('is_read') isRead?: boolean;

  // 关联 Conversation
  @relation(TableName.GROUP_CONVERSATION, 'conversation_id') conversation!: Relation<GroupConversation>;

  @writer async deleteMsg() {
    await this.destroyPermanently(); //真删除
  }

  toJSON() {
    return {
      conversationId: this.conversationId,
      userId: this.userId,
      avatar: this.avatar,
      nickname: this.nickname,
      userType: this.userType,
      contentType: this.contentType,
      json: this.json,
      media: this.media,
      gender: this.gender,
      textContent: this.textContent,
      fileProperty: this.fileProperty,
      msgId: this.msgId,
      chapterStatus: this.chapterStatus,
      chapterProcess: this.chapterProcess,
      digitHuman: this.digitHuman,
      msgStatus: this.msgStatus,
      replyMessageId: this.replyMessageId,
      replyMessage: this.replyMessage,
      memberIds: this.memberIds,
      sourceType: this.sourceType,
      gameStatus: this.gameStatus,
      videoStatus: this.videoStatus,
      forwardInfo: this.forwardInfo,
      isRead: this.isRead,
      videoUrl: this.videoUrl,
      createdAt: this.createdAt?.toISOString(),
    };
  }
}
