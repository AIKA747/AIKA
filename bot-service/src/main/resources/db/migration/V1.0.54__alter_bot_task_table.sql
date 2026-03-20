ALTER TABLE `user_bot_task`
    ADD COLUMN `executeLimit` INT NULL COMMENT '执行次数限制' AFTER `json`;

CREATE TABLE IF NOT EXISTS `user_bot_task_logs`
(
    `id`        INT NOT NULL AUTO_INCREMENT,
    `taskId`    INT NOT NULL COMMENT '任务id',
    `taskCron`   VARCHAR(20) COMMENT '任务执行时的cron频率',
    `excutedAt` DATETIME NOT NULL DEFAULT NOW() COMMENT '开始执行时间',
    `excutedEndAt` DATETIME NOT NULL DEFAULT NOW() COMMENT '结束执行时间',
    `executeTime` INT NOT NULL COMMENT '执行耗时，单位：ms',
    `success`   INT NOT NULL DEFAULT 0 COMMENT '是否执行成功：1成功，0失败',
    `failMsg`   VARCHAR(500) COMMENT '失败信息',
    PRIMARY KEY (`id`)
);
