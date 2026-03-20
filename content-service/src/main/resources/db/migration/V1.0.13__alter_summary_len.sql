ALTER TABLE `t_story_chapter`
    CHANGE `summary` `summary` VARCHAR(1000) CHARSET utf8mb4 NULL COMMENT '摘要',
    CHANGE `dataVersion` `dataVersion` INT NULL;