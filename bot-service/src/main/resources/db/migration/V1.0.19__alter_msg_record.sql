ALTER TABLE `message_record`
    CHANGE `media` `media` VARCHAR(500) CHARSET utf8mb4 NULL COMMENT '多媒体（oss文件链接）';
ALTER TABLE `assistant_msg_record`
    CHANGE `media` `media` VARCHAR(500) CHARSET utf8mb4 NULL COMMENT '多媒体（oss文件链接）';