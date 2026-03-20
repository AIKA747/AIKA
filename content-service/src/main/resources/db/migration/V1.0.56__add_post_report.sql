CREATE TABLE `t_post_report`
(
    `id`          int          NOT NULL AUTO_INCREMENT,
    `title`       varchar(255) NOT NULL COMMENT '标题',
    `description` text         NOT NULL COMMENT '描述',
    `sortNo`      int      DEFAULT '0' COMMENT '排序',
    `createdAt`   datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updatedAt`   datetime DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`     tinyint  DEFAULT '0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `t_post_report_author`
(
    `id`        int    NOT NULL AUTO_INCREMENT,
    `reportId`  int    NOT NULL COMMENT '举报id',
    `postId`    int    NOT NULL COMMENT '贴子id',
    `author`    bigint NOT NULL COMMENT '作者id',
    `createdAt` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
