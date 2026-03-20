ALTER TABLE `did_req_log`
    ADD COLUMN `webhookResult` TEXT NULL COMMENT '回调结果' AFTER `createdAt`,
    ADD COLUMN `webhookAt` DATETIME NULL COMMENT '回调时间' AFTER `webhookResult`;