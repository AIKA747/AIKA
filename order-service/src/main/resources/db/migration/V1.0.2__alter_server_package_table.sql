ALTER TABLE `service_package`
    CHANGE `cover` `cover` VARCHAR(255) CHARSET utf8mb4 NULL COMMENT '封面',
    CHANGE `description` `description` VARCHAR(255) CHARSET utf8mb4 NULL COMMENT '详情';
