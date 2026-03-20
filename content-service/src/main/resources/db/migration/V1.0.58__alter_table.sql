ALTER TABLE `t_comment`
    ADD COLUMN `replyCommontInfo` TEXT NULL COMMENT '回复的评论信息' AFTER `type`;