ALTER TABLE `category`
    ADD COLUMN `cover` VARCHAR(255) DEFAULT NULL COMMENT '封面' AFTER `categoryName`;