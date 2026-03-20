CREATE TABLE IF NOT EXISTS `sensitive_file`
(
    `id`        INT          NOT NULL AUTO_INCREMENT COMMENT 'id',
    `fileUrl`   VARCHAR(500) NOT NULL COMMENT '文件',
    `score`     DOUBLE       NOT NULL COMMENT '分数',
    `creator`   BIGINT                DEFAULT NULL COMMENT '上传者',
    `ip`        VARCHAR(200)          DEFAULT NULL COMMENT '上传地址',
    `createdAt` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`)
) ENGINE = INNODB
  DEFAULT CHARSET = utf8mb4;

