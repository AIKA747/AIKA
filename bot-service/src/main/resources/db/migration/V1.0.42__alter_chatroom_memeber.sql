ALTER TABLE `t_chatroom_member`
    MODIFY COLUMN `notifyTurnOffTime` datetime NULL COMMENT '通知关闭截止时间',
    MODIFY COLUMN `theme` json NULL COMMENT '主题';
