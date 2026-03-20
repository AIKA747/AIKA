ALTER TABLE `bot`
    ADD COLUMN `tags` varchar(255) NULL COMMENT '标签，逗号分隔' AFTER `salutationFrequency`;