ALTER TABLE `t_author`
    ADD COLUMN `bio` VARCHAR(500) NULL COMMENT '作者简介' AFTER `popUpdatedAt`;