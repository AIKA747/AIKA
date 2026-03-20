CREATE TABLE IF NOT EXISTS `t_user`
(
    `id`        bigint          NOT NULL COMMENT '用户id',
    `avatar`    varchar(200)    DEFAULT NULL COMMENT '用户头像',
    `username`  varchar(100)    NOT NULL COMMENT '用户名',
    `nickname`  varchar(100)    DEFAULT NULL COMMENT '用户昵称',
    `status`    varchar(100)    DEFAULT NULL COMMENT '用户状态',
    `bio`       text            COMMENT '用户简介',
    `gender`    varchar(100)    DEFAULT NULL COMMENT '性别：MALE, HIDE, FEMALE',
    `createdAt` datetime        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updatedAt` datetime        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;