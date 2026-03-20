ALTER TABLE `assistant_msg_record`
    CHANGE `type` `contentType` VARCHAR (255) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '记录类型：\' TEXT\',\'VOICE\',\'IMAGE\',\'VIDEO\',\'botRecommend\',\'storyRecommend\'',
    ADD COLUMN `json` JSON NULL COMMENT '若contentType=\'botRecommend\'或\'storyRecommend\'或\'gift\'，则保存到该json字段' AFTER `contentType`,
    CHANGE `role` `sourceType` VARCHAR(255) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'user、assistant',
    ADD COLUMN `media` VARCHAR(255) NULL COMMENT '多媒体（oss文件链接）' AFTER `json`,
    CHANGE `content` `textContent` VARCHAR(500) NULL COMMENT '文本内容' AFTER `media`,
    ADD COLUMN `userMessageStatus` TINYINT NULL COMMENT '用户消息状态：0未处理，1处理中，2已回复' AFTER `textContent`,
    ADD COLUMN `readFlag` TINYINT DEFAULT 0 NULL COMMENT '已读标记：0未读，1已读' AFTER `userMessageStatus`,
    ADD COLUMN `readTime` DATETIME NULL COMMENT '读取消息时间' AFTER `readFlag`,
    ADD COLUMN `replyMessageId` BIGINT NULL COMMENT '回复消息id' AFTER `readTime`,
    ADD COLUMN `creator` BIGINT NULL COMMENT '创建人id' AFTER `replyMessageId`,
    ADD COLUMN `creatorName` VARCHAR(255) NULL COMMENT '创建人名称' AFTER `creator`,
    ADD COLUMN `fileProperty` JSON NULL COMMENT '文件信息' AFTER `replyMessageId`;