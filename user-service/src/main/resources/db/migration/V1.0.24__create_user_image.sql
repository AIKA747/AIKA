CREATE TABLE IF NOT EXISTS `user_image` (
    `id` BIGINT unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `userId` BIGINT NOT NULL COMMENT '用户id',
    `type` VARCHAR(20) NOT NULL COMMENT '图片类型:IMAGE,AVATAR',
    `imageUrl` VARCHAR(255) NOT NULL COMMENT '图片地址',
    `remark` VARCHAR(255) DEFAULT NULL COMMENT '备注',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    `updatedAt` DATETIME NOT NULL COMMENT '更新时间',
    `dataVersion` INT DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户图片表'; 