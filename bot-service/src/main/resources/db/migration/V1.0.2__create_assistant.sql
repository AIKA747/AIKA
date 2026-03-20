CREATE TABLE IF NOT EXISTS `assistant` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `maleAvatar` VARCHAR(255) NOT NULL COMMENT '助手男性头像',
    `femaleAvatar` VARCHAR(255) NOT NULL COMMENT '助手女性头像',
    `greetWords` VARCHAR(255) NOT NULL COMMENT '欢迎语',
    `age` INTEGER NOT NULL COMMENT '年龄',
    `profession` VARCHAR(255) NOT NULL COMMENT '职业',
    `botCharacter` VARCHAR(255) NOT NULL COMMENT '机器人扮演的角色',
    `personalStrength` VARCHAR(255) NOT NULL COMMENT '擅长领域',
    `answerStrategy` VARCHAR(255) NOT NULL COMMENT '回答策略',
    `botRecommendStrategy` VARCHAR(255) NOT NULL COMMENT '机器人推荐策略',
    `storyRecommendStrategy` VARCHAR(255) NOT NULL COMMENT '故事推荐策略',
    `rules` JSON DEFAULT NULL COMMENT '回答策略集合',
    `salutationPrompts` VARCHAR(255) DEFAULT NULL COMMENT '预留字段（许久没有聊天，机器人主动打招呼prompt）',
    `salutationFrequency` INTEGER DEFAULT NULL COMMENT '打招呼的频率（单位：天）；距离最后一次会话消息多长时间机器人主动给用户发送消息打招呼',
    `prompts` VARCHAR(255) DEFAULT NULL,
    `digitaHumanService` JSON NOT NULL COMMENT '支持的数字人配置',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
    `dataVersion` INTEGER DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted` TINYINT NOT NULL DEFAULT '0' COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COMMENT='助手表';


CREATE TABLE IF NOT EXISTS `assistant_msg_record` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `role` VARCHAR(255) NOT NULL COMMENT 'user、assistant',
    `userId` BIGINT NOT NULL COMMENT '用户id',
    `assistantId` BIGINT NOT NULL COMMENT '助手id',
    `assistantGender` VARCHAR(255) NOT NULL COMMENT '助手性别',
    `type` VARCHAR(255) NOT NULL COMMENT '记录类型：text/botRecommend/storyRecommend',
    `content` JSON COMMENT '推荐内容，type=text则为回复的消息，若为推荐则为对于的json对象',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
    `dataVersion` INTEGER DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted` TINYINT NOT NULL DEFAULT '0' COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COMMENT='用户与助手的聊天记录';


CREATE TABLE IF NOT EXISTS `user_assistant` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `userId` BIGINT NOT NULL COMMENT '用户id',
    `assistantId` BIGINT NOT NULL COMMENT '助手id',
    `gender` VARCHAR(255) NOT NULL COMMENT '助手性别',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
    `dataVersion` INTEGER DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted` TINYINT NOT NULL DEFAULT '0' COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COMMENT='用户助手配置表';