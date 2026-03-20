CREATE TABLE IF NOT EXISTS `notification` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '通知id',
    `type` VARCHAR(255) NOT NULL COMMENT '通知类型：点赞通知（thumb）、关注的用户发帖通知（post）、被@通知（at）',
    `userIds` JSON NOT NULL COMMENT '通知用户集合（使用逗号分隔）',
    `authorId` VARCHAR(255) NOT NULL COMMENT '作者用户id',
    `avatar` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '作者头像（点赞用户的）',
    `nickname` VARCHAR(255) NOT NULL COMMENT '作者昵称',
    `username` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '作者用户名',
    `cover` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '封面',
    `metadata` JSON NOT NULL COMMENT '附带的元数据',
    `readUserIds` JSON DEFAULT NULL COMMENT '已读用户集合',
    `groupById` VARCHAR(255) NOT NULL COMMENT '生成一个消息需要合并的标识，用于分组显示',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '通知创建时间',
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最后一次更新时间',
    `dataVersion` INT DEFAULT 0 NULL COMMENT '数据版本，每更新一次+1',
    PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户通知表';