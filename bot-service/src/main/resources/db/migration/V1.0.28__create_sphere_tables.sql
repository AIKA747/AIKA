CREATE TABLE IF NOT EXISTS `bot_collection`
(
    `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `createdAt` DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updatedAt`  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `dataVersion`  INT          NOT NULL COMMENT '数据版本，每更新一次+1',
    `deleted`      TINYINT      NOT NULL DEFAULT 0 COMMENT '是否删除：0否，1是',
    `updater`      BIGINT UNSIGNED      DEFAULT NULL COMMENT '更新人',
    `creator`      BIGINT UNSIGNED      DEFAULT NULL COMMENT '创建人id。管理员。',
    `type`         VARCHAR(255) NOT NULL COMMENT '集合类型：TALES、EXPERT、GAME',
    `avatar`       VARCHAR(255) NOT NULL COMMENT '图标',
    `collectionName` VARCHAR(255) NOT NULL COMMENT '名称',
    `category`     BIGINT  DEFAULT NULL COMMENT '分类',
    PRIMARY KEY (`id`)
    ) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COMMENT='Bot Collection Table';

CREATE TABLE IF NOT EXISTS `bot_collection_item`
(
    `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `createdAt` DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updatedAt`  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `dataVersion`   INT          NOT NULL COMMENT '数据版本，每更新一次+1',
    `deleted`       TINYINT      NOT NULL DEFAULT '0' COMMENT '是否删除：0否，1是',
    `updater`       BIGINT       DEFAULT NULL COMMENT '更新人',
    `creator`       BIGINT       DEFAULT NULL COMMENT '创建人id',
    `botId`         BIGINT       NOT NULL COMMENT '机器人id',
    `type`          VARCHAR(32)  NOT NULL COMMENT '机器人类型：TALES、EXPERT、GAME',
    `collectionId`  BIGINT       NOT NULL COMMENT '集合id',
    `avatar`        VARCHAR(255) DEFAULT NULL COMMENT '图标',
    `name`          VARCHAR(255) NOT NULL COMMENT '机器人名称',
    `description`   TEXT         NOT NULL COMMENT '描述',
    `listCover`     VARCHAR(255) NOT NULL COMMENT '列表封面',
    PRIMARY KEY (`id`)
    ) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COMMENT='机器人集合项';

CREATE TABLE IF NOT EXISTS `game`
(
    `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `instructions` TEXT         NOT NULL COMMENT '指南',
    `gameName`     VARCHAR(255) NOT NULL COMMENT '游戏名称',
    `assistantName` VARCHAR(255) NOT NULL COMMENT 'AI角色',
    `tools`        VARCHAR(255) DEFAULT NULL COMMENT '使用工具',
    `model`        VARCHAR(255) DEFAULT NULL COMMENT '使用的模型',
    `assistantId`  VARCHAR(255) DEFAULT NULL COMMENT 'assistantId',
    `introduce`    TEXT         NOT NULL COMMENT '游戏介绍',
    `description`  TEXT         NOT NULL COMMENT '列表封面的描述',
    `questions`    JSON         NOT NULL COMMENT '问题（JSON格式数组）',
    `cover`        VARCHAR(255) NOT NULL COMMENT '封面URL',
    `listCover`    VARCHAR(255) NOT NULL COMMENT '列表封面URL',
    `avatar`       VARCHAR(255) NOT NULL COMMENT '头像图片URL',
    `knowledge`    JSON         NOT NULL COMMENT '知识文档URL（JSON格式数组）',
    `listDesc`     TEXT         NOT NULL COMMENT '列表描述文字',
    `enable`       TINYINT      NOT NULL DEFAULT '0' COMMENT '上线/下线标志',
    `createdAt` DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updatedAt`  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `creator`      BIGINT       DEFAULT NULL COMMENT '创建人id',
    `creatorName`  VARCHAR(255) DEFAULT NULL COMMENT '创建人名称',
    `updater`      BIGINT       DEFAULT NULL COMMENT '更新人',
    `dataVersion`  INT          DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted`      TINYINT      NOT NULL DEFAULT '0' COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
    ) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COMMENT='游戏';

CREATE TABLE IF NOT EXISTS `game_result`
(
    `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `gameId`       BIGINT UNSIGNED NOT NULL COMMENT '游戏ID',
    `summary`      TEXT         NOT NULL COMMENT '摘要',
    `description`  TEXT         NOT NULL COMMENT '描述（建议使用markdown语法）',
    `cover`        VARCHAR(255) NOT NULL COMMENT '图片URL',
    `deleted`      TINYINT      NOT NULL DEFAULT '0' COMMENT '是否删除：0否，1是',
    `createdAt`    DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updatedAt`    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `dataVersion`  INT          NOT NULL COMMENT '数据版本，每更新一次+1',
    `updater`      BIGINT UNSIGNED DEFAULT NULL COMMENT '更新人',
    `creator`      BIGINT UNSIGNED DEFAULT NULL COMMENT '创建人id。管理员。',
    PRIMARY KEY (`id`)
    ) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COMMENT='游戏结果表';

CREATE TABLE IF NOT EXISTS `game_thread`
(
    `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `gameId`       BIGINT UNSIGNED NOT NULL COMMENT '游戏ID',
    `status`       VARCHAR(50) NOT NULL COMMENT '游戏状态（COMPLETE 或 UNCOMPLETED）',
    `result`       BIGINT UNSIGNED NOT NULL COMMENT '结果ID，关联游戏结果',
    `threadId`     VARCHAR(255) DEFAULT NULL COMMENT 'chatgpt 的 thread id',
    `createdAt`    DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updatedAt`    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `dataVersion`  INT          NOT NULL COMMENT '数据版本，每更新一次+1',
    `deleted`      TINYINT      NOT NULL DEFAULT '0' COMMENT '是否删除：0否，1是',
    `updater`      BIGINT UNSIGNED DEFAULT NULL COMMENT '更新人',
    `creator`      BIGINT UNSIGNED DEFAULT NULL COMMENT '创建人id。管理员。',
    PRIMARY KEY (`id`)
    ) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COMMENT='游戏线程表';


