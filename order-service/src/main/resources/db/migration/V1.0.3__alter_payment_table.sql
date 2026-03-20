ALTER TABLE `payment`
    ADD COLUMN `transactionId` VARCHAR(255) NULL COMMENT '苹果校验id' AFTER `creditCard`,
    ADD COLUMN `receipt` TEXT NULL COMMENT '苹果内购支付凭证' AFTER `transactionId`;
