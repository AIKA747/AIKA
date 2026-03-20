ALTER TABLE `game_message_record`
    ADD COLUMN `json` JSON NULL COMMENT '聊天json对象保存' AFTER `textContent`;