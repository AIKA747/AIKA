ALTER TABLE `message_record`
    CHANGE `textContent` `textContent` TEXT CHARSET utf8mb4 COMMENT '文本内容';
ALTER TABLE `game_message_record`
    CHANGE `textContent` `textContent` TEXT CHARSET utf8mb4 NULL COMMENT '文本内容';