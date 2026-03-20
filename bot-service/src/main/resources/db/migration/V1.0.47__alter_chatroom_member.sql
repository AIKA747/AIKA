ALTER TABLE `t_chatroom_member`
    ADD COLUMN `notifyTurnOff` VARCHAR(255) NULL COMMENT '在这个时间前不接收群消息通知，此字段是一个枚举' AFTER `memberRole`;