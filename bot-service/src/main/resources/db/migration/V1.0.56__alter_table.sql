ALTER TABLE `t_chatroom`
    CHANGE `roomAvatar` `roomAvatar` VARCHAR(500) CHARSET utf8mb4 NOT NULL COMMENT '群聊头像',
    CHANGE `description` `description` TEXT CHARSET utf8mb4 NOT NULL COMMENT '详情';