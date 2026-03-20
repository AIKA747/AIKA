ALTER TABLE `t_gift_recorder`
    DROP COLUMN `updateAt`,
    DROP COLUMN `dataVersion`,
    CHANGE `storyRecorderId` `storyRecorderId` BIGINT NULL AFTER `id`,
    CHANGE `friendlyDegree` `friendDegree` INT NULL,
    ADD COLUMN `storyDegree` INT NULL AFTER `friendDegree`,
    CHANGE `creator` `creator` BIGINT NULL AFTER `storyDegree`;
