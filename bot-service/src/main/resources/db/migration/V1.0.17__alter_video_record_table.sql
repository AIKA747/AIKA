ALTER TABLE `digital_human_video_record`
    ADD COLUMN `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '创建时间' AFTER `type`,
    ADD COLUMN `voiceName` VARCHAR(255) NULL COMMENT '音色' AFTER `createdAt`,
    ADD COLUMN `content` VARCHAR(1000) NULL COMMENT '文本内容' AFTER `voiceName`,
    ADD COLUMN `status` VARCHAR(255) NULL COMMENT '状态：created,done,fail' AFTER `content`,
    ADD COLUMN `language` VARCHAR(255) NULL COMMENT '语言' AFTER `status`,
    CHANGE `videoUrl` `videoUrl` VARCHAR(255) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '视频链接';

ALTER TABLE `digital_human_video_record`
    CHANGE `createdAt` `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '创建时间' AFTER `language`,
    ADD COLUMN `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '更新时间' AFTER `createdAt`;

