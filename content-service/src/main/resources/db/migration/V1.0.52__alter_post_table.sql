ALTER TABLE `t_post`
    CHANGE `summary` `summary` TEXT CHARSET utf8mb4 NOT NULL COMMENT '摘要';
ALTER TABLE `t_post_index`
    CHANGE `summary` `summary` TEXT CHARSET utf8mb4 NULL;
