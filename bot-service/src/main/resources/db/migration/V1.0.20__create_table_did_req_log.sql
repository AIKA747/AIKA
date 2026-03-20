CREATE TABLE IF NOT EXISTS `did_req_log`
(
    `id`         bigint       NOT NULL COMMENT '主键',
    `url`        varchar(200) NOT NULL COMMENT '请求链接',
    `method`     varchar(100) NOT NULL COMMENT '请求方式：post,get,put....',
    `reqParams`  text         NOT NULL COMMENT '发起请求参数',
    `respResult` text         NOT NULL COMMENT '响应结果',
    `times`      int          NOT NULL COMMENT '请求耗时，单位:毫秒',
    `createdAt`  datetime     NOT NULL COMMENT '创建时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;