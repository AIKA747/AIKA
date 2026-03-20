ALTER TABLE `assistant_msg_record`
    ADD COLUMN `badAnswer` TINYINT DEFAULT 0 NOT NULL COMMENT '是否标记为bad answer' AFTER `videoStatus`,
    ADD COLUMN `regenerateNum` INT DEFAULT 0 NOT NULL COMMENT '重试次数' AFTER `badAnswer`;