ALTER TABLE `t_story_recorder`
    CHANGE `storyProcess` `storyProcess` DECIMAL (9,8) NULL COMMENT '故事进度',
    ADD COLUMN `chapterProcess` DECIMAL (9,8) NULL COMMENT '当前章节进度' AFTER `storyProcess`;

ALTER TABLE `t_story_chapter`
    ADD COLUMN `taskIntroduction` TEXT NULL COMMENT '章节任务信息' AFTER `summary`,
    ADD COLUMN `backgroundPicture` VARCHAR(500) NULL COMMENT '背景图片' AFTER `taskIntroduction`;

ALTER TABLE `t_story`
    CHANGE `defaultImage` `defaultImage` VARCHAR(500) CHARSET utf8mb4 NULL,
    CHANGE `failureCopywriting` `failureCopywriting` TEXT CHARSET utf8mb4 NULL,
    CHANGE `failurePicture` `failurePicture` VARCHAR(500) CHARSET utf8mb4 NULL,
    CHANGE `creator` `creator` BIGINT NULL,
    ADD COLUMN `defaultBackgroundPicture` VARCHAR(500) NULL COMMENT '默认背景图片' AFTER `taskIntroduction`;