import { Model } from '@nozbe/watermelondb';
import { date, field, writer } from '@nozbe/watermelondb/decorators';

import { TableName } from '@/database/schema';

export default class GroupMsgMedia extends Model {
  static table = TableName.GROUP_MSGS_MEDIA;

  @field('object_id') objectId!: string;
  @field('room_id') roomId!: string;
  @field('member_id') memberId!: string;
  @field('media_id') mediaId!: string;
  @field('media_type') mediaType!: string;
  @field('media_url') mediaUrl!: string;
  @date('created_at') createdAt!: Date;

  @writer async createGroupMsgMedia(params: GroupMsgMedia) {
    return await this.collections.get<GroupMsgMedia>(TableName.GROUP_MSGS_MEDIA).create((record) => {
      record.objectId = params.objectId;
      record.roomId = params.roomId;
      record.memberId = params.memberId;
      record.mediaId = params.mediaId;
      record.mediaType = params.mediaType;
      record.mediaUrl = params.mediaUrl;
      record.createdAt = params.createdAt;
      record.createdAt = new Date();
    });
  }

  toJSON() {
    return {
      objectId: this.objectId,
      roomId: this.roomId,
      memberId: this.memberId,
      mediaId: this.mediaId,
      mediaType: this.mediaType,
      mediaUrl: this.mediaUrl,
      createdAt: this.createdAt?.toISOString(),
    };
  }
}
