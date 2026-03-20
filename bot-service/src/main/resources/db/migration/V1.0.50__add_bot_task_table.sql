CREATE TABLE IF NOT EXISTS `user_bot_task` (
     `id` int NOT NULL AUTO_INCREMENT,
     `type` varchar(255) NOT NULL COMMENT '任务类型：REMINDER，WEBSEARCH',
     `name` varchar(255) NOT NULL COMMENT '任务名称',
     `introduction` varchar(500) CHARACTER SET utf8mb4 NOT NULL COMMENT '任务简介',
     `cron` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '任务执行频次',
     `lastExcetedAt` datetime DEFAULT NULL COMMENT '最后一次执行任务的时间',
     `creater` bigint NOT NULL COMMENT '创建者',
     `botId` bigint NOT NULL COMMENT '机器人id',
     `status` varchar(255) NOT NULL COMMENT '任务状态：\n待确认 → PENDING\n启用 → ENABLED\n停用 → DISABLED',
     `prompt` varchar(255) DEFAULT NULL COMMENT '用于调用openai执行任务的提示语',
     `json` json DEFAULT NULL COMMENT '辅助前端做频率参数设置的参数，后端不做使用，前端自行解析',
     `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
     `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
     `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除',
     PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='机器人任务信息表';


ALTER TABLE `message_record`
    ADD COLUMN `json` TEXT NULL COMMENT 'json对象' AFTER `replyMessageId`;
