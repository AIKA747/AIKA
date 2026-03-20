ALTER TABLE `user`
    CHANGE `country` `country` VARCHAR(10) CHARSET utf8mb4 NULL COMMENT '国家,ISO 3166-1国际标准代码',
    ADD COLUMN `language` VARCHAR(10) NULL COMMENT '语言,ISO 639-1国际标准代码' AFTER `country`