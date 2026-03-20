CREATE TABLE IF NOT EXISTS `bot`
(
    `id`                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `botSource`           VARCHAR(255) NOT NULL COMMENT 'builtIn，userCreated',
    `botName`             VARCHAR(255) NOT NULL COMMENT '机器人名称',
    `botIntroduce`        VARCHAR(255) NOT NULL COMMENT '机器人介绍',
    `avatar`              VARCHAR(255) NOT NULL COMMENT '头像',
    `gender`              VARCHAR(255) NOT NULL COMMENT '性别：MALE,FEMALE',
    `age`                 INT          NOT NULL COMMENT '年龄',
    `categoryId`          BIGINT       NOT NULL COMMENT '分类（栏目）id',
    `categoryName`        VARCHAR(255) NOT NULL COMMENT '分类（栏目）名称',
    `profession`          VARCHAR(255) NOT NULL COMMENT '职业',
    `personality`         VARCHAR(255)          DEFAULT NULL COMMENT '个性',
    `botCharacter`        VARCHAR(255) NOT NULL COMMENT '机器人扮演的角色',
    `personalStrength`    VARCHAR(255) NOT NULL COMMENT '擅长领域',
    `conversationStyle`   VARCHAR(255) NOT NULL COMMENT '回答风格',
    `rules`               JSON                  DEFAULT NULL COMMENT '回答策略集合',
    `prompts`             VARCHAR(255)          DEFAULT NULL,
    `knowledgeEnable`     TINYINT               DEFAULT '0' COMMENT '0关闭，1开启',
    `knowledges`          JSON                  DEFAULT NULL COMMENT '学习文件路径集合',
    `supportedModels`     JSON                  DEFAULT NULL COMMENT '支持模型，多个使用逗号分隔：Midjourney，DigitaHumanService',
    `album`               VARCHAR(255)          DEFAULT NULL COMMENT '相册：多个使用逗号分隔',
    `botStatus`           VARCHAR(255) NOT NULL COMMENT '机器人状态：unrelease,online,offline',
    `visibled`            TINYINT               DEFAULT '0' COMMENT '是否公开机器人',
    `rating` DOUBLE NOT NULL DEFAULT '0' COMMENT '评分',
    `chatTotal`           INT          NOT NULL DEFAULT '0' COMMENT '聊天数',
    `subscriberTotal`     INT          NOT NULL DEFAULT '0' COMMENT '订阅数量',
    `dialogues`           INT          NOT NULL DEFAULT '0' COMMENT '对话数',
    `recommend`           TINYINT      NOT NULL DEFAULT '0' COMMENT '是否推荐',
    `sortNo`              INT                   DEFAULT NULL COMMENT '推荐排序',
    `recommendImage`      VARCHAR(255)          DEFAULT NULL COMMENT '推荐封面',
    `recommendWords`      VARCHAR(255)          DEFAULT NULL COMMENT '推荐词',
    `recommendTime`       DATETIME              DEFAULT NULL COMMENT '推荐时间',
    `greetWords`          VARCHAR(255)          DEFAULT NULL COMMENT '欢迎语',
    `salutationPrompts`   VARCHAR(255)          DEFAULT NULL COMMENT '预留字段（许久没有聊天，机器人主动打招呼prompt）',
    `salutationFrequency` INT                   DEFAULT NULL COMMENT '打招呼的频率（单位：天）；距离最后一次会话消息多长时间机器人主动给用户发送消息打招呼',
    `createdAt`           DATETIME     NOT NULL COMMENT '创建时间',
    `creator`             VARCHAR(255)          DEFAULT NULL COMMENT '创建人id',
    `creatorName`         VARCHAR(255)          DEFAULT NULL COMMENT '创建人名称',
    `updatedAt`           DATETIME     NOT NULL COMMENT '更新时间',
    `updater`             VARCHAR(255)          DEFAULT NULL COMMENT '更新人',
    `dataVersion`         INT                   DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted`             TINYINT      NOT NULL DEFAULT '0' COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4  COMMENT='机器人';

CREATE TABLE IF NOT EXISTS `bot_rate`
(
    `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `userId`      BIGINT       NOT NULL COMMENT '用户id',
    `username`    VARCHAR(255) NOT NULL COMMENT '用户姓名',
    `botId`       BIGINT       NOT NULL COMMENT '被评价机器人id',
    `rating` DOUBLE NOT NULL COMMENT '评分',
    `content`     VARCHAR(255) NOT NULL COMMENT '评价内容',
    `commentAt`   DATETIME     NOT NULL,
    `createdAt`   DATETIME     NOT NULL COMMENT '创建时间',
    `creator`     VARCHAR(255)          DEFAULT NULL COMMENT '创建人id',
    `creatorName` VARCHAR(255)          DEFAULT NULL COMMENT '创建人名称',
    `updatedAt`   DATETIME     NOT NULL COMMENT '更新时间',
    `updater`     VARCHAR(255)          DEFAULT NULL COMMENT '更新人',
    `dataVersion` INT                   DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted`     TINYINT      NOT NULL DEFAULT '0' COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4  COMMENT='机器人打分';

CREATE TABLE IF NOT EXISTS `bot_subscription`
(
    `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `userId`         BIGINT   NOT NULL COMMENT '用户id',
    `botId`          BIGINT   NOT NULL COMMENT '机器人id',
    `lastReadAt`     DATETIME DEFAULT NULL COMMENT '最后一次读取时间',
    `subscriptionAt` DATETIME NOT NULL COMMENT '订阅时间',
    PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4  COMMENT='机器人订阅';

CREATE TABLE IF NOT EXISTS `bot_temp`
(
    `id`                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `botId`               BIGINT       NOT NULL COMMENT '机器人id',
    `publishTime`         DATETIME              DEFAULT NULL COMMENT '发布时间',
    `botSource`           VARCHAR(255) NOT NULL COMMENT 'builtIn，userCreated',
    `botName`             VARCHAR(255) NOT NULL COMMENT '机器人名称',
    `botIntroduce`        VARCHAR(255) NOT NULL COMMENT '机器人介绍',
    `avatar`              VARCHAR(255) NOT NULL COMMENT '头像',
    `gender`              VARCHAR(255) NOT NULL COMMENT '性别：MALE,FEMALE',
    `age`                 INT          NOT NULL COMMENT '年龄',
    `categoryId`          BIGINT       NOT NULL COMMENT '分类（栏目）id',
    `categoryName`        VARCHAR(255) NOT NULL COMMENT '分类（栏目）名称',
    `profession`          VARCHAR(255) NOT NULL COMMENT '职业',
    `personality`         VARCHAR(255)          DEFAULT NULL COMMENT '个性',
    `botCharacter`        VARCHAR(255) NOT NULL COMMENT '机器人扮演的角色',
    `personalStrength`    VARCHAR(255) NOT NULL COMMENT '擅长领域',
    `conversationStyle`   VARCHAR(255) NOT NULL COMMENT '回答风格',
    `rules`               JSON                  DEFAULT NULL COMMENT '回答策略集合',
    `prompts`             VARCHAR(255)          DEFAULT NULL,
    `knowledgeEnable`     TINYINT               DEFAULT '0' COMMENT '0关闭，1开启',
    `knowledges`          JSON                  DEFAULT NULL COMMENT '学习文件路径集合',
    `supportedModels`     JSON                  DEFAULT NULL COMMENT '支持模型，多个使用逗号分隔：Midjourney，DigitaHumanService',
    `album`               VARCHAR(255)          DEFAULT NULL COMMENT '相册：多个使用逗号分隔',
    `botStatus`           VARCHAR(255) NOT NULL COMMENT '机器人状态：unrelease,online,offline',
    `visibled`            TINYINT               DEFAULT '0' COMMENT '是否公开机器人',
    `rating` DOUBLE NOT NULL DEFAULT '0' COMMENT '评分',
    `chatTotal`           INT          NOT NULL DEFAULT '0' COMMENT '聊天数',
    `subscriberTotal`     INT          NOT NULL DEFAULT '0' COMMENT '订阅数量',
    `dialogues`           INT          NOT NULL DEFAULT '0' COMMENT '对话数',
    `recommend`           TINYINT      NOT NULL DEFAULT '0' COMMENT '是否推荐',
    `sortNo`              INT                   DEFAULT NULL COMMENT '推荐排序',
    `recommendImage`      VARCHAR(255)          DEFAULT NULL COMMENT '推荐封面',
    `recommendWords`      VARCHAR(255)          DEFAULT NULL COMMENT '推荐词',
    `recommendTime`       DATETIME              DEFAULT NULL COMMENT '推荐时间',
    `greetWords`          VARCHAR(255)          DEFAULT NULL COMMENT '欢迎语',
    `salutationPrompts`   VARCHAR(255)          DEFAULT NULL COMMENT '预留字段（许久没有聊天，机器人主动打招呼prompt）',
    `salutationFrequency` INT                   DEFAULT NULL COMMENT '打招呼的频率（单位：天）；距离最后一次会话消息多长时间机器人主动给用户发送消息打招呼',
    `createdAt`           DATETIME     NOT NULL COMMENT '创建时间',
    `creator`             VARCHAR(255)          DEFAULT NULL COMMENT '创建人id',
    `creatorName`         VARCHAR(255)          DEFAULT NULL COMMENT '创建人名称',
    `updatedAt`           DATETIME     NOT NULL COMMENT '更新时间',
    `updater`             VARCHAR(255)          DEFAULT NULL COMMENT '更新人',
    `dataVersion`         INT                   DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted`             TINYINT      NOT NULL DEFAULT '0' COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4  COMMENT='机器人表';

CREATE TABLE IF NOT EXISTS `category`
(
    `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `categoryName` VARCHAR(255) NOT NULL COMMENT '栏目名称',
    `introduction` VARCHAR(255)          DEFAULT NULL,
    `sortNo`       INT          NOT NULL COMMENT '排序',
    `builtIn`      TINYINT               DEFAULT NULL COMMENT '是否内置分类：0否，1是',
    `botCount`     INT          NOT NULL COMMENT '机器人总数',
    `createdAt`    DATETIME     NOT NULL COMMENT '创建时间',
    `creator`      VARCHAR(255)          DEFAULT NULL COMMENT '创建人id',
    `creatorName`  VARCHAR(255)          DEFAULT NULL COMMENT '创建人名称',
    `updatedAt`    DATETIME     NOT NULL COMMENT '更新时间',
    `updater`      VARCHAR(255)          DEFAULT NULL COMMENT '更新人',
    `dataVersion`  INT                   DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted`      TINYINT      NOT NULL DEFAULT '0' COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4  COMMENT='栏目';

CREATE TABLE IF NOT EXISTS `dictionary`
(
    `id`       INT                                                           NOT NULL AUTO_INCREMENT,
    `dicType`  VARCHAR(20)                                                   NOT NULL COMMENT '字典类型',
    `dicValue` VARCHAR(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '字典值',
    `sortNo`   INT                                                           NOT NULL DEFAULT '0' COMMENT '排序',
    PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 ;

CREATE TABLE IF NOT EXISTS `digital_human_profile` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `profileType` ENUM('bot','assistant') CHARACTER SET utf8mb4 NOT NULL DEFAULT 'bot' COMMENT '数字人配置类型：bot、assistant',
    `objectId` BIGINT NOT NULL COMMENT '绑定的对象id',
    `sourceImage` VARCHAR(255) DEFAULT NULL COMMENT '数字人图片',
    `expression` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '表情neutral,happy,serious,surprise',
    `intensity` DOUBLE DEFAULT NULL COMMENT '强度',
    `language` JSON DEFAULT NULL COMMENT '支持的语言',
    `idleVideo` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '空闲时待机视频',
    `idleVideoId` BIGINT DEFAULT NULL COMMENT '空闲视频id',
    `greetVideo` VARCHAR(255) DEFAULT NULL COMMENT '生成的欢迎视频',
    `greetVideoId` BIGINT DEFAULT NULL COMMENT '欢迎视频id',
    PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COMMENT='数字人配置';

CREATE TABLE IF NOT EXISTS `digital_human_video_record` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `profileId` BIGINT NOT NULL COMMENT '配置id',
    `videoUrl` VARCHAR(255) NOT NULL COMMENT '视频链接',
    `type` VARCHAR(255) NOT NULL COMMENT '视频类型：talk，animations',
    PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COMMENT='数字人视频生成记录';

CREATE TABLE IF NOT EXISTS `message_record`
(
    `id`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `botId`             BIGINT       NOT NULL COMMENT '机器人id',
    `userId`            BIGINT       NOT NULL COMMENT '用户id',
    `contentType`       VARCHAR(255) NOT NULL COMMENT 'TEXT，VOICE，IMAGE，VIDEO',
    `textContent`       VARCHAR(255) NOT NULL COMMENT '文本内容',
    `media`             VARCHAR(255) NOT NULL COMMENT '多媒体（oss文件链接）',
    `fileProperty`      JSON                  DEFAULT NULL,
    `sourceType`        VARCHAR(255) NOT NULL COMMENT '来源类型：user，bot',
    `userMessageStatus` TINYINT      NOT NULL COMMENT '用户消息状态：0未处理，1处理中，2已回复',
    `readFlag`          TINYINT      NOT NULL COMMENT '已读标记：0未读，1已读',
    `readTime`          DATETIME              DEFAULT NULL COMMENT '读取消息时间',
    `replyMessageId`    BIGINT                DEFAULT NULL COMMENT '机器人回复消息id',
    `createdAt`         DATETIME     NOT NULL COMMENT '创建时间',
    `creator`           VARCHAR(255)          DEFAULT NULL COMMENT '创建人id',
    `creatorName`       VARCHAR(255)          DEFAULT NULL COMMENT '创建人名称',
    `updatedAt`         DATETIME     NOT NULL COMMENT '更新时间',
    `updater`           VARCHAR(255)          DEFAULT NULL COMMENT '更新人',
    `dataVersion`       INT                   DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted`           TINYINT      NOT NULL DEFAULT '0' COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4  COMMENT='消息记录';

CREATE TABLE IF NOT EXISTS `tts_voice`
(
    `locale`    VARCHAR(255) NOT NULL,
    `language`  VARCHAR(255) NOT NULL COMMENT '语言',
    `sounds`    VARCHAR(255) NOT NULL,
    `voiceName` VARCHAR(255) NOT NULL COMMENT '说话人物',
    `gender`    VARCHAR(255) NOT NULL COMMENT '性别',
    PRIMARY KEY (`voiceName`),
    UNIQUE KEY `voiceName` (`voiceName`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4  COMMENT='语言配置';
