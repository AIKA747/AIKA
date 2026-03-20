ALTER TABLE `user`
    ADD COLUMN `habit` json NULL COMMENT '习惯向量，比如 0202' AFTER `facebookPayload`,
    ADD COLUMN `personality` json NULL COMMENT '人格向量  比如 101' AFTER `habit`,
    ADD COLUMN `competitive` json NULL COMMENT '竞技类兴趣向量 比如 0100' AFTER `personality`,
    ADD COLUMN `skillBased` json NULL COMMENT '技巧类兴趣向量 比如 0010' AFTER `competitive`,
    ADD COLUMN `artistic` json NULL COMMENT '艺术类兴趣向量' AFTER `skillBased`,
    ADD COLUMN `lifestyle` json NULL COMMENT '生活方式类兴趣向量' AFTER `artistic`,
    ADD COLUMN `intelligence` json NULL COMMENT '智力类向量' AFTER `lifestyle`;