CREATE TABLE IF NOT EXISTS `t_post_blocked`
(
    `id`        INT      NOT NULL AUTO_INCREMENT COMMENT '用户屏蔽帖子标记表',
    `postId`    INT      NOT NULL COMMENT '屏蔽的帖子id',
    `creator`   BIGINT   NOT NULL COMMENT '创建者',
    `createdAt` DATETIME NOT NULL DEFAULT NOW() COMMENT '创建时间',
    PRIMARY KEY (`id`)
) ENGINE=INNODB;