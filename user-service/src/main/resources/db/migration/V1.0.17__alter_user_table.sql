ALTER TABLE `user`
    ADD COLUMN `googlePayload` TEXT NULL COMMENT 'google登录时，获取到的用户信息' AFTER `registerType`