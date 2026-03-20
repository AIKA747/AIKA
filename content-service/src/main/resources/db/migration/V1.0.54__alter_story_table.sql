ALTER TABLE `t_story`
    ADD COLUMN `processCover` VARCHAR(500) NULL COMMENT '进行中的故事封面' AFTER `categoryId`;