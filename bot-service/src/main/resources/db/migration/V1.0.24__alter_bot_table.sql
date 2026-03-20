ALTER TABLE `bot`
    ADD COLUMN `dialogueTemplates` JSON NULL COMMENT '聊天提示语' AFTER `tags`;
ALTER TABLE `bot_temp`
    ADD COLUMN `tags` VARCHAR(255) NULL COMMENT '标签，逗号分隔' AFTER `salutationFrequency`,
    ADD COLUMN `dialogueTemplates` JSON NULL COMMENT '聊天提示语' AFTER `tags`