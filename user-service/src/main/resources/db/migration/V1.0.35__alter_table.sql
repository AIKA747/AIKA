ALTER TABLE `sensitive_file`
    ADD COLUMN `labels` TEXT NULL COMMENT '标签信息' AFTER `ip`;