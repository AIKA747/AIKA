ALTER TABLE `digital_human_profile`
    ADD COLUMN `gender` VARCHAR(255) DEFAULT 'HIDE' COMMENT '性别：MALE,FEMALE,HIDE' AFTER `objectId`;