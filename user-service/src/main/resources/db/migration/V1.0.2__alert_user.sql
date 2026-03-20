alter table user
    add bots JSON DEFAULT NULL COMMENT '机器人' after commentTotal;