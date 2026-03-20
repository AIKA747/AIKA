ALTER TABLE `push_job`
    ADD COLUMN `remark` TEXT NULL COMMENT '备注字段' AFTER `body`;