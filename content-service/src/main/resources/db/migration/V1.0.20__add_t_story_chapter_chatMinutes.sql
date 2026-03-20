ALTER TABLE `t_story_chapter`
    ADD COLUMN `chatMinutes` INT DEFAULT 0 NULL COMMENT '章节聊天分钟数' AFTER `chapterRule`;