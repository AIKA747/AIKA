ALTER TABLE `message_record`
    CHANGE `textContent` `textContent` VARCHAR(255) CHARSET utf8mb4 NULL COMMENT '文本内容',
    CHANGE `media` `media` VARCHAR(255) CHARSET utf8mb4 NULL COMMENT '多媒体（oss文件链接）';