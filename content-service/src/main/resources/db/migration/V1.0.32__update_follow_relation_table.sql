ALTER TABLE `t_follow_relation`
    DROP COLUMN `botImage_cover`,
    DROP COLUMN `botImage_avatar`,
    ADD COLUMN `botImage` json NULL COMMENT '机器人信息';
