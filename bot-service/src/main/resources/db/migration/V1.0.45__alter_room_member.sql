ALTER TABLE `t_chatroom_member`
    ADD COLUMN `lastLoadTime` DATETIME NULL COMMENT '最近一次加载消息时间，若群聊不展示历史消息则仅查询大于该时间的消息' AFTER `lastReadTime`;