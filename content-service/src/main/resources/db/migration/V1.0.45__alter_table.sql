ALTER TABLE `t_post`
    ADD COLUMN `blocked` TINYINT DEFAULT 0 NULL COMMENT '是否屏蔽' AFTER `thread`;

CREATE TABLE IF NOT EXISTS `t_sensitive_words`
(
    `id`        INT          NOT NULL AUTO_INCREMENT,
    `word`      VARCHAR(255) NOT NULL COMMENT '敏感词',
    `createdAt` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updatedAt` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`   TINYINT               DEFAULT '0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COMMENT='敏感词信息';