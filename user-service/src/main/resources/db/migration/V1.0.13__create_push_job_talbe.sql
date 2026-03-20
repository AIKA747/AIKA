CREATE TABLE IF NOT EXISTS `push_job`
(
    `id`          bigint       NOT NULL AUTO_INCREMENT COMMENT '推送任务配置表',
    `name`        varchar(255)          DEFAULT NULL COMMENT '任务名称',
    `category`    varchar(255) CHARACTER SET utf8mb4 NOT NULL COMMENT '任务类型：instant实时推送,scheduledSingle单次定时推送,scheduledRecurring定时循环推送,eventTriggerInactive不活跃用户事件推送',
    `type`        varchar(255) CHARACTER SET utf8mb4 NOT NULL COMMENT 'job类型：realTime,cronJob，syncJob，inactiveCheckJob',
    `cron`        varchar(255) NOT NULL COMMENT 'cron表达式',
    `body` JSON NULL COMMENT '任务执行参数',
    `status`      varchar(20)           DEFAULT '1' COMMENT '状态：pending待执行或执行中，executed已执行',
    `excuted`     tinyint               DEFAULT '0' COMMENT '是否已执行过',
    `excutedAt`   datetime              DEFAULT NULL COMMENT '执行时间',
    `operator`    VARCHAR(255) NULL COMMENT '操作者名称',
    `createdAt`   datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `creator`     BIGINT       NULL COMMENT '创建者',
    `updatedAt`   datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
    `dataVersion` int                   DEFAULT '0' COMMENT '数据版本',
    `deleted`     tinyint      NOT NULL DEFAULT '0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `push_list`
    ADD COLUMN `jobId` BIGINT NULL COMMENT '推送任务id' AFTER `pushTime`;

ALTER TABLE `user`
    ADD COLUMN `lastActivedAt` DATETIME DEFAULT NOW() NOT NULL COMMENT '最后一次活动时间' AFTER `registerType`;