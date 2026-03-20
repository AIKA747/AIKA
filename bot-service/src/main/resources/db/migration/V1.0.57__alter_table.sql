ALTER TABLE `t_chatroom_member`
    ADD COLUMN `clearTime` DATETIME NULL COMMENT '最近一次清理消息的时间' AFTER `lastLoadTime`;
ALTER TABLE `t_chatroom`
    ADD COLUMN `lastMessageTime` DATETIME NULL COMMENT '最新消息时间' AFTER `creatorType`;