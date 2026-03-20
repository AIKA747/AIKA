ALTER TABLE `resource`
    CHANGE `paths` `paths` TEXT CHARSET utf8mb4 NOT NULL COMMENT '功能点请求路径，多个路径使用逗号分隔';