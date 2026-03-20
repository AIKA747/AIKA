ALTER TABLE `t_story_chat_log`
    CHANGE `userMessageStatus` `msgStatus` ENUM('created','processing','success','fail') NULL COMMENT '用户消息状态：0未处理，1处理中，2已回复';