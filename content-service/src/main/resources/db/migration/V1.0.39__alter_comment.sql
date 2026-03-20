ALTER TABLE `t_comment`
    ADD COLUMN `replyTo` json NULL COMMENT '评论中@的用户名' AFTER `creator`,
    ADD COLUMN `type` varchar(50) NULL AFTER `replyTo`;
