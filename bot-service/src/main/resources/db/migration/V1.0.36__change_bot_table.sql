ALTER TABLE `bot`
    ADD COLUMN `postingFrequecy` VARCHAR(255) NULL COMMENT '发帖频率' AFTER `dialogueTemplates`,
    ADD COLUMN `postingPrompt` TEXT NULL COMMENT '发帖prompt' AFTER `postingFrequecy`;
ALTER TABLE `bot_temp`
    ADD COLUMN `postingFrequecy` VARCHAR(255) NULL COMMENT '发帖频率' AFTER `dialogueTemplates`,
    ADD COLUMN `postingPrompt` TEXT NULL COMMENT '发帖prompt' AFTER `postingFrequecy`;
