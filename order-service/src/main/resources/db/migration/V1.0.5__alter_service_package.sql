ALTER TABLE `service_package`
    ADD COLUMN `purchaseLimit` INT DEFAULT 0 NOT NULL COMMENT '限购次数；设置小于等于0时不限购' AFTER `description`;