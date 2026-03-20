alter table user
    add registerTime DATETIME DEFAULT NULL COMMENT '邮箱注册验证成功时间' after lastReleaseBotAt;