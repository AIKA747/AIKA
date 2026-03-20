ALTER TABLE `t_story_recorder`
    ADD COLUMN `preview` TINYINT DEFAULT 0 NULL COMMENT '是否调试创建存档' AFTER `status`