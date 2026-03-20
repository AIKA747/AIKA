ALTER TABLE `t_post`
    ADD COLUMN `flagged` TINYINT NULL COMMENT '是否敏感' AFTER `blocked`,
    ADD COLUMN `categories` JSON NULL COMMENT '敏感标签' AFTER `flagged`;