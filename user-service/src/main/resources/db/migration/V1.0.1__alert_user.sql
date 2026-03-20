alter table user
    add commentTotal INT(11) DEFAULT NULL COMMENT '(我分享的故事)评论数量' after followerTotal;