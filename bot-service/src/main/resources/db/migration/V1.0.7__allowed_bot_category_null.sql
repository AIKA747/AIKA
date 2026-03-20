ALTER TABLE `bot`
    CHANGE `categoryId` `categoryId` BIGINT NULL COMMENT '分类（栏目）id',
    CHANGE `categoryName` `categoryName` VARCHAR(255) CHARSET utf8mb4 NULL COMMENT '分类（栏目）名称';
ALTER TABLE `bot_temp`
    CHANGE `categoryId` `categoryId` BIGINT NULL COMMENT '分类（栏目）id',
    CHANGE `categoryName` `categoryName` VARCHAR(255) CHARSET utf8mb4 NULL COMMENT '分类（栏目）名称';
