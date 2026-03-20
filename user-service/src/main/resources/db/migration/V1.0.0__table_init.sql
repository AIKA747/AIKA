CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT unsigned NOT NULL COMMENT '主键id' AUTO_INCREMENT,
    `username` VARCHAR(255) DEFAULT NULL COMMENT '用户昵称/姓名',
    `avatar` VARCHAR(255) DEFAULT NULL COMMENT '用户头像',
    `phone` VARCHAR(255) DEFAULT NULL COMMENT '手机号',
    `email` VARCHAR(255) NOT NULL COMMENT '邮箱',
    `password` VARCHAR(255) NOT NULL COMMENT '登录密码',
    `status` VARCHAR(255) NOT NULL COMMENT '状态：unverified，uncompleted，enabled，disabled',
    `gender` VARCHAR(255) DEFAULT NULL COMMENT '性别：MALE, HIDE, FEMALE',
    `bio` VARCHAR(255) DEFAULT NULL COMMENT '简介',
    `tags` JSON DEFAULT NULL COMMENT '标签',
    `country` VARCHAR(255) DEFAULT NULL COMMENT '国/州/市/区',
    `countryCode` VARCHAR(255) DEFAULT NULL COMMENT '国/州/市/区',
    `birthday` DATE DEFAULT NULL COMMENT '生日',
    `botTotal` INT(11) NOT NULL COMMENT '我的机器人数量',
    `subBotTotal` INT(11) NOT NULL COMMENT '订阅机器人数量',
    `storyTotal` INT(11) NOT NULL COMMENT '我的故事数量',
    `followerTotal` INT(11) NOT NULL COMMENT '我的粉丝数量',
    `notifyFlag` INT DEFAULT '0' COMMENT '系统通知1：0x001；关注用户创建机器人通知2：0x010；被订阅点赞关注通知4：0x100',
    `lastLoginAt` DATETIME DEFAULT NULL COMMENT '最后一次登录时间',
    `lastShareStoryAt` DATETIME DEFAULT NULL COMMENT '最后一次分享故事时间',
    `lastReleaseBotAt` DATETIME DEFAULT NULL COMMENT '最后一次发布机器人时间',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    `creator` VARCHAR(255) DEFAULT NULL COMMENT '创建人',
    `updatedAt` DATETIME NOT NULL COMMENT '更新时间',
    `updater` VARCHAR(255) DEFAULT NULL COMMENT '更新人',
    `dataVersion` INT(11) DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted` TINYINT NOT NULL COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COMMENT='app用户表';


CREATE TABLE IF NOT EXISTS `group` (
    `id` BIGINT unsigned NOT NULL COMMENT '主键id' AUTO_INCREMENT,
    `groupName` VARCHAR(255) NOT NULL COMMENT '用户组名',
    `userCount` INT(11) NOT NULL COMMENT '用户数',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    `creator` VARCHAR(255) DEFAULT NULL COMMENT '创建人',
    `updatedAt` DATETIME NOT NULL COMMENT '更新时间',
    `updater` VARCHAR(255) DEFAULT NULL COMMENT '更新人',
    `dataVersion` INTEGER NOT NULL COMMENT '数据版本，每更新一次+1',
    `deleted` TINYINT NOT NULL COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COMMENT='用户组信息表';

CREATE TABLE IF NOT EXISTS `user_group_rel` (
    `groupId` BIGINT NOT NULL COMMENT '用户组id',
    `userId` BIGINT NOT NULL COMMENT '用户id'
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COMMENT='用户组与用户关联表';


CREATE TABLE IF NOT EXISTS `follower` (
    `id` BIGINT unsigned NOT NULL COMMENT '主键id' AUTO_INCREMENT,
    `userId` BIGINT NOT NULL COMMENT '用户id',
    `followingId` BIGINT NOT NULL COMMENT '被关注用户id',
    `lastReadTime` DATETIME DEFAULT NULL COMMENT '最后一次读取时间',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    `creator` VARCHAR(255) DEFAULT NULL COMMENT '创建人',
    `updatedAt` DATETIME NOT NULL COMMENT '更新时间',
    `updater` VARCHAR(255) DEFAULT NULL COMMENT '更新人',
    `dataVersion` INTEGER NOT NULL COMMENT '数据版本，每更新一次+1',
    `deleted` TINYINT NOT NULL COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COMMENT='关注用户表';


CREATE TABLE IF NOT EXISTS `interest_tags` (
    `id` BIGINT unsigned NOT NULL COMMENT '主键id' AUTO_INCREMENT,
    `tagName` VARCHAR(255) NOT NULL COMMENT '标签名称',
    `sortNo` INTEGER NOT NULL COMMENT '标签排序',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    `creator` VARCHAR(255) DEFAULT NULL COMMENT '创建人',
    `updatedAt` DATETIME NOT NULL COMMENT '更新时间',
    `updater` VARCHAR(255) DEFAULT NULL COMMENT '更新人',
    `dataVersion` INTEGER NOT NULL COMMENT '数据版本，每更新一次+1',
    `deleted` TINYINT NOT NULL COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COMMENT='标签';


CREATE TABLE IF NOT EXISTS `third_platform` (
    `id` BIGINT unsigned NOT NULL COMMENT '主键id' AUTO_INCREMENT,
    `platform` VARCHAR(255) NOT NULL COMMENT 'google,wx,alipay',
    `platformId` VARCHAR(255) NOT NULL COMMENT '第三方平台唯一标识',
    `userId` BIGINT NOT NULL COMMENT '用户id',
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签';