ALTER TABLE `bot`
    ADD COLUMN `postingEnable` TINYINT DEFAULT 0 NULL COMMENT '是否开启自动发贴' AFTER `postingPrompt`;
ALTER TABLE `bot_temp`
    ADD COLUMN `postingEnable` TINYINT DEFAULT 0 NULL COMMENT '是否开启自动发贴' AFTER `postingPrompt`;