ALTER TABLE `t_play_log`
    CHANGE `creator` `creator` BIGINT NULL;
ALTER TABLE `t_story_chat_log` CHANGE `json` `json` TEXT NULL COMMENT '若contentType=\'botRecommend\'或\'storyRecommend\'或\'gift\'，则保存到该json字段';