ALTER TABLE `t_message_feature`
    CHANGE `txt` `txt` TEXT CHARSET utf8mb4 NULL COMMENT '文本内容',
    ADD COLUMN `rmessage` TEXT NULL COMMENT '回复的消息内容' AFTER `rid`,
    ADD COLUMN `mid` BIGINT NOT NULL COMMENT '消息原本id' AFTER `roomId`;
ALTER TABLE `t_group_chat_records`
    CHANGE `txt` `txt` TEXT CHARSET utf8mb4 NULL COMMENT '文本内容';

