ALTER TABLE `t_author`
    ADD COLUMN `deleted` TINYINT DEFAULT 0 NULL COMMENT '是否删除' AFTER `updatedAt`;