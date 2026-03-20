ALTER TABLE `user`
    ADD COLUMN `applePayload` TEXT NULL COMMENT 'apple登录时，获取到的用户信息' AFTER `googlePayload`,
    ADD COLUMN `facebookPayload` TEXT NULL COMMENT 'facebook登录时，获取到的用户信息' AFTER `applePayload`;