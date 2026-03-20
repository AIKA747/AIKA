ALTER TABLE `assistant_msg_record`
    CHANGE `json` `json` TEXT NULL COMMENT '若contentType=\' botRecommend\'或\'storyRecommend\'或\'gift\'，则保存到该json字段';
ALTER TABLE `message_record`
    CHANGE `fileProperty` `fileProperty` TEXT NULL;