ALTER TABLE `t_author`
    ADD COLUMN `status` VARCHAR(50) DEFAULT 'enabled' COMMENT '用户状态' AFTER `gender`;