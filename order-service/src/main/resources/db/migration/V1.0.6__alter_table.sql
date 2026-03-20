ALTER TABLE `service_package`
    ADD COLUMN `sortNo` INT DEFAULT 0 NULL COMMENT '排序字段，越大越靠前' AFTER `status`;