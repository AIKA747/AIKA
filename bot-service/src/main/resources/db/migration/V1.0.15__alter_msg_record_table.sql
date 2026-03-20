ALTER TABLE `assistant_msg_record`
    ADD COLUMN `digitHuman` TINYINT DEFAULT 0 NULL COMMENT '是否数字人' AFTER `fileProperty`,
    ADD COLUMN `videoUrl` VARCHAR(255) NULL COMMENT '视频文件' AFTER `digitHuman`,
    ADD COLUMN `videoStatus` VARCHAR(100) NULL COMMENT 'created,success,fail' AFTER `videoUrl`,
    CHANGE `userMessageStatus` `msgStatus` VARCHAR(100) NULL COMMENT '消息状态: created, processing, success, fail';

ALTER TABLE `message_record`
    CHANGE `userMessageStatus` `msgStatus` VARCHAR(100) NOT NULL COMMENT '消息状态：created, processing, success, fail';

