ALTER TABLE `message_record`
    CHANGE `textContent` `textContent` VARCHAR(1000) CHARSET utf8mb4 NULL COMMENT '文本内容';
ALTER TABLE `assistant_msg_record`
    CHANGE `textContent` `textContent` VARCHAR(1000) CHARSET utf8mb4 NULL COMMENT '文本内容';