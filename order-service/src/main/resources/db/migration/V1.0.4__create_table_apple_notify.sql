CREATE TABLE `apple_notify`
(
    `id`        BIGINT   NOT NULL AUTO_INCREMENT COMMENT 'id',
    `body`      TEXT     NOT NULL COMMENT '通知内容',
    `status`    INT      NOT NULL DEFAULT 0 COMMENT '状态：0待处理，1已处理',
    `createdAt` DATETIME NOT NULL DEFAULT NOW() COMMENT '创建时间',
    `updatedAt` DATETIME          DEFAULT NOW() COMMENT '更新时间',
    PRIMARY KEY (`id`)
);