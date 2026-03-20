CREATE TABLE IF NOT EXISTS `push_list` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `title` VARCHAR(255) NOT NULL COMMENT '标题',
    `content` VARCHAR(255) NOT NULL COMMENT '内容',
    `pushTo` VARCHAR(255) NOT NULL COMMENT '多个分组使用逗号分隔（groupId），全部：all',
    `soundAlert` TINYINT NOT NULL COMMENT '是否声音提醒：0否，1是',
    `operator` VARCHAR(255) NOT NULL COMMENT '操作者',
    `received` INTEGER DEFAULT NULL COMMENT '接收到送达消息数',
    `pushTotal` INTEGER NOT NULL COMMENT '推送用户数',
    `pushTime` DATETIME NOT NULL COMMENT '推送时间',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    `updatedAt` DATETIME NOT NULL COMMENT '更新时间',
    `dataVersion` INT DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted` TINYINT NOT NULL COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='推送通知表';

CREATE TABLE IF NOT EXISTS `firebase_user_token` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `userId` BIGINT NOT NULL COMMENT '用户id',
    `token` VARCHAR(255) NOT NULL COMMENT 'firebase:token',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    `updatedAt` DATETIME NOT NULL COMMENT '更新时间',
    `dataVersion` INT DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted` TINYINT NOT NULL COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='firebase与用户token绑定表';

