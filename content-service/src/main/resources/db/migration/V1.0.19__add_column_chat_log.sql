ALTER TABLE `t_story_chat_log`
    CHANGE `contentType` `contentType` VARCHAR(255) CHARSET utf8mb4 NOT NULL COMMENT '记录类型：\'TEXT\',\'VOICE\',\'IMAGE\',\'VIDEO\',\'botRecommend\',\'storyRecommend\',gift',
    ADD COLUMN `gptJson` VARCHAR(1000) NULL AFTER `fileProperty`;