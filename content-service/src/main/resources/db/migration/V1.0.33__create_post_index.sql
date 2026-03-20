CREATE TABLE `t_post_index`
(
    id            INT AUTO_INCREMENT PRIMARY KEY,                -- 主键
    `postId`      INT not null  ,                                  -- 帖子ID
    `summary`     VARCHAR(500) default NULL,                                           -- 帖子的摘要
    `keywords`    VARCHAR(255) default NULL,                                           -- 关键词，多个用逗号隔开
    `threadIndex` INT       DEFAULT 0,                                             -- thread 数组的索引，默认为0
    `createdAt`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,                             -- 创建时间
    `updatedAt`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 更新时间
    `dataVersion` INT       DEFAULT 0,                                             -- 数据版本号
    `deleted`     BOOLEAN   DEFAULT FALSE                                         -- 是否删除的标识
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
