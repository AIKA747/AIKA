ALTER TABLE `t_chatroom_member`
    CHANGE `memberId` `memberId` BIGINT NOT NULL COMMENT '成员id',
    CHANGE `creator` `creator` BIGINT NOT NULL COMMENT '创建人id';
