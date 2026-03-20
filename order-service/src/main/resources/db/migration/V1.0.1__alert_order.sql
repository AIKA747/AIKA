alter table `order`
    add groupId BIGINT DEFAULT NULL COMMENT '用户分组id' after email;