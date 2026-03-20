ALTER TABLE `operation_log`
    ADD COLUMN `ip` VARCHAR(100) NOT NULL AFTER `action`,
    ADD COLUMN `path` VARCHAR(100) NOT NULL AFTER `ip`,
    CHANGE `finalValue` `finalValue` TEXT CHARSET utf8mb4 NULL COMMENT '最终值';