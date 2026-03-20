CREATE TABLE IF NOT EXISTS `t_translate_map_resource`
(
    `id`        int          NOT NULL AUTO_INCREMENT,
    `uuid`      varchar(50)  NOT NULL COMMENT '语言对象唯一标识，标识相同表示同一个语义',
    `content`   varchar(500) NOT NULL COMMENT '文本内容',
    `language`  varchar(10)  NOT NULL COMMENT '语言编码',
    `sortNo`    int          NOT NULL DEFAULT '0' COMMENT '相同语言的文本值越大优先级越高',
    `createdAt` datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `deleted`   tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci