CREATE TABLE IF NOT EXISTS `t_story_chat_log` (
    `id` BIGINT NOT NULL COMMENT '主键id',
    `storyRecorderId` BIGINT NOT NULL COMMENT '故事',
    `chapterId` BIGINT NOT NULL COMMENT '章节id',
    `speaker` VARCHAR(255) NOT NULL COMMENT '说话者：user,robot',
    `message` VARCHAR(255) NOT NULL COMMENT '说话内容',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `creator` INT NOT NULL COMMENT '创建人id',
    PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COMMENT='故事聊天记录表';