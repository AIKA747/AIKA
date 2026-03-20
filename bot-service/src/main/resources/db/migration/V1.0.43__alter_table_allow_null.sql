ALTER TABLE `t_chatroom_member`
    CHANGE `avatar` `avatar` VARCHAR(500) CHARSET utf8mb4 NULL COMMENT '成员头像',
    CHANGE `nickname` `nickname` VARCHAR(255) CHARSET utf8mb4 NULL COMMENT '显示的名字',
    CHANGE `notifyTurnOffTime` `notifyTurnOffTime` DATETIME NULL COMMENT '通知关闭截止时间',
    CHANGE `theme` `theme` JSON NULL COMMENT '主题',
    CHANGE `lastReadTime` `lastReadTime` DATETIME NULL COMMENT '最近一次读取消息时间，消息时间大于该时间的消息都是未读消息',
    CHANGE `updatedAt` `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '更新时间',
    CHANGE `updater` `updater` BIGINT NULL COMMENT '更新人',
    CHANGE `dataVersion` `dataVersion` INT DEFAULT 0 NOT NULL COMMENT '数据版本，每更新一次+1';

ALTER TABLE `t_group_chat_records`
    CHANGE `avatar` `avatar` VARCHAR(255) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '头像',
    CHANGE `nn` `nn` VARCHAR(255) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '用户昵称或机器人昵称',
    CHANGE `txt` `txt` VARCHAR(255) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '文本内容',
    CHANGE `med` `med` VARCHAR(255) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '多媒体（oss文件链接）',
    CHANGE `flength` `flength` VARCHAR(255) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '时长，单位：秒',
    CHANGE `fn` `fn` VARCHAR(255) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '文件名称',
    CHANGE `time` `time` DATETIME DEFAULT NOW() NOT NULL COMMENT '创建时间';
ALTER TABLE `t_group_chat_records`
    CHANGE `txt` `txt` TEXT CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '文本内容',
    CHANGE `rid` `rid` BIGINT NULL COMMENT '回复消息id',
    ADD COLUMN `rmessage` TEXT NULL COMMENT '回复消息内容' AFTER `rid`;
