ALTER TABLE `t_group_chat_records`
    ADD COLUMN `roid` INT NOT NULL COMMENT '聊天室id' AFTER `id`,
    ADD COLUMN `ct` VARCHAR(255) NOT NULL COMMENT '消息类型：\'TEXT\',\'VOICE\',\'IMAGE\',\'VIDEO\'' AFTER `st`;